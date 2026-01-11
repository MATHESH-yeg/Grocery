const User = require('../models/User');
const Admin = require('../models/Admin');

// @route    GET api/users/me
// @desc     Get current user's profile
// @access   Private
exports.getMe = async (req, res) => {
  try {
    // Check which collection the user belongs to
    if (req.user.collection === 'admins') {
      const admin = await Admin.findById(req.user.id).select('-password');
      if (!admin) {
        return res.status(404).json({ msg: 'Admin not found' });
      }
      // Return admin data with role for frontend compatibility
      return res.json({ ...admin.toObject(), role: admin.role || 'admin' });
    }

    // Regular user
    const user = await User.findById(req.user.id).select('-password').populate('wishlist');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    // Return user data with role for frontend compatibility
    res.json({ ...user.toObject(), role: 'user' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route    PUT api/users/me
// @desc     Update user profile
// @access   Private
exports.updateMe = async (req, res) => {
  const { name, email, mobile } = req.body;

  // Build user object
  const userFields = {};
  if (name) userFields.name = name;
  if (email) userFields.email = email;
  if (mobile) userFields.mobile = mobile;

  try {
    // Only allow regular users to update their profile via this endpoint
    if (req.user.collection === 'admins') {
      return res.status(403).json({ msg: 'Admins should use admin endpoints' });
    }

    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user = await User.findOneAndUpdate(
      { _id: req.user.id },
      { $set: userFields },
      { new: true }
    ).select('-password');

    res.json({ ...user.toObject(), role: 'user' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route    PUT api/users/me/addresses
// @desc     Add or update a delivery address
// @access   Private
exports.addOrUpdateAddress = async (req, res) => {
  const { street, city, state, zipCode, country, addressId } = req.body;

  const newAddress = {
    street,
    city,
    state,
    zipCode,
    country,
  };

  try {
    // Only regular users can manage addresses
    if (req.user.collection === 'admins') {
      return res.status(403).json({ msg: 'Admins cannot manage delivery addresses' });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (addressId) {
      // Update existing address
      const addressIndex = user.addresses.findIndex(addr => addr._id.toString() === addressId);
      if (addressIndex === -1) {
        return res.status(404).json({ msg: 'Address not found' });
      }
      user.addresses[addressIndex] = { ...user.addresses[addressIndex]._doc, ...newAddress };
    } else {
      // Add new address
      user.addresses.unshift(newAddress);
    }

    await user.save();
    res.json(user.addresses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route    DELETE api/users/me/addresses/:address_id
// @desc     Delete an address
// @access   Private
exports.deleteAddress = async (req, res) => {
  try {
    // Only regular users can manage addresses
    if (req.user.collection === 'admins') {
      return res.status(403).json({ msg: 'Admins cannot manage delivery addresses' });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Remove address
    user.addresses = user.addresses.filter(
      (address) => address._id.toString() !== req.params.address_id
    );

    await user.save();

    res.json(user.addresses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};




