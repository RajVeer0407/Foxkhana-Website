const Order = require('../models/Order');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Razorpay = require('razorpay');
const crypto = require('crypto');

// Lazy init — only created when payment is actually requested
const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID.includes('xxxx')) {
    return null; // Razorpay not configured yet
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
};

// @desc    Create Razorpay order
// @route   POST /api/orders/create-payment
const createPaymentOrder = async (req, res, next) => {
  try {
    const { items, couponCode } = req.body;

    // Calculate totals from DB prices (never trust client)
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.isActive) {
        return res.status(400).json({ success: false, message: `Product ${item.name} is not available.` });
      }
      const variant = product.variants.find(v => v.weight === item.weight);
      if (!variant) {
        return res.status(400).json({ success: false, message: `Variant not found for ${product.name}` });
      }
      if (variant.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name} - ${item.weight}` });
      }

      const lineTotal = variant.price * item.quantity;
      subtotal += lineTotal;

      validatedItems.push({
        product: product._id,
        name: product.name,
        thumbnail: product.thumbnail,
        variant: { weight: variant.weight, price: variant.price },
        quantity: item.quantity,
        price: lineTotal
      });
    }

    // Apply coupon if provided
    let discount = 0;
    let couponData = null;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (coupon) {
        const validity = coupon.isValid(req.user._id, subtotal);
        if (validity.valid) {
          if (coupon.discountType === 'percentage') {
            discount = Math.min((subtotal * coupon.discountValue) / 100, coupon.maxDiscount || Infinity);
          } else {
            discount = coupon.discountValue;
          }
          couponData = {
            code: coupon.code,
            discountValue: coupon.discountValue,
            discountType: coupon.discountType
          };
        }
      }
    }

    const shippingCost = subtotal - discount >= 499 ? 0 : 49;
    const tax = 0; // GST included in price
    const total = Math.max(subtotal - discount + shippingCost + tax, 0);

    // Create Razorpay order
    const razorpayInstance = getRazorpay();
    if (!razorpayInstance) {
      return res.status(503).json({ success: false, message: 'Payment gateway not configured. Add Razorpay keys to .env' });
    }
    const razorpayOrder = await razorpayInstance.orders.create({
      amount: Math.round(total * 100),
      currency: 'INR',
      receipt: `FK_${Date.now()}`,
      notes: { userId: req.user._id.toString() }
    });

    res.json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      amount: total,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
      pricing: { subtotal, discount, shippingCost, tax, total },
      validatedItems,
      couponData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify payment & save order
// @route   POST /api/orders/verify-payment
const verifyAndCreateOrder = async (req, res, next) => {
  try {
    const {
      razorpayOrderId, razorpayPaymentId, razorpaySignature,
      shippingAddress, items, pricing, couponData, isSubscription, subscriptionFrequency
    } = req.body;

    // Verify signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed.' });
    }

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      pricing,
      coupon: couponData,
      payment: {
        method: 'razorpay',
        status: 'paid',
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        paidAt: new Date()
      },
      orderStatus: 'confirmed',
      isSubscription,
      subscriptionFrequency
    });

    // Update coupon usage
    if (couponData?.code) {
      await Coupon.findOneAndUpdate(
        { code: couponData.code },
        { $inc: { usedCount: 1 }, $push: { usedBy: req.user._id } }
      );
    }

    // Update stock
    for (const item of items) {
      await Product.updateOne(
        { _id: item.product, 'variants.weight': item.variant.weight },
        { $inc: { 'variants.$.stock': -item.quantity } }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: { _id: order._id, orderNumber: order.orderNumber }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's orders
// @route   GET /api/orders/my-orders
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .select('-payment.razorpaySignature');
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin - Get all orders
// @route   GET /api/admin/orders
const adminGetOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { orderStatus: status } : {};
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / Number(limit)), orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin - Update order status
// @route   PUT /api/admin/orders/:id
const adminUpdateOrder = async (req, res, next) => {
  try {
    const { orderStatus, trackingNumber } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus, ...(trackingNumber && { trackingNumber }) },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, message: 'Order updated.', order });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPaymentOrder, verifyAndCreateOrder, getMyOrders, getOrderById,
  adminGetOrders, adminUpdateOrder
};