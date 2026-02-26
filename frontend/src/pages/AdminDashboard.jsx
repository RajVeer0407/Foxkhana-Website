import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ShoppingBag, Users, Tag,
  TrendingUp, Plus, Edit3, Trash2, ChevronRight, Check, X
} from 'lucide-react';
import { productAPI, orderAPI, bulkOrderAPI, couponAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// ============ ADMIN LAYOUT ============
function AdminLayout({ children }) {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { to: '/admin/bulk-orders', label: 'Bulk Orders', icon: Users },
    { to: '/admin/coupons', label: 'Coupons', icon: Tag }
  ];

  return (
    <div className="min-h-screen bg-cream-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-dark-900 text-white flex flex-col fixed h-full z-40">
        <div className="p-6 border-b border-dark-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="font-display font-bold text-sm">F</span>
            </div>
            <div>
              <p className="font-display font-bold text-sm">Fox Khana</p>
              <p className="font-body text-dark-400 text-[10px] uppercase tracking-wider">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const active = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <Link key={item.to} to={item.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm font-medium transition-all ${
                  active ? 'bg-orange-500 text-white' : 'text-dark-400 hover:bg-dark-800 hover:text-white'
                }`}>
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-dark-800">
          <button onClick={logout} className="w-full text-left px-4 py-3 text-dark-400 hover:text-red-400 font-body text-sm transition-colors">
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-60 flex-1 p-8">
        {children}
      </main>
    </div>
  );
}

// ============ DASHBOARD HOME ============
function AdminHome() {
  const [stats, setStats] = useState({ orders: 0, products: 0, bulkOrders: 0, revenue: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    orderAPI.adminGetAll({ limit: 5 }).then(res => {
      setRecentOrders(res.data.orders);
      const revenue = res.data.orders.reduce((acc, o) => acc + o.pricing.total, 0);
      setStats(s => ({ ...s, orders: res.data.total, revenue }));
    });
    productAPI.adminGetAll().then(res => setStats(s => ({ ...s, products: res.data.count })));
    bulkOrderAPI.adminGetAll().then(res => setStats(s => ({ ...s, bulkOrders: res.data.count })));
  }, []);

  const statCards = [
    { label: 'Total Orders', value: stats.orders, icon: ShoppingBag, color: 'text-blue-600 bg-blue-50' },
    { label: 'Active Products', value: stats.products, icon: Package, color: 'text-orange-600 bg-orange-50' },
    { label: 'Bulk Inquiries', value: stats.bulkOrders, icon: Users, color: 'text-green-600 bg-green-50' },
    { label: 'Revenue (5 recent)', value: `₹${stats.revenue.toLocaleString('en-IN')}`, icon: TrendingUp, color: 'text-purple-600 bg-purple-50' }
  ];

  return (
    <div>
      <h1 className="font-display font-bold text-3xl text-dark-900 mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {statCards.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-6 shadow-sm border border-dark-50">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon size={20} />
            </div>
            <p className="font-display font-bold text-2xl text-dark-900">{s.value}</p>
            <p className="font-body text-dark-400 text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-dark-50 overflow-hidden">
        <div className="px-6 py-4 border-b border-dark-50 flex items-center justify-between">
          <h2 className="font-display font-semibold text-lg text-dark-900">Recent Orders</h2>
          <Link to="/admin/orders" className="font-body text-orange-500 text-sm flex items-center gap-1">
            View all <ChevronRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full font-body text-sm">
            <thead className="bg-cream-50">
              <tr>
                {['Order #', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-dark-500 font-semibold text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order._id} className="border-t border-dark-50 hover:bg-cream-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-dark-700">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-dark-700">{order.user?.name || 'N/A'}</td>
                  <td className="px-6 py-4 font-semibold text-dark-900">₹{order.pricing.total.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4">
                    <span className={`badge text-xs ${
                      order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.orderStatus === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      order.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-dark-400">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============ PRODUCTS MANAGEMENT ============
function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState({
    name: '', slug: '', category: 'plain', flavour: '',
    description: '', shortDescription: '', thumbnail: '',
    variants: [{ weight: '100g', price: 149, mrp: 199, stock: 100 }],
    isActive: true, isFeatured: false
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    productAPI.adminGetAll().then(res => setProducts(res.data.products)).finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await productAPI.delete(id);
    toast.success('Product deleted');
    fetchProducts();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await productAPI.update(editingProduct._id, form);
        toast.success('Product updated!');
      } else {
        await productAPI.create({ ...form, slug: form.name.toLowerCase().replace(/\s+/g, '-') });
        toast.success('Product created!');
      }
      setShowForm(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    }
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name, slug: product.slug, category: product.category,
      flavour: product.flavour || '', description: product.description,
      shortDescription: product.shortDescription || '', thumbnail: product.thumbnail || '',
      variants: product.variants, isActive: product.isActive, isFeatured: product.isFeatured
    });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-3xl text-dark-900">Products</h1>
        <button onClick={() => { setShowForm(true); setEditingProduct(null); }}
          className="btn-primary flex items-center gap-2 py-2.5 px-5 text-sm">
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl mx-4 my-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-2xl">{editingProduct ? 'Edit Product' : 'New Product'}</h2>
              <button onClick={() => setShowForm(false)}><X size={24} className="text-dark-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="font-body text-sm font-medium text-dark-600 mb-1 block">Product Name *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="input-field" placeholder="Product name" />
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-dark-600 mb-1 block">Category *</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-field">
                    <option value="plain">Plain</option>
                    <option value="flavoured">Flavoured</option>
                  </select>
                </div>
                <div>
                  <label className="font-body text-sm font-medium text-dark-600 mb-1 block">Flavour</label>
                  <input value={form.flavour} onChange={e => setForm(f => ({ ...f, flavour: e.target.value }))}
                    className="input-field" placeholder="e.g. Peri Peri" />
                </div>
                <div className="col-span-2">
                  <label className="font-body text-sm font-medium text-dark-600 mb-1 block">Short Description</label>
                  <input value={form.shortDescription} onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))}
                    className="input-field" placeholder="One-liner" />
                </div>
                <div className="col-span-2">
                  <label className="font-body text-sm font-medium text-dark-600 mb-1 block">Description *</label>
                  <textarea required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={3} className="input-field resize-none" />
                </div>
                <div className="col-span-2">
                  <label className="font-body text-sm font-medium text-dark-600 mb-1 block">Thumbnail URL</label>
                  <input value={form.thumbnail} onChange={e => setForm(f => ({ ...f, thumbnail: e.target.value }))}
                    className="input-field" placeholder="https://..." />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-body text-sm font-medium text-dark-600">Variants</label>
                  <button type="button"
                    onClick={() => setForm(f => ({ ...f, variants: [...f.variants, { weight: '', price: 0, mrp: 0, stock: 0 }] }))}
                    className="text-orange-500 text-xs font-body font-semibold">+ Add Variant</button>
                </div>
                {form.variants.map((v, i) => (
                  <div key={i} className="grid grid-cols-4 gap-2 mb-2">
                    <input value={v.weight} onChange={e => {
                      const vs = [...form.variants]; vs[i].weight = e.target.value;
                      setForm(f => ({ ...f, variants: vs }));
                    }} className="input-field py-2 text-sm" placeholder="Weight" />
                    <input type="number" value={v.price} onChange={e => {
                      const vs = [...form.variants]; vs[i].price = Number(e.target.value);
                      setForm(f => ({ ...f, variants: vs }));
                    }} className="input-field py-2 text-sm" placeholder="Price ₹" />
                    <input type="number" value={v.mrp} onChange={e => {
                      const vs = [...form.variants]; vs[i].mrp = Number(e.target.value);
                      setForm(f => ({ ...f, variants: vs }));
                    }} className="input-field py-2 text-sm" placeholder="MRP ₹" />
                    <input type="number" value={v.stock} onChange={e => {
                      const vs = [...form.variants]; vs[i].stock = Number(e.target.value);
                      setForm(f => ({ ...f, variants: vs }));
                    }} className="input-field py-2 text-sm" placeholder="Stock" />
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 font-body text-sm cursor-pointer">
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} />
                  Active
                </label>
                <label className="flex items-center gap-2 font-body text-sm cursor-pointer">
                  <input type="checkbox" checked={form.isFeatured} onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))} />
                  Featured
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products table */}
      <div className="bg-white rounded-2xl shadow-sm border border-dark-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full font-body text-sm">
            <thead className="bg-cream-50">
              <tr>
                {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-dark-500 font-semibold text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-12 text-dark-400">Loading...</td></tr>
              ) : products.map(p => (
                <tr key={p._id} className="border-t border-dark-50 hover:bg-cream-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-cream-100 rounded-lg overflow-hidden">
                        <img src={p.thumbnail} alt="" className="w-full h-full object-cover"
                          onError={(e) => { e.target.style.display = 'none' }} />
                      </div>
                      <div>
                        <p className="font-medium text-dark-900">{p.name}</p>
                        <p className="text-dark-400 text-xs">{p.flavour || 'Plain'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 capitalize">{p.category}</td>
                  <td className="px-6 py-4">₹{p.variants[0]?.price} – ₹{p.variants[p.variants.length-1]?.price}</td>
                  <td className="px-6 py-4">{p.variants.reduce((acc, v) => acc + v.stock, 0)}</td>
                  <td className="px-6 py-4">
                    <span className={`badge text-xs ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="p-2 hover:bg-orange-50 rounded-lg text-orange-500 transition-colors">
                        <Edit3 size={16} />
                      </button>
                      <button onClick={() => handleDelete(p._id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============ ORDERS MANAGEMENT ============
function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    const params = statusFilter ? { status: statusFilter } : {};
    orderAPI.adminGetAll(params)
      .then(res => setOrders(res.data.orders))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  const updateStatus = async (id, orderStatus) => {
    await orderAPI.adminUpdate(id, { orderStatus });
    toast.success('Order status updated');
    setOrders(prev => prev.map(o => o._id === id ? { ...o, orderStatus } : o));
  };

  const statuses = ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div>
      <h1 className="font-display font-bold text-3xl text-dark-900 mb-8">Orders</h1>
      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={() => setStatusFilter('')}
          className={`px-4 py-2 rounded-full text-sm font-body font-medium border transition-all ${!statusFilter ? 'bg-dark-900 text-white border-dark-900' : 'border-dark-200 text-dark-600'}`}>
          All
        </button>
        {statuses.map(s => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-body font-medium border capitalize transition-all ${statusFilter === s ? 'bg-orange-500 text-white border-orange-500' : 'border-dark-200 text-dark-600'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-dark-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full font-body text-sm">
            <thead className="bg-cream-50">
              <tr>
                {['Order #', 'Customer', 'Items', 'Total', 'Status', 'Update Status', 'Date'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-dark-500 font-semibold text-xs uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-12 text-dark-400">Loading...</td></tr>
              ) : orders.map(o => (
                <tr key={o._id} className="border-t border-dark-50 hover:bg-cream-50 transition-colors">
                  <td className="px-4 py-4 font-mono text-xs">{o.orderNumber}</td>
                  <td className="px-4 py-4">
                    <p className="font-medium">{o.user?.name}</p>
                    <p className="text-dark-400 text-xs">{o.user?.email}</p>
                  </td>
                  <td className="px-4 py-4">{o.items.length} item(s)</td>
                  <td className="px-4 py-4 font-semibold">₹{o.pricing.total.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-4">
                    <span className={`badge text-xs capitalize ${
                      o.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                      o.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>{o.orderStatus}</span>
                  </td>
                  <td className="px-4 py-4">
                    <select value={o.orderStatus}
                      onChange={e => updateStatus(o._id, e.target.value)}
                      className="text-xs border border-dark-200 rounded-lg px-2 py-1.5 font-body">
                      {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-4 text-dark-400 text-xs">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============ BULK ORDERS ============
function AdminBulkOrders() {
  const [bulkOrders, setBulkOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bulkOrderAPI.adminGetAll().then(res => setBulkOrders(res.data.bulkOrders)).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status) => {
    await bulkOrderAPI.adminUpdate(id, { status });
    setBulkOrders(prev => prev.map(o => o._id === id ? { ...o, status } : o));
    toast.success('Status updated');
  };

  return (
    <div>
      <h1 className="font-display font-bold text-3xl text-dark-900 mb-8">Bulk Order Inquiries</h1>
      <div className="space-y-4">
        {loading ? <p>Loading...</p> : bulkOrders.map(b => (
          <div key={b._id} className="bg-white rounded-2xl p-6 shadow-sm border border-dark-50">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="font-display font-bold text-dark-900">{b.companyName}</p>
                <p className="font-body text-dark-400 text-sm">{b.fullName} • {b.email} • {b.phone}</p>
                <p className="font-mono text-xs text-orange-500 mt-1">{b.referenceNumber}</p>
              </div>
              <div className="text-right">
                <span className={`badge text-xs ${
                  b.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                  b.status === 'new' ? 'bg-blue-100 text-blue-700' :
                  'bg-orange-100 text-orange-700'
                }`}>{b.status}</span>
                <p className="font-body text-dark-400 text-xs mt-1">{new Date(b.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-cream-50 rounded-xl p-3">
                <p className="font-body text-xs text-dark-400">Product Type</p>
                <p className="font-body font-semibold capitalize">{b.productType}</p>
              </div>
              <div className="bg-cream-50 rounded-xl p-3">
                <p className="font-body text-xs text-dark-400">Quantity</p>
                <p className="font-body font-semibold">{b.quantityKg} kg</p>
              </div>
              <div className="bg-cream-50 rounded-xl p-3">
                <p className="font-body text-xs text-dark-400">Delivery To</p>
                <p className="font-body font-semibold text-sm">{b.deliveryLocation}</p>
              </div>
            </div>
            {b.message && <p className="font-body text-dark-500 text-sm italic mb-4">"{b.message}"</p>}
            <div className="flex gap-2">
              {['new', 'contacted', 'quoted', 'confirmed', 'rejected'].map(s => (
                <button key={s} onClick={() => updateStatus(b._id, s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-body font-medium border transition-all capitalize ${
                    b.status === s ? 'bg-orange-500 text-white border-orange-500' : 'border-dark-200 text-dark-600 hover:border-orange-300'
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============ COUPONS ============
function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    code: '', discountType: 'percentage', discountValue: 10, minOrderValue: 200,
    usageLimit: '', validUntil: '', isActive: true
  });

  useEffect(() => {
    couponAPI.adminGetAll().then(res => setCoupons(res.data.coupons));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await couponAPI.adminCreate(form);
      toast.success('Coupon created!');
      couponAPI.adminGetAll().then(res => setCoupons(res.data.coupons));
      setShowForm(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  const toggleCoupon = async (id, isActive) => {
    await couponAPI.adminUpdate(id, { isActive: !isActive });
    setCoupons(prev => prev.map(c => c._id === id ? { ...c, isActive: !isActive } : c));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display font-bold text-3xl text-dark-900">Coupons</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 py-2.5 px-5 text-sm">
          <Plus size={18} /> New Coupon
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl p-6 shadow-sm border border-dark-50 mb-6">
          <h2 className="font-display font-semibold text-xl mb-5">Create Coupon</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="font-body text-sm font-medium text-dark-600 mb-1 block">Code *</label>
              <input required value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                className="input-field" placeholder="WELCOME20" />
            </div>
            <div>
              <label className="font-body text-sm font-medium text-dark-600 mb-1 block">Type</label>
              <select value={form.discountType} onChange={e => setForm(f => ({ ...f, discountType: e.target.value }))} className="input-field">
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat (₹)</option>
              </select>
            </div>
            <div>
              <label className="font-body text-sm font-medium text-dark-600 mb-1 block">Discount Value</label>
              <input type="number" required value={form.discountValue} onChange={e => setForm(f => ({ ...f, discountValue: e.target.value }))}
                className="input-field" placeholder={form.discountType === 'percentage' ? '20' : '50'} />
            </div>
            <div>
              <label className="font-body text-sm font-medium text-dark-600 mb-1 block">Min Order ₹</label>
              <input type="number" value={form.minOrderValue} onChange={e => setForm(f => ({ ...f, minOrderValue: e.target.value }))}
                className="input-field" />
            </div>
            <div>
              <label className="font-body text-sm font-medium text-dark-600 mb-1 block">Usage Limit</label>
              <input type="number" value={form.usageLimit} onChange={e => setForm(f => ({ ...f, usageLimit: e.target.value }))}
                className="input-field" placeholder="Leave blank for unlimited" />
            </div>
            <div>
              <label className="font-body text-sm font-medium text-dark-600 mb-1 block">Valid Until *</label>
              <input type="date" required value={form.validUntil} onChange={e => setForm(f => ({ ...f, validUntil: e.target.value }))}
                className="input-field" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button type="submit" className="btn-primary">Create Coupon</button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-dark-50 overflow-hidden">
        <table className="w-full font-body text-sm">
          <thead className="bg-cream-50">
            <tr>
              {['Code', 'Type', 'Value', 'Min Order', 'Used', 'Valid Until', 'Status'].map(h => (
                <th key={h} className="text-left px-6 py-3 text-dark-500 font-semibold text-xs uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {coupons.map(c => (
              <tr key={c._id} className="border-t border-dark-50 hover:bg-cream-50 transition-colors">
                <td className="px-6 py-4 font-mono font-bold text-orange-500">{c.code}</td>
                <td className="px-6 py-4 capitalize">{c.discountType}</td>
                <td className="px-6 py-4">{c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}</td>
                <td className="px-6 py-4">₹{c.minOrderValue}</td>
                <td className="px-6 py-4">{c.usedCount} / {c.usageLimit || '∞'}</td>
                <td className="px-6 py-4">{new Date(c.validUntil).toLocaleDateString('en-IN')}</td>
                <td className="px-6 py-4">
                  <button onClick={() => toggleCoupon(c._id, c.isActive)}
                    className={`badge text-xs ${c.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-red-100 text-red-700 hover:bg-red-200'} cursor-pointer transition-colors`}>
                    {c.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============ MAIN ADMIN COMPONENT ============
export default function AdminDashboard() {
  const { isAdmin, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="spinner" /></div>;
  if (!isAdmin) return <Navigate to="/login" />;

  return (
    <AdminLayout>
      <Routes>
        <Route index element={<AdminHome />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="bulk-orders" element={<AdminBulkOrders />} />
        <Route path="coupons" element={<AdminCoupons />} />
      </Routes>
    </AdminLayout>
  );
}
