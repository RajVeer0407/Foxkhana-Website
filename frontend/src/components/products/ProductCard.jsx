import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Zap } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const flavourColors = {
  'Peri Peri': 'from-red-500/20 to-orange-400/20',
  'Cheese & Herbs': 'from-yellow-400/20 to-amber-300/20',
  'Pudina Masala': 'from-green-400/20 to-emerald-300/20',
  'Cream & Onion': 'from-purple-400/20 to-pink-300/20',
  'Tangy Tomato': 'from-red-400/20 to-pink-400/20',
};

const flavourBadgeColors = {
  'Peri Peri': 'bg-red-100 text-red-600',
  'Cheese & Herbs': 'bg-yellow-100 text-yellow-700',
  'Pudina Masala': 'bg-green-100 text-green-700',
  'Cream & Onion': 'bg-purple-100 text-purple-700',
  'Tangy Tomato': 'bg-pink-100 text-pink-700',
};

export default function ProductCard({ product, animDelay = 0 }) {
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0]);
  const [adding, setAdding] = useState(false);

  const discount = selectedVariant
    ? Math.round(((selectedVariant.mrp - selectedVariant.price) / selectedVariant.mrp) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedVariant) return;
    setAdding(true);
    addToCart(product, selectedVariant);
    setTimeout(() => setAdding(false), 800);
  };

  const gradientClass = flavourColors[product.flavour] || 'from-orange-100/30 to-cream-100/30';
  const badgeClass = flavourBadgeColors[product.flavour] || 'bg-orange-100 text-orange-600';

  return (
    <Link
      to={`/product/${product.slug}`}
      className="card group block"
      style={{ animationDelay: `${animDelay}ms` }}
    >
      {/* Image */}
      <div className={`relative h-56 bg-gradient-to-br ${gradientClass} overflow-hidden`}>
        {discount >= 10 && (
          <div className="absolute top-3 left-3 z-10 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {discount}% OFF
          </div>
        )}
        {product.isFeatured && (
          <div className="absolute top-3 right-3 z-10 bg-dark-900 text-white text-xs font-body font-semibold px-2 py-1 rounded-full flex items-center gap-1">
            <Zap size={10} fill="currentColor" /> Featured
          </div>
        )}
        <img
          src={product.thumbnail || 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=400'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=400' }}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category & Flavour badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`badge text-[10px] ${badgeClass}`}>
            {product.flavour || 'Plain'}
          </span>
          {product.rating > 0 && (
            <div className="flex items-center gap-1 ml-auto">
              <Star size={12} fill="#FFB800" className="text-yellow-400" />
              <span className="font-body text-xs text-dark-600 font-medium">{product.rating}</span>
              <span className="font-body text-xs text-dark-400">({product.numReviews})</span>
            </div>
          )}
        </div>

        <h3 className="font-display font-semibold text-dark-900 text-lg leading-tight mb-1 group-hover:text-orange-500 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="font-body text-dark-400 text-sm line-clamp-2 mb-3">{product.shortDescription}</p>

        {/* Variant selector */}
        {product.variants?.length > 1 && (
          <div className="flex gap-2 mb-3 flex-wrap">
            {product.variants.map(v => (
              <button
                key={v.weight}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedVariant(v); }}
                className={`px-2.5 py-1 rounded-lg text-xs font-body font-medium border transition-all ${
                  selectedVariant?.weight === v.weight
                    ? 'border-orange-500 bg-orange-50 text-orange-600'
                    : 'border-dark-200 text-dark-600 hover:border-orange-300'
                }`}
              >
                {v.weight}
              </button>
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between">
          <div>
            <span className="font-display font-bold text-dark-900 text-xl">
              ₹{selectedVariant?.price}
            </span>
            {selectedVariant?.mrp > selectedVariant?.price && (
              <span className="font-body text-dark-400 text-sm line-through ml-2">
                ₹{selectedVariant?.mrp}
              </span>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={adding}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-body font-semibold transition-all ${
              adding
                ? 'bg-green-500 text-white scale-95'
                : 'bg-orange-500 text-white hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/25'
            }`}
          >
            <ShoppingCart size={15} />
            {adding ? 'Added!' : 'Add'}
          </button>
        </div>
      </div>
    </Link>
  );
}
