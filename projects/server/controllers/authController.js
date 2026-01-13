const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Email configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.register = async (req, res) => {
  const { name, email, password, mobile, addresses, role } = req.body;

  if (role === 'admin' && !email.toLowerCase().endsWith('@admin.com')) {
    return res.status(400).json({ msg: 'Admin registration requires an @admin.com email address' });
  }

  if (role !== 'admin' && email.toLowerCase().endsWith('@admin.com')) {
    return res.status(400).json({ msg: 'Emails ending in @admin.com are reserved for administrator accounts.' });
  }

  try {
    const targetModel = role === 'admin' ? Admin : User;

    let existingUser = await targetModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const newUser = new targetModel({
      name,
      email,
      password,
      mobile,
      ...(role === 'admin' ? { role: 'admin' } : { addresses: addresses || [] }),
    });

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();

    const payload = {
      user: {
        id: newUser.id,
        role: role === 'admin' ? 'admin' : 'user',
        collection: role === 'admin' ? 'admins' : 'users',
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user;
    let collectionName;
    let userRole;

    // Priority Check: Check Admin first if domain matches
    if (email.toLowerCase().endsWith('@admin.com')) {
      user = await Admin.findOne({ email });
      if (user) {
        collectionName = 'admins';
        userRole = user.role || 'admin';
      }
    }

    // Fallback/Standard Check: If not found as Admin (or not an admin domain), check User
    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        collectionName = 'users';
        userRole = 'user';
      }
    }

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: userRole,
        collection: collectionName,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await User.findOne({ email });
    let model = User;

    if (!user) {
      user = await Admin.findOne({ email });
      model = Admin;
    }

    if (!user) {
      return res.status(404).json({ msg: 'User with this email does not exist' });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = otpExpires;
    await user.save();

    // Send Email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #4CAF50;">Password Reset</h2>
          <p>You requested a password reset. Please use the following OTP to proceed:</p>
          <div style="background: #f4f4f4; padding: 10px; font-size: 24px; font-weight: bold; text-align: center; letter-spacing: 5px; margin: 20px 0;">
            ${otp}
          </div>
          <p>This OTP is valid for 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('--- MOCK EMAIL START ---');
      console.log(`To: ${email}`);
      console.log(`OTP: ${otp}`);
      console.log('--- MOCK EMAIL END ---');
      return res.json({ msg: 'OTP sent to email (Simulated - No email credentials provided)', simulated: true, otp });
    }

    await transporter.sendMail(mailOptions);
    res.json({ msg: 'OTP sent to email' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    let user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      user = await Admin.findOne({
        email,
        resetPasswordOTP: otp,
        resetPasswordExpires: { $gt: Date.now() }
      });
    }

    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    res.json({ msg: 'OTP verified successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    let user = await User.findOne({
      email,
      resetPasswordOTP: otp,
      resetPasswordExpires: { $gt: Date.now() }
    });
    let model = User;

    if (!user) {
      user = await Admin.findOne({
        email,
        resetPasswordOTP: otp,
        resetPasswordExpires: { $gt: Date.now() }
      });
      model = Admin;
    }

    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear OTP fields
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ msg: 'Password reset successful' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};





