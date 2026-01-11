require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/Admin');
const User = require('./models/User');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get admin details from user
    const name = await question('Enter admin name: ');
    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password: ');
    const mobile = await question('Enter admin mobile number: ');

    // Check if admin already exists in Admin collection
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log('\n❌ Admin with this email already exists!');
      await mongoose.connection.close();
      rl.close();
      process.exit(1);
    }

    // Check if email exists in User collection
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('\n⚠️  A regular user with this email already exists!');
      console.log('   Admin accounts must use a different email or delete the user first.');
      await mongoose.connection.close();
      rl.close();
      process.exit(1);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin in Admin collection
    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
      mobile,
      role: 'admin',
    });

    await admin.save();
    console.log('\n✅ Admin user created successfully!');
    console.log(`   Email: ${email}`);
    console.log(`   Role: admin`);
    console.log('\n📝 You can now login with these credentials to access the admin panel.');

    // Close connection
    await mongoose.connection.close();
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating admin:', error.message);
    await mongoose.connection.close();
    rl.close();
    process.exit(1);
  }
};

createAdmin();



