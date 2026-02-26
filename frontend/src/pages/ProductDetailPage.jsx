import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Star, Plus, Minus, ChevronRight, Shield, Truck, RotateCcw } from 'lucide-react';
import { productAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    productAPI.getBySlug(slug)
      .then(res => {
        setProduct(res.data.product);
        setSelectedVariant(res.data.product.variants?.[0]);
      })
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addToCart(product, selectedVariant, quantity);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to leave a review');
    setSubmittingReview(true);
    try {
      await productAPI.addReview(product._id, reviewForm);
      toast.success('Review submitted!');
      const res = await productAPI.getBySlug(slug);
      setProduct(res.data.product);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="spinner" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center text-center">
        <div>
          <div className="text-6xl mb-4">😕</div>
          <h2 className="font-display text-3xl mb-4">Product Not Found</h2>
          <Link to="/" className="btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  const discount = selectedVariant
    ? Math.round(((selectedVariant.mrp - selectedVariant.price) / selectedVariant.mrp) * 100)
    : 0;

  return (
    <div className="pt-16 lg:pt-20 min-h-screen bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-body text-sm text-dark-400 mb-8">
          <Link to="/" className="hover:text-orange-500">Home</Link>
          <ChevronRight size={14} />
          <Link to={`/${product.category}`} className="hover:text-orange-500 capitalize">{product.category} Makhana</Link>
          <ChevronRight size={14} />
          <span className="text-dark-700">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-orange-50 to-cream-100 shadow-lg">
              <img
                src={product.images?.[activeImage] || product.thumbnail}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=600' }}
              />
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-colors ${
                      activeImage === i ? 'border-orange-500' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="badge-orange capitalize">{product.flavour || 'Plain'}</span>
                {product.isFeatured && <span className="badge-dark">Bestseller</span>}
              </div>
              <h1 className="font-display font-bold text-4xl text-dark-900 leading-tight mb-3">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16}
                      fill={i < Math.round(product.rating) ? '#FFB800' : 'none'}
                      className={i < Math.round(product.rating) ? 'text-yellow-400' : 'text-dark-200'}
                    />
                  ))}
                </div>
                <span className="font-body text-sm font-semibold text-dark-700">{product.rating}</span>
                <span className="font-body text-sm text-dark-400">({product.numReviews} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-end gap-4">
              <span className="font-display font-black text-5xl text-dark-900">
                ₹{selectedVariant?.price}
              </span>
              {selectedVariant?.mrp > selectedVariant?.price && (
                <>
                  <span className="font-body text-dark-400 text-xl line-through mb-1">₹{selectedVariant?.mrp}</span>
                  <span className="badge bg-green-100 text-green-700 mb-1">{discount}% off</span>
                </>
              )}
            </div>

            {/* Variant selector */}
            <div>
              <p className="font-body font-semibold text-dark-700 text-sm mb-3">Select Weight</p>
              <div className="flex gap-3 flex-wrap">
                {product.variants?.map(v => (
                  <button
                    key={v.weight}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-5 py-3 rounded-xl border-2 font-body font-medium transition-all ${
                      selectedVariant?.weight === v.weight
                        ? 'border-orange-500 bg-orange-50 text-orange-600'
                        : 'border-dark-200 text-dark-600 hover:border-orange-300'
                    }`}
                  >
                    <span className="block font-semibold">{v.weight}</span>
                    <span className="block text-xs">₹{v.price}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="font-body font-semibold text-dark-700 text-sm mb-3">Quantity</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-dark-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-4 py-3 hover:bg-orange-50 transition-colors">
                    <Minus size={16} />
                  </button>
                  <span className="px-5 py-3 font-body font-bold text-lg min-w-[48px] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)}
                    className="px-4 py-3 hover:bg-orange-50 transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
                <span className="font-body text-dark-400 text-sm">
                  {selectedVariant?.stock > 0 ? `${selectedVariant.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleAddToCart}
              disabled={selectedVariant?.stock === 0}
              className="w-full btn-primary text-base py-4 flex items-center justify-center gap-3"
            >
              <ShoppingCart size={20} />
              {selectedVariant?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            {/* Description */}
            <div className="border-t border-dark-100 pt-6">
              <h3 className="font-display font-semibold text-lg text-dark-900 mb-3">About This Product</h3>
              <p className="font-body text-dark-500 leading-relaxed">{product.description}</p>
            </div>

            {/* Ingredients */}
            {product.ingredients?.length > 0 && (
              <div>
                <h3 className="font-display font-semibold text-lg text-dark-900 mb-2">Ingredients</h3>
                <p className="font-body text-dark-500 text-sm">{product.ingredients.join(', ')}</p>
              </div>
            )}

            {/* Nutrition */}
            {product.nutritionInfo && (
              <div className="bg-white rounded-2xl p-5 border border-dark-100">
                <h3 className="font-display font-semibold text-dark-900 mb-4">Nutrition Per 100g</h3>
                <div className="grid grid-cols-5 gap-3 text-center">
                  {Object.entries(product.nutritionInfo).map(([key, val]) => (
                    <div key={key} className="bg-cream-50 rounded-xl p-2">
                      <p className="font-body font-bold text-dark-900 text-sm">{val}</p>
                      <p className="font-body text-dark-400 text-xs capitalize">{key}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trust */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Truck, label: 'Free Ship', sub: 'Orders ₹499+' },
                { icon: Shield, label: 'Secure Pay', sub: 'Razorpay' },
                { icon: RotateCcw, label: 'Easy Return', sub: '7-day policy' }
              ].map(t => (
                <div key={t.label} className="text-center p-3 bg-white rounded-2xl border border-dark-100">
                  <t.icon size={20} className="text-orange-500 mx-auto mb-1.5" />
                  <p className="font-body font-semibold text-dark-900 text-xs">{t.label}</p>
                  <p className="font-body text-dark-400 text-[10px]">{t.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-16 pt-12 border-t border-dark-100">
          <h2 className="font-display font-bold text-3xl text-dark-900 mb-8">Customer Reviews</h2>

          {/* Review form */}
          {user ? (
            <form onSubmit={handleReview} className="bg-white rounded-3xl p-7 border border-dark-100 mb-8 max-w-xl">
              <h3 className="font-display font-semibold text-xl mb-5">Write a Review</h3>
              <div className="mb-4">
                <label className="font-body text-dark-600 text-sm font-medium mb-2 block">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(r => (
                    <button key={r} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: r }))}>
                      <Star size={28}
                        fill={r <= reviewForm.rating ? '#FFB800' : 'none'}
                        className={r <= reviewForm.rating ? 'text-yellow-400' : 'text-dark-200'}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-5">
                <label className="font-body text-dark-600 text-sm font-medium mb-2 block">Your Review</label>
                <textarea
                  value={reviewForm.comment}
                  onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                  required
                  rows={4}
                  className="input-field resize-none"
                  placeholder="Share your experience..."
                />
              </div>
              <button type="submit" disabled={submittingReview} className="btn-primary">
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <p className="font-body text-dark-500 mb-6">
              <Link to="/login" className="text-orange-500 font-semibold">Login</Link> to write a review
            </p>
          )}

          {/* Reviews list */}
          {product.reviews?.length === 0 ? (
            <p className="font-body text-dark-400">No reviews yet. Be the first!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.reviews?.map((review, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-dark-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {review.name[0]}
                    </div>
                    <div>
                      <p className="font-body font-semibold text-dark-900 text-sm">{review.name}</p>
                      <p className="font-body text-dark-400 text-xs">{new Date(review.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                    <div className="flex gap-0.5 ml-auto">
                      {[...Array(review.rating)].map((_, s) => (
                        <Star key={s} size={12} fill="#FFB800" className="text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="font-body text-dark-600 text-sm leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
