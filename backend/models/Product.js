const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const variantSchema = new mongoose.Schema({
  weight: { type: String, required: true }, // e.g., "100g", "200g", "500g"
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  stock: { type: Number, default: 0 }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true },
  category: {
    type: String,
    enum: ['plain', 'flavoured'],
    required: true
  },
  flavour: { type: String }, // For flavoured products
  description: { type: String, required: true },
  shortDescription: { type: String },
  ingredients: [String],
  nutritionInfo: {
    calories: Number,
    protein: String,
    carbs: String,
    fat: String,
    fiber: String
  },
  variants: [variantSchema],
  images: [{ type: String }],
  thumbnail: { type: String },
  tags: [String],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  couponApplicable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Update rating on review save
productSchema.methods.calculateRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
  } else {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating = (sum / this.reviews.length).toFixed(1);
    this.numReviews = this.reviews.length;
  }
};

productSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model('Product', productSchema);

// const mongoose = require('mongoose');

// const reviewSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   name: { type: String, required: true },
//   rating: { type: Number, required: true, min: 1, max: 5 },
//   comment: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now }
// });

// const variantSchema = new mongoose.Schema({
//   weight: { type: String, required: true }, // e.g., "100g", "200g", "500g"
//   price: { type: Number, required: true },
//   mrp: { type: Number, required: true },
//   stock: { type: Number, default: 0 }
// });

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true, trim: true },
//   slug: { type: String, required: true, unique: true, lowercase: true },
//   category: {
//     type: String,
//     enum: ['plain', 'flavoured'],
//     required: true
//   },
//   flavour: { type: String }, // For flavoured products
//   description: { type: String, required: true },
//   shortDescription: { type: String },
//   ingredients: [String],
//   nutritionInfo: {
//     calories: Number,
//     protein: String,
//     carbs: String,
//     fat: String,
//     fiber: String
//   },
//   variants: [variantSchema],
//   images: [{ type: String }],
//   thumbnail: { type: String },
//   tags: [String],
//   isActive: { type: Boolean, default: true },
//   isFeatured: { type: Boolean, default: false },
//   reviews: [reviewSchema],
//   rating: { type: Number, default: 0 },
//   numReviews: { type: Number, default: 0 },
//   couponApplicable: { type: Boolean, default: true },
//   createdAt: { type: Date, default: Date.now }
// }, { timestamps: true });

// // Update rating on review save
// productSchema.methods.calculateRating = function () {
//   if (this.reviews.length === 0) {
//     this.rating = 0;
//     this.numReviews = 0;
//   } else {
//     const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
//     this.rating = (sum / this.reviews.length).toFixed(1);
//     this.numReviews = this.reviews.length;
//   }
// };

// productSchema.index({ category: 1, isActive: 1 });
// productSchema.index({ slug: 1 });

// module.exports = mongoose.model('Product', productSchema);
