import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { productAPI } from '../utils/api';
import ProductCard from '../components/products/ProductCard';

function ProductListingPage({ category, title, subtitle, description }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [flavourFilter, setFlavourFilter] = useState('');

  const flavours = ['Peri Peri', 'Cheese & Herbs', 'Pudina Masala', 'Cream & Onion', 'Tangy Tomato'];

  useEffect(() => {
    setLoading(true);
    const params = { category, limit: 20 };
    if (search) params.search = search;
    if (flavourFilter) params.flavour = flavourFilter;

    productAPI.getAll(params)
      .then(res => {
        let sorted = [...res.data.products];
        if (sort === 'price-asc') sorted.sort((a, b) => a.variants[0]?.price - b.variants[0]?.price);
        if (sort === 'price-desc') sorted.sort((a, b) => b.variants[0]?.price - a.variants[0]?.price);
        if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating);
        setProducts(sorted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category, search, sort, flavourFilter]);

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-dark-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <span className="badge bg-orange-500/20 text-orange-400 mb-4 inline-block">{subtitle}</span>
          <h1 className="font-display text-5xl md:text-6xl font-black text-white mb-4">{title}</h1>
          <p className="font-body text-dark-400 text-lg max-w-2xl mx-auto">{description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-11 pr-4"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2">
                <X size={16} className="text-dark-400" />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="input-field max-w-[180px]"
          >
            <option value="">Sort By</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {/* Flavour filters (flavoured page only) */}
        {category === 'flavoured' && (
          <div className="flex items-center gap-3 mb-8 flex-wrap">
            <span className="font-body text-sm text-dark-500 font-medium flex items-center gap-2">
              <SlidersHorizontal size={15} /> Flavour:
            </span>
            <button
              onClick={() => setFlavourFilter('')}
              className={`px-4 py-2 rounded-full text-sm font-body font-medium border transition-all ${
                !flavourFilter ? 'bg-dark-900 text-white border-dark-900' : 'border-dark-200 text-dark-600 hover:border-dark-400'
              }`}
            >
              All Flavours
            </button>
            {flavours.map(f => (
              <button
                key={f}
                onClick={() => setFlavourFilter(flavourFilter === f ? '' : f)}
                className={`px-4 py-2 rounded-full text-sm font-body font-medium border transition-all ${
                  flavourFilter === f ? 'bg-orange-500 text-white border-orange-500' : 'border-dark-200 text-dark-600 hover:border-orange-300'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        {/* Product count */}
        {!loading && (
          <p className="font-body text-dark-400 text-sm mb-6">
            Showing {products.length} product{products.length !== 1 ? 's' : ''}
          </p>
        )}

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card h-80 animate-pulse bg-cream-100" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🥜</div>
            <h3 className="font-display text-2xl text-dark-900 mb-2">No products found</h3>
            <p className="font-body text-dark-400">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <ProductCard key={product._id} product={product} animDelay={i * 75} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function PlainMakhanaPage() {
  return (
    <ProductListingPage
      category="plain"
      title="Plain Makhana"
      subtitle="Pure & Natural"
      description="Premium lotus seeds in their purest form. Handpicked from Bihar's pristine lakes. Zero oil, zero additives, infinite nutrition."
    />
  );
}

export function FlavouredMakhanaPage() {
  return (
    <ProductListingPage
      category="flavoured"
      title="Flavoured Makhana"
      subtitle="5 Bold Flavours"
      description="From fiery Peri Peri to cooling Pudina Masala — every flavour is a journey. Clean ingredients, bold taste."
    />
  );
}
