import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../utils/api';
import toast from 'react-hot-toast';

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

function loadRazorpay() {
  return new Promise(resolve => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const { items, subtotal, shippingCost, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });

  const total = subtotal + shippingCost;

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (items.length === 0) return toast.error('Your cart is empty');

    setLoading(true);

    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error('Payment gateway failed to load. Check your connection.');
        setLoading(false);
        return;
      }

      // Create Razorpay order
      const orderItems = items.map(i => ({
        productId: i.productId,
        name: i.name,
        weight: i.weight,
        quantity: i.quantity
      }));

      const { data } = await orderAPI.createPayment({ items: orderItems });

      const options = {
        key: RAZORPAY_KEY || data.keyId,
        amount: data.amount * 100,
        currency: 'INR',
        name: 'Fox Khana',
        description: 'Premium Makhana Order',
        order_id: data.razorpayOrderId,
        prefill: {
          name: form.fullName,
          email: user.email,
          contact: form.phone
        },
        theme: { color: '#FF6B00' },
        handler: async (response) => {
          try {
            const verifyData = await orderAPI.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              shippingAddress: form,
              items: data.validatedItems,
              pricing: data.pricing
            });
            clearCart();
            toast.success('Order placed successfully! 🎉');
            navigate(`/order-success/${verifyData.data.order._id}`);
          } catch {
            toast.error('Payment verification failed. Contact support.');
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error('Payment cancelled');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        toast.error('Payment failed. Please try again.');
        setLoading(false);
      });
      rzp.open();

    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed. Try again.');
      setLoading(false);
    }
  };

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-cream-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display font-bold text-4xl text-dark-900 mb-8">Checkout</h1>

        <form onSubmit={handleCheckout}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-7 shadow-sm border border-dark-50">
                <h2 className="font-display font-semibold text-xl text-dark-900 mb-5">Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="font-body text-dark-600 text-sm font-medium mb-2 block">Full Name *</label>
                    <input name="fullName" required value={form.fullName} onChange={handleChange} className="input-field" placeholder="As per ID" />
                  </div>
                  <div>
                    <label className="font-body text-dark-600 text-sm font-medium mb-2 block">Phone Number *</label>
                    <input name="phone" required value={form.phone} onChange={handleChange} className="input-field" placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-body text-dark-600 text-sm font-medium mb-2 block">Street Address *</label>
                    <input name="street" required value={form.street} onChange={handleChange} className="input-field" placeholder="House/Flat No., Building, Street" />
                  </div>
                  <div>
                    <label className="font-body text-dark-600 text-sm font-medium mb-2 block">City *</label>
                    <input name="city" required value={form.city} onChange={handleChange} className="input-field" placeholder="City" />
                  </div>
                  <div>
                    <label className="font-body text-dark-600 text-sm font-medium mb-2 block">State *</label>
                    <input name="state" required value={form.state} onChange={handleChange} className="input-field" placeholder="State" />
                  </div>
                  <div>
                    <label className="font-body text-dark-600 text-sm font-medium mb-2 block">Pincode *</label>
                    <input name="pincode" required value={form.pincode} onChange={handleChange} className="input-field" placeholder="Pincode" maxLength={6} />
                  </div>
                  <div>
                    <label className="font-body text-dark-600 text-sm font-medium mb-2 block">Country</label>
                    <input name="country" value={form.country} readOnly className="input-field bg-cream-50 cursor-not-allowed" />
                  </div>
                </div>
              </div>

              {/* Payment note */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-dark-50">
                <h2 className="font-display font-semibold text-xl text-dark-900 mb-4">Payment Method</h2>
                <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                    <Lock size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-body font-semibold text-dark-900 text-sm">Razorpay Secure Checkout</p>
                    <p className="font-body text-dark-500 text-xs">Cards, UPI, Net Banking, Wallets — all accepted</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-dark-50 sticky top-24">
                <h2 className="font-display font-semibold text-xl text-dark-900 mb-5">Order Summary</h2>
                <div className="space-y-3 mb-5">
                  {items.map(item => (
                    <div key={item.cartKey} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-cream-100 rounded-lg overflow-hidden shrink-0">
                        <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=100' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body font-medium text-dark-900 text-sm truncate">{item.name}</p>
                        <p className="font-body text-dark-400 text-xs">{item.weight} × {item.quantity}</p>
                      </div>
                      <span className="font-body font-semibold text-dark-900 text-sm shrink-0">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-dark-100 pt-4 space-y-2 font-body text-sm">
                  <div className="flex justify-between text-dark-500">
                    <span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-dark-500">
                    <span>Shipping</span>
                    <span className={shippingCost === 0 ? 'text-green-600' : ''}>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-dark-900 text-base pt-2 border-t border-dark-100">
                    <span>Total</span><span>₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full btn-primary mt-6 text-base py-4 flex items-center justify-center gap-2">
                  {loading ? (
                    <><span className="spinner" /><span>Processing...</span></>
                  ) : (
                    <><Lock size={18} /> Pay ₹{total.toLocaleString('en-IN')}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
