import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag, Tag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { couponAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, shippingCost } = useCart();
  const { isLoggedIn } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    if (!isLoggedIn) return toast.error('Please login to apply coupons');
    setCouponLoading(true);
    try {
      const { data } = await couponAPI.validate({ code: couponCode, orderValue: subtotal });
      setAppliedCoupon(data.coupon);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const discount = appliedCoupon?.discount || 0;
  const total = subtotal - discount + shippingCost;

  if (items.length === 0) {
    return (
      <div className="pt-16 lg:pt-20 min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={52} className="text-orange-400" />
          </div>
          <h2 className="font-display text-3xl font-bold text-dark-900 mb-3">Your cart is empty</h2>
          <p className="font-body text-dark-400 mb-8">Looks like you haven't added any makhana yet!</p>
          <Link to="/flavoured" className="btn-primary inline-flex items-center gap-2">
            Start Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display font-bold text-4xl text-dark-900 mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.cartKey} className="bg-white rounded-2xl p-5 shadow-sm border border-dark-50 flex gap-4">
                <div className="w-24 h-24 bg-cream-100 rounded-xl overflow-hidden shrink-0">
                  <img
                    src={item.thumbnail || 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=200'}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=200' }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link to={`/product/${item.slug}`} className="font-display font-semibold text-dark-900 hover:text-orange-500 transition-colors leading-tight">
                        {item.name}
                      </Link>
                      <p className="font-body text-dark-400 text-sm mt-1">{item.weight}</p>
                    </div>
                    <button onClick={() => removeItem(item.cartKey)}
                      className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors text-dark-400 shrink-0">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-dark-200 rounded-xl overflow-hidden">
                      <button onClick={() => updateQuantity(item.cartKey, item.quantity - 1)}
                        className="px-3 py-2 hover:bg-orange-50 transition-colors">
                        <Minus size={14} />
                      </button>
                      <span className="px-4 py-2 font-body font-bold text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartKey, item.quantity + 1)}
                        className="px-3 py-2 hover:bg-orange-50 transition-colors">
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="font-display font-bold text-dark-900 text-lg">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                      <p className="font-body text-dark-400 text-xs">₹{item.price} each</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="space-y-4">
            {/* Coupon */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-dark-50">
              <h3 className="font-display font-semibold text-dark-900 mb-4 flex items-center gap-2">
                <Tag size={18} className="text-orange-500" /> Apply Coupon
              </h3>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
                  <div>
                    <p className="font-body font-semibold text-green-700 text-sm">{appliedCoupon.code}</p>
                    <p className="font-body text-green-600 text-xs">Saving ₹{appliedCoupon.discount}</p>
                  </div>
                  <button onClick={() => { setAppliedCoupon(null); setCouponCode(''); }}
                    className="text-red-400 hover:text-red-600 text-xs font-body underline">
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="input-field flex-1 py-2.5 text-sm"
                  />
                  <button onClick={handleApplyCoupon} disabled={couponLoading}
                    className="px-4 py-2.5 bg-dark-900 text-white rounded-xl font-body font-semibold text-sm hover:bg-dark-800 transition-colors disabled:opacity-50">
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
              )}
            </div>

            {/* Order summary */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-dark-50">
              <h3 className="font-display font-semibold text-dark-900 mb-5">Order Summary</h3>
              <div className="space-y-3 font-body text-sm">
                <div className="flex justify-between text-dark-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span>
                    <span>- ₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-dark-600">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? 'text-green-600 font-semibold' : ''}>
                    {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                  </span>
                </div>
                {shippingCost > 0 && (
                  <p className="text-xs text-dark-400">
                    Add ₹{499 - subtotal + discount} more for free shipping
                  </p>
                )}
                <div className="border-t border-dark-100 pt-3 flex justify-between font-bold text-dark-900 text-base">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <Link
                to={isLoggedIn ? '/checkout' : '/login?redirect=checkout'}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-5 text-base"
              >
                {isLoggedIn ? 'Proceed to Checkout' : 'Login to Checkout'}
                <ArrowRight size={18} />
              </Link>

              <Link to="/flavoured" className="block text-center font-body text-dark-400 text-sm mt-3 hover:text-orange-500 transition-colors">
                Continue Shopping
              </Link>
            </div>

            {/* Policy note */}
            <div className="bg-orange-50 rounded-2xl p-4 text-center">
              <p className="font-body text-orange-700 text-xs">
                🔒 Secure checkout powered by Razorpay. Your payment info is always encrypted.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
