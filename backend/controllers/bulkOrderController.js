const BulkOrder = require('../models/BulkOrder');
const Coupon = require('../models/Coupon');

// =================== BULK ORDER ===================

// @desc    Submit bulk order inquiry
// @route   POST /api/bulk-orders
const createBulkOrder = async (req, res, next) => {
  try {
    const {
      fullName, companyName, phone, email,
      productType, flavoursRequired, quantityKg,
      deliveryLocation, message
    } = req.body;

    const bulkOrder = await BulkOrder.create({
      fullName, companyName, phone, email,
      productType, flavoursRequired, quantityKg,
      deliveryLocation, message
    });

    res.status(201).json({
      success: true,
      message: 'Your bulk order inquiry has been submitted. Our team will contact you within 24 hours.',
      referenceNumber: bulkOrder.referenceNumber
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin - Get all bulk orders
// @route   GET /api/admin/bulk-orders
const adminGetBulkOrders = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const bulkOrders = await BulkOrder.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: bulkOrders.length, bulkOrders });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin - Update bulk order status
// @route   PUT /api/admin/bulk-orders/:id
const adminUpdateBulkOrder = async (req, res, next) => {
  try {
    const { status, adminNotes, quotedPrice } = req.body;
    const bulkOrder = await BulkOrder.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes, quotedPrice },
      { new: true }
    );
    if (!bulkOrder) return res.status(404).json({ success: false, message: 'Bulk order not found.' });
    res.json({ success: true, message: 'Bulk order updated.', bulkOrder });
  } catch (error) {
    next(error);
  }
};

// =================== COUPON ===================

// @desc    Validate coupon code
// @route   POST /api/coupons/validate
const validateCoupon = async (req, res, next) => {
  try {
    const { code, orderValue } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found.' });
    }

    const validity = coupon.isValid(req.user._id, orderValue);
    if (!validity.valid) {
      return res.status(400).json({ success: false, message: validity.message });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.min((orderValue * coupon.discountValue) / 100, coupon.maxDiscount || Infinity);
    } else {
      discount = coupon.discountValue;
    }

    res.json({
      success: true,
      message: `Coupon applied! You save ₹${discount.toFixed(2)}`,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discount: Math.round(discount)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin - Create coupon
// @route   POST /api/admin/coupons
const adminCreateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, message: 'Coupon created.', coupon });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin - Get all coupons
// @route   GET /api/admin/coupons
const adminGetCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin - Toggle coupon status
// @route   PUT /api/admin/coupons/:id
const adminUpdateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found.' });
    res.json({ success: true, coupon });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBulkOrder, adminGetBulkOrders, adminUpdateBulkOrder,
  validateCoupon, adminCreateCoupon, adminGetCoupons, adminUpdateCoupon
};
