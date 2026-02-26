const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');

dotenv.config();

const products = [
  // ============ PLAIN MAKHANA ============
  {
    name: 'Classic Plain Makhana',
    slug: 'classic-plain-makhana',
    category: 'plain',
    description: 'Premium lotus seeds handpicked from the pristine lakes of Bihar. Zero oil, zero additives — just pure, natural goodness. Our Classic Plain Makhana retains all the natural nutrients making it the perfect wholesome snack.',
    shortDescription: 'Pure, natural, handpicked lotus seeds from Bihar.',
    ingredients: ['Lotus Seeds (Makhana)'],
    nutritionInfo: { calories: 347, protein: '9.7g', carbs: '76.9g', fat: '0.1g', fiber: '14.5g' },
    variants: [
      { weight: '100g', price: 149, mrp: 199, stock: 500 },
      { weight: '200g', price: 279, mrp: 349, stock: 300 },
      { weight: '500g', price: 649, mrp: 799, stock: 200 }
    ],
    thumbnail: 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=400',
    images: ['https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=800'],
    tags: ['plain', 'natural', 'healthy', 'keto', 'diabetic-friendly'],
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Roasted Plain Makhana',
    slug: 'roasted-plain-makhana',
    category: 'plain',
    description: 'Slow-roasted to crunchy perfection with no oil, no preservatives. Our roasting process enhances the natural nutty flavor while keeping every nutritional benefit intact. The crunchier cousin of our classic version.',
    shortDescription: 'Slow-roasted, extra crunchy — no oil, no preservatives.',
    ingredients: ['Lotus Seeds (Makhana)'],
    nutritionInfo: { calories: 355, protein: '9.7g', carbs: '77g', fat: '0.2g', fiber: '14g' },
    variants: [
      { weight: '100g', price: 159, mrp: 199, stock: 450 },
      { weight: '200g', price: 299, mrp: 379, stock: 250 },
      { weight: '500g', price: 699, mrp: 849, stock: 150 }
    ],
    thumbnail: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
    images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800'],
    tags: ['roasted', 'crunchy', 'natural', 'healthy'],
    isActive: true,
    isFeatured: true
  },

  // ============ FLAVOURED MAKHANA ============
  {
    name: 'Peri Peri Makhana',
    slug: 'peri-peri-makhana',
    category: 'flavoured',
    flavour: 'Peri Peri',
    description: 'Fiery African-inspired peri peri spices meet the humble makhana. A bold, tangy, and spicy adventure in every bite. Made with real peri peri pepper blend, paprika, and a hint of garlic — for those who like it hot!',
    shortDescription: 'Bold, tangy, fiery — a spicy adventure in every crunch.',
    ingredients: ['Lotus Seeds', 'Peri Peri Seasoning', 'Paprika', 'Garlic Powder', 'Sea Salt', 'Sunflower Oil (minimal)'],
    nutritionInfo: { calories: 380, protein: '8.5g', carbs: '74g', fat: '4.5g', fiber: '13g' },
    variants: [
      { weight: '70g', price: 129, mrp: 169, stock: 600 },
      { weight: '150g', price: 249, mrp: 299, stock: 400 },
      { weight: '300g', price: 449, mrp: 549, stock: 200 }
    ],
    thumbnail: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
    images: ['https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800'],
    tags: ['spicy', 'peri-peri', 'flavoured', 'bold'],
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Cheese & Herbs Makhana',
    slug: 'cheese-herbs-makhana',
    category: 'flavoured',
    flavour: 'Cheese & Herbs',
    description: 'Indulge without the guilt. Rich cheddar cheese powder meets a medley of Italian herbs — oregano, basil, thyme — to create a makhana that tastes like a guilty pleasure but is actually nutritious.',
    shortDescription: 'Rich cheese meets aromatic herbs — guilt-free indulgence.',
    ingredients: ['Lotus Seeds', 'Cheddar Cheese Powder', 'Oregano', 'Basil', 'Thyme', 'Sea Salt', 'Sunflower Oil'],
    nutritionInfo: { calories: 390, protein: '10g', carbs: '72g', fat: '5.5g', fiber: '12.5g' },
    variants: [
      { weight: '70g', price: 139, mrp: 179, stock: 550 },
      { weight: '150g', price: 259, mrp: 319, stock: 350 },
      { weight: '300g', price: 469, mrp: 579, stock: 180 }
    ],
    thumbnail: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400',
    images: ['https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800'],
    tags: ['cheese', 'herbs', 'flavoured', 'savory'],
    isActive: true,
    isFeatured: true
  },
  {
    name: 'Pudina Masala Makhana',
    slug: 'pudina-masala-makhana',
    category: 'flavoured',
    flavour: 'Pudina Masala',
    description: 'Classic Indian chaat masala meets cool pudina (mint) in this refreshing crowd-pleaser. Inspired by the chaats of Delhi\'s streets — every bite takes you to Chandni Chowk.',
    shortDescription: 'Cool mint meets zesty chaat masala — Desi flavour at its best.',
    ingredients: ['Lotus Seeds', 'Dried Mint', 'Chaat Masala', 'Amchur', 'Black Salt', 'Cumin', 'Sunflower Oil'],
    nutritionInfo: { calories: 372, protein: '9g', carbs: '75g', fat: '3.8g', fiber: '13.5g' },
    variants: [
      { weight: '70g', price: 119, mrp: 149, stock: 700 },
      { weight: '150g', price: 229, mrp: 279, stock: 450 },
      { weight: '300g', price: 419, mrp: 509, stock: 220 }
    ],
    thumbnail: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400',
    images: ['https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800'],
    tags: ['pudina', 'mint', 'masala', 'indian', 'flavoured'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Cream & Onion Makhana',
    slug: 'cream-onion-makhana',
    category: 'flavoured',
    flavour: 'Cream & Onion',
    description: 'The beloved cream & onion flavor reimagined in a healthier avatar. Creamy, mildly sweet onion goodness that\'s been a snack staple for generations — now in a guilt-free makhana form.',
    shortDescription: 'The timeless classic — creamy, mild, and universally loved.',
    ingredients: ['Lotus Seeds', 'Cream Powder', 'Onion Powder', 'Garlic Powder', 'Sea Salt', 'Sunflower Oil'],
    nutritionInfo: { calories: 385, protein: '9.2g', carbs: '73g', fat: '5g', fiber: '12g' },
    variants: [
      { weight: '70g', price: 129, mrp: 159, stock: 600 },
      { weight: '150g', price: 249, mrp: 299, stock: 380 },
      { weight: '300g', price: 449, mrp: 539, stock: 190 }
    ],
    thumbnail: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400',
    images: ['https://images.unsplash.com/photo-1547592180-85f173990554?w=800'],
    tags: ['cream', 'onion', 'mild', 'flavoured', 'classic'],
    isActive: true,
    isFeatured: false
  },
  {
    name: 'Tangy Tomato Makhana',
    slug: 'tangy-tomato-makhana',
    category: 'flavoured',
    flavour: 'Tangy Tomato',
    description: 'Sun-dried tomato essence with a tangy twist of amchur and a pinch of red chilli. Vibrant, bold, and full of character — the kind of snack you can\'t stop at just one handful.',
    shortDescription: 'Sun-dried tomato tang meets punchy spice — addictively good.',
    ingredients: ['Lotus Seeds', 'Tomato Powder', 'Amchur', 'Red Chilli', 'Paprika', 'Sea Salt', 'Sunflower Oil'],
    nutritionInfo: { calories: 376, protein: '8.8g', carbs: '74.5g', fat: '4.2g', fiber: '13g' },
    variants: [
      { weight: '70g', price: 129, mrp: 159, stock: 650 },
      { weight: '150g', price: 249, mrp: 299, stock: 420 },
      { weight: '300g', price: 449, mrp: 539, stock: 210 }
    ],
    thumbnail: 'https://images.unsplash.com/photo-1532347231146-80afc9e3df2b?w=400',
    images: ['https://images.unsplash.com/photo-1532347231146-80afc9e3df2b?w=800'],
    tags: ['tomato', 'tangy', 'flavoured', 'spicy'],
    isActive: true,
    isFeatured: true
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({}); // 🔥 IMPORTANT: Clear all users

    // Insert products
    await Product.insertMany(products);
    console.log(`✅ ${products.length} products seeded`);

    // 🔥 Force recreate admin user (Guaranteed Fix)
    await User.create({
      name: 'Fox Khana Admin',
      email: 'admin@foxkhana.com',
      password: 'Admin@123',
      role: 'admin'
    });

    console.log('✅ Admin user recreated: admin@foxkhana.com / Admin@123');

    console.log('🦊 Fox Khana database seeded successfully!');
    process.exit(0);

  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDB();