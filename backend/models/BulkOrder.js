const mongoose = require('mongoose');

const bulkOrderSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  companyName: { type: String, required: true, trim: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  productType: {
    type: String,
    enum: ['plain', 'flavoured', 'both'],
    required: true
  },
  flavoursRequired: [String], // If flavoured/both
  quantityKg: { type: Number, required: true, min: 1 },
  deliveryLocation: { type: String, required: true },
  message: { type: String },
  status: {
    type: String,
    enum: ['new', 'contacted', 'quoted', 'confirmed', 'rejected'],
    default: 'new'
  },
  adminNotes: String,
  quotedPrice: Number,
  referenceNumber: { type: String, unique: true }
}, { timestamps: true });

bulkOrderSchema.pre('save', async function (next) {
  if (!this.referenceNumber) {
    const count = await mongoose.model('BulkOrder').countDocuments();
    this.referenceNumber = `FKBULK${Date.now()}${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('BulkOrder', bulkOrderSchema);
