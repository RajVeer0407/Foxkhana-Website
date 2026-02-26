import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Zap, Heart, Award, Star, ChevronRight, Package } from 'lucide-react';
import { productAPI } from '../utils/api';
import ProductCard from '../components/products/ProductCard';

const stats = [
  { value: '10K+', label: 'Happy Customers' },
  { value: '7', label: 'Unique Flavours' },
  { value: '100%', label: 'Natural Ingredients' },
  { value: '4.8★', label: 'Average Rating' }
];

const features = [
  { icon: Leaf, title: 'Zero Preservatives', desc: 'All-natural, clean-label snacking with nothing artificial.' },
  { icon: Zap, title: 'Protein Rich', desc: 'High in plant protein — perfect pre or post-workout fuel.' },
  { icon: Heart, title: 'Heart Healthy', desc: 'Naturally low in fat, great for cholesterol management.' },
  { icon: Award, title: 'Premium Grade', desc: 'Handpicked Grade A lotus seeds from Bihar\'s finest lakes.' }
];

const testimonials = [
  { name: 'Priya Sharma', city: 'Delhi', rating: 5, text: 'Peri Peri is absolutely addictive! My entire office now orders Fox Khana every week.' },
  { name: 'Rahul Mehta', city: 'Mumbai', rating: 5, text: 'Finally a healthy snack that actually tastes amazing. The Pudina Masala is my gym buddy.' },
  { name: 'Ananya Iyer', city: 'Bangalore', rating: 5, text: 'Switched from chips to Fox Khana 3 months ago. Never going back.' }
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productAPI.getAll({ featured: true, limit: 4 })
      .then(res => setFeatured(res.data.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-16 lg:pt-20">
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-cream-50">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-orange-500/8 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-orange-300/10 rounded-full blur-2xl" />
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-orange-500 rounded-full opacity-40" />
          <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-orange-300 rounded-full opacity-60" />
          <div className="absolute bottom-1/3 left-1/4 w-4 h-4 bg-orange-500/30 rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="space-y-8 animate-fade-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 rounded-full border border-orange-200">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                <span className="font-body text-orange-600 text-sm font-semibold">India's #1 Premium Makhana Brand</span>
              </div>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-dark-900 leading-[1.05]">
                Crunch
                <span className="text-gradient block">Smart.</span>
                <span className="block">Eat Smart.</span>
              </h1>

              <p className="font-body text-dark-500 text-xl leading-relaxed max-w-md">
                Premium lotus seed snacks crafted for the mindful generation. Zero guilt, maximum flavour, infinite crunch.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/flavoured" className="btn-primary flex items-center justify-center gap-2 text-base py-4 px-8">
                  Shop Now <ArrowRight size={18} />
                </Link>
                <Link to="/bulk-orders" className="btn-outline flex items-center justify-center gap-2 text-base py-4 px-8">
                  <Package size={18} /> Bulk Orders
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 pt-2">
                {['Free shipping ₹499+', 'COD available', 'Easy returns'].map(badge => (
                  <div key={badge} className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    <span className="font-body text-dark-500 text-xs">{badge}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Hero visual */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-[420px] h-[420px] mx-auto">
                {/* Main image circle */}
                <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-100 to-cream-200 overflow-hidden shadow-2xl shadow-orange-500/20 animate-bounce-gentle">
                  <img
                    src="https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=600"
                    alt="Fox Khana Premium Makhana"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                </div>
                {/* Floating cards */}
                <div className="absolute -top-4 -left-8 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-orange-100">
                  <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                    <Leaf size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="font-body font-semibold text-dark-900 text-sm">100% Natural</p>
                    <p className="font-body text-dark-400 text-xs">Zero additives</p>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-8 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3 border border-orange-100">
                  <div className="w-10 h-10 bg-dark-900 rounded-xl flex items-center justify-center">
                    <Star size={18} fill="white" className="text-white" />
                  </div>
                  <div>
                    <p className="font-body font-semibold text-dark-900 text-sm">4.8 / 5 Rating</p>
                    <p className="font-body text-dark-400 text-xs">10,000+ reviews</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-dark-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <p className="font-display font-bold text-orange-400 text-4xl mb-1">{stat.value}</p>
                <p className="font-body text-dark-400 text-sm uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="badge-orange mb-3 inline-block">Our Bestsellers</span>
              <h2 className="section-heading">Fan Favourites</h2>
            </div>
            <Link to="/flavoured" className="hidden sm:flex items-center gap-2 font-body font-semibold text-orange-500 hover:gap-3 transition-all">
              View All <ChevronRight size={18} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="card h-80 animate-pulse bg-cream-100" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map((product, i) => (
                <ProductCard key={product._id} product={product} animDelay={i * 100} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-heading text-center mb-12">Explore Our Range</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Plain Makhana card */}
            <Link to="/plain" className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-cream-50 to-orange-50 border border-orange-100 p-8 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500" />
              <span className="badge-orange mb-4 inline-block">Pure & Natural</span>
              <h3 className="font-display font-bold text-3xl text-dark-900 mb-3">Plain Makhana</h3>
              <p className="font-body text-dark-500 mb-6 max-w-xs">Minimalist. Clean. Nature's most nutritious snack in its purest form.</p>
              <div className="flex items-center gap-2 font-body font-semibold text-orange-500 group-hover:gap-3 transition-all">
                Explore Range <ArrowRight size={16} />
              </div>
            </Link>

            {/* Flavoured card */}
            <Link to="/flavoured" className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-dark-900 to-dark-800 border border-dark-700 p-8 hover:shadow-xl transition-all duration-300">
              <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/20 rounded-full -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-500" />
              <span className="badge bg-orange-500/20 text-orange-400 mb-4 inline-block">5 Bold Flavours</span>
              <h3 className="font-display font-bold text-3xl text-white mb-3">Flavoured Makhana</h3>
              <p className="font-body text-dark-400 mb-6 max-w-xs">From fiery Peri Peri to creamy Cheese & Herbs — bold flavours, clean ingredients.</p>
              <div className="flex items-center gap-2 font-body font-semibold text-orange-400 group-hover:gap-3 transition-all">
                Discover Flavours <ArrowRight size={16} />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="badge-orange mb-3 inline-block">Why Fox Khana?</span>
            <h2 className="section-heading">The Clean Crunch Promise</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <div key={f.title} className="text-center group" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:bg-orange-500 transition-colors duration-300">
                  <f.icon size={28} className="text-orange-500 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-display font-semibold text-xl text-dark-900 mb-2">{f.title}</h3>
                <p className="font-body text-dark-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="badge-orange mb-3 inline-block">Loved By Thousands</span>
            <h2 className="section-heading">What Our Crunchers Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-cream-50 rounded-3xl p-7 border border-orange-50 hover:shadow-md transition-shadow">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, s) => (
                    <Star key={s} size={16} fill="#FFB800" className="text-yellow-400" />
                  ))}
                </div>
                <p className="font-body text-dark-600 leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold font-display text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-body font-semibold text-dark-900 text-sm">{t.name}</p>
                    <p className="font-body text-dark-400 text-xs">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* B2B BANNER */}
      <section className="py-16 bg-dark-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="badge bg-orange-500/20 text-orange-400 mb-4 inline-block">For Businesses</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-5">
            Buying in Bulk?
          </h2>
          <p className="font-body text-dark-400 text-lg mb-8 max-w-xl mx-auto">
            Special pricing for restaurants, corporate gifting, retailers, and institutions. Minimum 10kg orders.
          </p>
          <Link to="/bulk-orders" className="btn-primary inline-flex items-center gap-2 text-base py-4 px-10">
            Request a Quote <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
