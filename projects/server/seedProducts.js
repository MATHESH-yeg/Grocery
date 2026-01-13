require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const sampleProducts = [
  // Vegetables
  {
    name: 'Fresh Tomatoes',
    description: 'Red, ripe tomatoes perfect for salads and cooking. Locally sourced and organic.',
    price: 45.00,
    category: 'Vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1558818498-28c3e002b655?w=500&q=80',
    stock: 50,
  },
  {
    name: 'Organic Carrots',
    description: 'Fresh, crunchy carrots rich in beta-carotene. Great for salads and cooking.',
    price: 60.00,
    category: 'Vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&q=80',
    stock: 40,
  },
  {
    name: 'Green Bell Peppers',
    description: 'Crisp and fresh bell peppers. Perfect for stir-fries and salads.',
    price: 80.00,
    category: 'Vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=500&q=80',
    stock: 30,
  },
  {
    name: 'Fresh Spinach',
    description: 'Tender, leafy spinach packed with iron and vitamins. Ideal for salads and smoothies.',
    price: 35.00,
    category: 'Vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80',
    stock: 25,
  },
  {
    name: 'Broccoli',
    description: 'Fresh broccoli florets. High in fiber and vitamin C.',
    price: 70.00,
    category: 'Vegetables',
    imageUrl: 'https://images.unsplash.com/photo-1455243627921-9fce67b31e71?w=500&q=80',
    stock: 35,
  },
  // Fruits
  {
    name: 'Red Apples',
    description: 'Sweet, crisp red apples. Perfect for snacking and baking.',
    price: 120.00,
    category: 'Fruits',
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&q=80',
    stock: 60,
  },
  {
    name: 'Fresh Bananas',
    description: 'Ripe, yellow bananas. Rich in potassium and energy.',
    price: 50.00,
    category: 'Fruits',
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&q=80',
    stock: 80,
  },
  {
    name: 'Sweet Oranges',
    description: 'Juicy, vitamin C-rich oranges. Fresh and tangy.',
    price: 90.00,
    category: 'Fruits',
    imageUrl: 'https://images.unsplash.com/photo-1582910831295-df58cbd47922?w=500&q=80',
    stock: 45,
  },
  {
    name: 'Fresh Strawberries',
    description: 'Sweet, red strawberries. Perfect for desserts and smoothies.',
    price: 150.00,
    category: 'Fruits',
    imageUrl: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&q=80',
    stock: 20,
  },
  {
    name: 'Green Grapes',
    description: 'Sweet and seedless green grapes. Great for snacking.',
    price: 180.00,
    category: 'Fruits',
    imageUrl: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=500&q=80',
    stock: 30,
  },
  // Beverages
  {
    name: 'Fresh Orange Juice',
    description: '100% pure orange juice. No added sugar or preservatives.',
    price: 80.00,
    category: 'Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&q=80',
    stock: 40,
  },
  {
    name: 'Apple Juice',
    description: 'Fresh apple juice. Natural and refreshing.',
    price: 75.00,
    category: 'Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=500&q=80',
    stock: 35,
  },
  {
    name: 'Coconut Water',
    description: 'Natural coconut water. Hydrating and refreshing.',
    price: 60.00,
    category: 'Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1525385133512-2f4963f9bc95?w=500&q=80',
    stock: 50,
  },
  {
    name: 'Fresh Lemonade',
    description: 'Homemade lemonade. Sweet and tangy.',
    price: 55.00,
    category: 'Beverages',
    imageUrl: 'https://images.unsplash.com/photo-1523677011783-c91afe34c8eb?w=500&q=80',
    stock: 30,
  },
  // Snacks
  {
    name: 'Mixed Nuts',
    description: 'Premium mixed nuts. Almonds, cashews, and walnuts.',
    price: 250.00,
    category: 'Snacks',
    imageUrl: 'https://images.unsplash.com/photo-1511067007398-7e4b90cfa4bc?w=500&q=80',
    stock: 25,
  },
  {
    name: 'Organic Trail Mix',
    description: 'Healthy trail mix with dried fruits and nuts.',
    price: 180.00,
    category: 'Snacks',
    imageUrl: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=500&q=80',
    stock: 30,
  },
  {
    name: 'Granola Bars',
    description: 'Crunchy granola bars. Perfect for on-the-go snacking.',
    price: 120.00,
    category: 'Snacks',
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80',
    stock: 40,
  },
  {
    name: 'Dark Chocolate',
    description: 'Premium dark chocolate. 70% cocoa, rich and smooth.',
    price: 200.00,
    category: 'Snacks',
    imageUrl: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=500&q=80',
    stock: 35,
  },
  // Dairy
  {
    name: 'Fresh Milk',
    description: 'Whole milk. Fresh from local farms. 1 liter pack.',
    price: 65.00,
    category: 'Dairy',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-1255d1426639?w=500&q=80',
    stock: 50,
  },
  {
    name: 'Greek Yogurt',
    description: 'Creamy Greek yogurt. High in protein and probiotics.',
    price: 95.00,
    category: 'Dairy',
    imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=80',
    stock: 30,
  },
  {
    name: 'Fresh Cheese',
    description: 'Mozzarella cheese. Perfect for pizzas and salads.',
    price: 150.00,
    category: 'Dairy',
    imageUrl: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?w=500&q=80',
    stock: 25,
  },
  {
    name: 'Butter',
    description: 'Premium butter. Made from fresh cream.',
    price: 110.00,
    category: 'Dairy',
    imageUrl: 'https://images.unsplash.com/photo-1589985270826-4b7fe135a9d4?w=500&q=80',
    stock: 40,
  },
  {
    name: 'Fresh Eggs',
    description: 'Farm-fresh eggs. Pack of 12 eggs.',
    price: 90.00,
    category: 'Dairy',
    imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&q=80',
    stock: 60,
  },
];

const seedProducts = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log(`✅ Successfully seeded ${sampleProducts.length} products with high-quality images`);

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts();
