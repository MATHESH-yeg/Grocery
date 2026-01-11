const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

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




