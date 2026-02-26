import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('fk_cart');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('fk_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product, variant, quantity = 1) => {
    const cartKey = `${product._id}-${variant.weight}`;
    setItems(prev => {
      const existing = prev.find(i => i.cartKey === cartKey);
      if (existing) {
        toast.success('Quantity updated!');
        return prev.map(i =>
          i.cartKey === cartKey
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      toast.success(`${product.name} added to cart!`);
      return [...prev, {
        cartKey,
        productId: product._id,
        name: product.name,
        thumbnail: product.thumbnail,
        slug: product.slug,
        category: product.category,
        flavour: product.flavour,
        weight: variant.weight,
        price: variant.price,
        mrp: variant.mrp,
        quantity
      }];
    });
  };

  const updateQuantity = (cartKey, quantity) => {
    if (quantity < 1) return removeItem(cartKey);
    setItems(prev => prev.map(i => i.cartKey === cartKey ? { ...i, quantity } : i));
  };

  const removeItem = (cartKey) => {
    setItems(prev => prev.filter(i => i.cartKey !== cartKey));
    toast.success('Item removed from cart');
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('fk_cart');
  };

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
  const shippingCost = subtotal >= 499 ? 0 : 49;

  return (
    <CartContext.Provider value={{
      items, addToCart, updateQuantity, removeItem, clearCart,
      subtotal, totalItems, shippingCost
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
