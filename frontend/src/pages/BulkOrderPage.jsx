import { useState } from 'react';
import { CheckCircle2, Building2, Users, Truck, Phone } from 'lucide-react';
import { bulkOrderAPI } from '../utils/api';
import toast from 'react-hot-toast';

const benefits = [
  { icon: Building2, title: 'Custom Branding', desc: 'White-label packaging available for your brand' },
  { icon: Users, title: 'Dedicated Account Manager', desc: 'Single point of contact for all your needs' },
  { icon: Truck, title: 'Priority Dispatch', desc: 'Guaranteed delivery within 5-7 business days' },
  { icon: Phone, title: '24/7 B2B Support', desc: 'Priority support for all bulk customers' }
];

export default function BulkOrderPage() {
  const [form, setForm] = useState({
    fullName: '', companyName: '', phone: '', email: '',
    productType: 'both', flavoursRequired: [], quantityKg: '',
    deliveryLocation: '', message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [refNum, setRefNum] = useState('');
  const [loading, setLoading] = useState(false);

  const flavours = ['Peri Peri', 'Cheese & Herbs', 'Pudina Masala', 'Cream & Onion', 'Tangy Tomato'];

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleFlavourToggle = (f) => {
    setForm(prev => ({
      ...prev,
      flavoursRequired: prev.flavoursRequired.includes(f)
        ? prev.flavoursRequired.filter(x => x !== f)
        : [...prev.flavoursRequired, f]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await bulkOrderAPI.create(form);
      setRefNum(data.referenceNumber);
      setSubmitted(true);
      toast.success('Inquiry submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-16 lg:pt-20 min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={52} className="text-green-500" />
          </div>
          <h2 className="font-display font-bold text-3xl text-dark-900 mb-3">Inquiry Received!</h2>
          <p className="font-body text-dark-500 mb-4 leading-relaxed">
            Thank you for your interest in Fox Khana bulk orders. Our team will reach out within 24 business hours.
          </p>
          <div className="bg-orange-50 rounded-2xl p-4 mb-6 border border-orange-100">
            <p className="font-body text-orange-700 text-sm font-medium">Reference Number</p>
            <p className="font-mono font-bold text-orange-500 text-xl">{refNum}</p>
          </div>
          <button onClick={() => setSubmitted(false)} className="btn-outline">Submit Another Inquiry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-dark-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <span className="badge bg-orange-500/20 text-orange-400 mb-4 inline-block">B2B Partnership</span>
          <h1 className="font-display text-5xl md:text-6xl font-black text-white mb-4">Bulk Orders</h1>
          <p className="font-body text-dark-400 text-lg max-w-2xl mx-auto">
            Special pricing for restaurants, corporates, retailers, and institutions. Minimum 10kg. Maximum savings.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Benefits */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
          {benefits.map(b => (
            <div key={b.title} className="text-center">
              <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <b.icon size={24} className="text-orange-500" />
              </div>
              <h3 className="font-body font-semibold text-dark-900 text-sm mb-1">{b.title}</h3>
              <p className="font-body text-dark-400 text-xs leading-relaxed">{b.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Pricing tiers */}
          <div className="space-y-4">
            <h2 className="font-display font-bold text-2xl text-dark-900">Bulk Pricing Tiers</h2>
            <p className="font-body text-dark-500 text-sm">Contact us for exact quotes. Prices depend on product mix and quantity.</p>
            {[
              { label: '10 – 50 kg', desc: 'Starter tier', discount: 'Up to 15% off MRP' },
              { label: '51 – 200 kg', desc: 'Business tier', discount: 'Up to 25% off MRP' },
              { label: '200+ kg', desc: 'Enterprise tier', discount: 'Up to 40% off MRP' }
            ].map(tier => (
              <div key={tier.label} className="bg-white rounded-2xl p-5 border border-dark-100 hover:border-orange-200 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display font-bold text-dark-900">{tier.label}</span>
                  <span className="badge-orange">{tier.discount}</span>
                </div>
                <p className="font-body text-dark-400 text-sm">{tier.desc}</p>
              </div>
            ))}
            <div className="bg-orange-500 rounded-2xl p-5 text-white">
              <p className="font-body font-semibold mb-1">Custom packaging & white-labelling available</p>
              <p className="font-body text-orange-100 text-sm">MOQ 50 kg for branded packaging</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-dark-50">
              <h2 className="font-display font-bold text-2xl text-dark-900 mb-6">Request a Quote</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="font-body text-dark-600 text-sm font-medium mb-2 block">Full Name *</label>
                    <input name="fullName" required value={form.fullName} onChange={handleChange}
                      className="input-field" placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="font-body text-dark-600 text-sm font-medium mb-2 block">Company Name *</label>
                    <input name="companyName" required value={form.companyName} onChange={handleChange}
                      className="input-field" placeholder="Your company or organisation" />
                  </div>
                  <div>
                    <label className="font-body text-dark-600 text-sm font-medium mb-2 block">Phone Number *</label>
                    <input name="phone" required value={form.phone} onChange={handleChange}
                      className="input-field" placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div>
                    <label className="font-body text-dark-600 text-sm font-medium mb-2 block">Email Address *</label>
                    <input name="email" type="email" required value={form.email} onChange={handleChange}
                      className="input-field" placeholder="you@company.com" />
                  </div>
                </div>

                <div>
                  <label className="font-body text-dark-600 text-sm font-medium mb-2 block">Product Type *</label>
                  <div className="flex gap-3">
                    {['plain', 'flavoured', 'both'].map(type => (
                      <button type="button" key={type}
                        onClick={() => setForm(f => ({ ...f, productType: type }))}
                        className={`flex-1 py-3 rounded-xl border-2 font-body font-medium capitalize text-sm transition-all ${
                          form.productType === type
                            ? 'border-orange-500 bg-orange-50 text-orange-600'
                            : 'border-dark-200 text-dark-600'
                        }`}>
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {(form.productType === 'flavoured' || form.productType === 'both') && (
                  <div>
                    <label className="font-body text-dark-600 text-sm font-medium mb-2 block">Flavours Required</label>
                    <div className="flex flex-wrap gap-2">
                      {flavours.map(f => (
                        <button type="button" key={f}
                          onClick={() => handleFlavourToggle(f)}
                          className={`px-4 py-2 rounded-full text-sm font-body font-medium border transition-all ${
                            form.flavoursRequired.includes(f)
                              ? 'bg-orange-500 text-white border-orange-500'
                              : 'border-dark-200 text-dark-600 hover:border-orange-300'
                          }`}>
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="font-body text-dark-600 text-sm font-medium mb-2 block">Quantity Required (Kg) *</label>
                    <input name="quantityKg" type="number" min={10} required value={form.quantityKg} onChange={handleChange}
                      className="input-field" placeholder="Min. 10 kg" />
                  </div>
                  <div>
                    <label className="font-body text-dark-600 text-sm font-medium mb-2 block">Delivery Location *</label>
                    <input name="deliveryLocation" required value={form.deliveryLocation} onChange={handleChange}
                      className="input-field" placeholder="City, State" />
                  </div>
                </div>

                <div>
                  <label className="font-body text-dark-600 text-sm font-medium mb-2 block">Additional Message</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows={4}
                    className="input-field resize-none" placeholder="Any specific requirements, packaging preferences, delivery timelines..." />
                </div>

                <button type="submit" disabled={loading} className="w-full btn-primary py-4 text-base">
                  {loading ? 'Submitting...' : 'Submit Bulk Inquiry'}
                </button>

                <p className="font-body text-dark-400 text-xs text-center">
                  We respond within 24 business hours. For urgent inquiries: +91 98765 43210
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
