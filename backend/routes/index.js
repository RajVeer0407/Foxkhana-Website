const express = require('express');
const router = express.Router();

const { register, login, getProfile, updateProfile, changePassword } = require('../controllers/authController');
const { getProducts, getProductBySlug, createProduct, updateProduct, deleteProduct, addReview, adminGetProducts } = require('../controllers/productController');
const { createPaymentOrder, verifyAndCreateOrder, getMyOrders, getOrderById, adminGetOrders, adminUpdateOrder } = require('../controllers/orderController');
const { createBulkOrder, adminGetBulkOrders, adminUpdateBulkOrder, validateCoupon, adminCreateCoupon, adminGetCoupons, adminUpdateCoupon } = require('../controllers/bulkOrderController');
const { protect, adminOnly } = require('../middleware/auth');

// =================== AUTH ===================
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/auth/profile', protect, getProfile);
router.put('/auth/profile', protect, updateProfile);
router.put('/auth/change-password', protect, changePassword);

// =================== PRODUCTS ===================
router.get('/products', getProducts);
router.get('/products/:slug', getProductBySlug);
router.post('/products/:id/reviews', protect, addReview);

// =================== ORDERS ===================
router.post('/orders/create-payment', protect, createPaymentOrder);
router.post('/orders/verify-payment', protect, verifyAndCreateOrder);
router.get('/orders/my-orders', protect, getMyOrders);
router.get('/orders/:id', protect, getOrderById);

// =================== BULK ORDERS ===================
router.post('/bulk-orders', createBulkOrder);

// =================== COUPONS ===================
router.post('/coupons/validate', protect, validateCoupon);

// =================== ADMIN ROUTES ===================
router.get('/admin/products', protect, adminOnly, adminGetProducts);
router.post('/admin/products', protect, adminOnly, createProduct);
router.put('/admin/products/:id', protect, adminOnly, updateProduct);
router.delete('/admin/products/:id', protect, adminOnly, deleteProduct);

router.get('/admin/orders', protect, adminOnly, adminGetOrders);
router.put('/admin/orders/:id', protect, adminOnly, adminUpdateOrder);

router.get('/admin/bulk-orders', protect, adminOnly, adminGetBulkOrders);
router.put('/admin/bulk-orders/:id', protect, adminOnly, adminUpdateBulkOrder);

router.post('/admin/coupons', protect, adminOnly, adminCreateCoupon);
router.get('/admin/coupons', protect, adminOnly, adminGetCoupons);
router.put('/admin/coupons/:id', protect, adminOnly, adminUpdateCoupon);

module.exports = router;
