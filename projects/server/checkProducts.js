require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const checkProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const count = await Product.countDocuments();
    console.log(`📦 Total products in database: ${count}`);

    if (count === 0) {
      console.log('\n⚠️  No products found in database!');
      console.log('💡 Run this command to add sample products:');
      console.log('   node seedProducts.js\n');
    } else {
      console.log('\n✅ Products exist in database');
      const sample = await Product.find().limit(3);
      console.log('\nSample products:');
      sample.forEach((p) => {
        console.log(`   - ${p.name} (₹${p.price})`);
      });
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkProducts();




