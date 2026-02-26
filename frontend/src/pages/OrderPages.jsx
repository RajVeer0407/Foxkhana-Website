import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, MapPin, ChevronRight } from 'lucide-react';
import { orderAPI } from '../utils/api';
import toast from 'react-hot-toast';

export function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getById(id)
      .then(res => setOrder(res.data.order))
      .catch(() => toast.error('Could not load order'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="spinner" />
    </div>
  );

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-cream-50 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-sm border border-dark-50 p-10 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={52} className="text-green-500" />
          </div>
          <h1 className="font-display font-bold text-4xl text-dark-900 mb-3">Order Confirmed!</h1>
          <p className="font-body text-dark-500 mb-6">
            Thank you for your order! We're preparing your makhana with love. 🦊
          </p>

          {order && (
            <>
              <div className="bg-cream-50 rounded-2xl p-5 mb-6">
                <p className="font-body text-dark-400 text-sm mb-1">Order Number</p>
                <p className="font-mono font-bold text-orange-500 text-2xl">{order.orderNumber}</p>
              </div>

              <div className="text-left border border-dark-100 rounded-2xl overflow-hidden mb-6">
                <div className="px-5 py-3 bg-cream-50 border-b border-dark-100">
                  <p className="font-body font-semibold text-dark-700 text-sm">Order Items</p>
                </div>
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3 border-b border-dark-50 last:border-0">
                    <div>
                      <p className="font-body font-medium text-dark-900 text-sm">{item.name}</p>
                      <p className="font-body text-dark-400 text-xs">{item.variant.weight} × {item.quantity}</p>
                    </div>
                    <span className="font-body font-semibold text-dark-900 text-sm">₹{item.price.toLocaleString('en-IN')}</span>
                  </div>
                ))}
                <div className="px-5 py-4 bg-cream-50 flex justify-between">
                  <span className="font-body font-bold text-dark-900">Total Paid</span>
                  <span className="font-display font-bold text-orange-500 text-lg">₹{order.pricing.total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-left bg-orange-50 rounded-2xl p-5">
                <MapPin size={18} className="text-orange-500 mt-0.5 shrink-0" />
                <div>
                  <p className="font-body font-semibold text-dark-900 text-sm mb-1">Delivering to</p>
                  <p className="font-body text-dark-500 text-sm">
                    {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="flex gap-4 mt-8">
            <Link to="/orders" className="btn-outline flex-1">My Orders</Link>
            <Link to="/" className="btn-primary flex-1">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMyOrders()
      .then(res => setOrders(res.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statusColor = (s) => ({
    placed: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-indigo-100 text-indigo-700',
    processing: 'bg-yellow-100 text-yellow-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  }[s] || 'bg-gray-100 text-gray-700');

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-cream-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-display font-bold text-4xl text-dark-900 mb-8">My Orders</h1>

        {loading ? (
          <div className="flex justify-center py-12"><div className="spinner" /></div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <Package size={64} className="text-orange-200 mx-auto mb-4" />
            <h2 className="font-display text-2xl text-dark-900 mb-3">No orders yet</h2>
            <p className="font-body text-dark-400 mb-6">Start crunching!</p>
            <Link to="/" className="btn-primary">Shop Now</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-dark-50 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-dark-50 bg-cream-50">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="font-body text-dark-400 text-xs uppercase tracking-wider">Order</p>
                      <p className="font-mono font-bold text-orange-500 text-sm">{order.orderNumber}</p>
                    </div>
                    <div>
                      <p className="font-body text-dark-400 text-xs uppercase tracking-wider">Date</p>
                      <p className="font-body font-medium text-dark-700 text-sm">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div>
                      <p className="font-body text-dark-400 text-xs uppercase tracking-wider">Total</p>
                      <p className="font-body font-bold text-dark-900">₹{order.pricing.total.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <span className={`badge text-xs capitalize ${statusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>
                <div className="px-6 py-4">
                  <div className="space-y-2">
                    {order.items.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="font-body text-dark-600 text-sm">{item.name} ({item.variant.weight}) × {item.quantity}</span>
                        <span className="font-body text-dark-700 text-sm font-medium">₹{item.price.toLocaleString('en-IN')}</span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <p className="font-body text-dark-400 text-xs">+{order.items.length - 3} more item(s)</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
