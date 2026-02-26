const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  description: String,
  discountType: { type: String, enum: ['percentage', 'flat'], required: true },
  discountValue: { type: Number, required: true },
  minOrderValue: { type: Number, default: 0 },
  maxDiscount: Number, // Cap for percentage discounts
  usageLimit: { type: Number, default: null }, // null = unlimited
  usedCount: { type: Number, default: 0 },
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  validFrom: { type: Date, default: Date.now },
  validUntil: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  applicableCategories: [{ type: String, enum: ['plain', 'flavoured', 'all'] }]
}, { timestamps: true });

couponSchema.methods.isValid = function (userId, orderValue) {
  const now = new Date();
  if (!this.isActive) return { valid: false, message: 'Coupon is inactive' };
  if (now < this.validFrom) return { valid: false, message: 'Coupon not yet valid' };
  if (now > this.validUntil) return { valid: false, message: 'Coupon has expired' };
  if (this.usageLimit && this.usedCount >= this.usageLimit) return { valid: false, message: 'Coupon usage limit reached' };
  if (this.usedBy.includes(userId)) return { valid: false, message: 'Coupon already used by this account' };
  if (orderValue < this.minOrderValue) return { valid: false, message: `Minimum order value ₹${this.minOrderValue} required` };
  return { valid: true };
};

module.exports = mongoose.model('Coupon', couponSchema);
