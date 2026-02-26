import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenu, setUserMenu] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setUserMenu(false);
  }, [location]);

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Plain Makhana', to: '/plain' },
    { label: 'Flavoured', to: '/flavoured' },
    { label: 'Bulk Orders', to: '/bulk-orders' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-cream-50/95 backdrop-blur-md shadow-sm' : 'bg-cream-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform">
              <span className="text-white font-display font-bold text-base">F</span>
            </div>
            <div>
              <span className="font-display font-bold text-dark-900 text-lg leading-none">Fox</span>
              <span className="font-display font-bold text-orange-500 text-lg leading-none"> Khana</span>
              <p className="text-[10px] text-dark-400 font-body tracking-widest uppercase -mt-0.5">Premium Makhana</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link text-sm ${
                  location.pathname === link.to
                    ? 'text-orange-500 after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-orange-500 after:rounded-full'
                    : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Cart */}
            <Link to="/cart" className="relative group">
              <div className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-orange-50 transition-colors">
                <ShoppingCart size={20} className="text-dark-700 group-hover:text-orange-500 transition-colors" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </div>
            </Link>

            {/* User menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 pl-3 pr-2 py-2 rounded-full bg-white border border-dark-200 hover:border-orange-300 transition-colors"
                >
                  <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{user.name[0].toUpperCase()}</span>
                  </div>
                  <span className="font-body text-sm font-medium text-dark-700 max-w-[80px] truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} className="text-dark-400" />
                </button>
                {userMenu && (
                  <div className="absolute right-0 top-12 w-48 bg-white rounded-2xl shadow-xl border border-dark-100 py-2 z-50">
                    <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 hover:bg-cream-50 text-dark-700 text-sm">
                      <User size={15} /> My Profile
                    </Link>
                    <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 hover:bg-cream-50 text-dark-700 text-sm">
                      <ShoppingCart size={15} /> My Orders
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 hover:bg-cream-50 text-orange-600 text-sm font-medium">
                        <LayoutDashboard size={15} /> Admin Panel
                      </Link>
                    )}
                    <hr className="my-1 border-dark-100" />
                    <button onClick={logout} className="flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-500 text-sm w-full">
                      <LogOut size={15} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-2.5 px-5">
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile: cart + hamburger */}
          <div className="flex lg:hidden items-center gap-3">
            <Link to="/cart" className="relative">
              <ShoppingCart size={22} className="text-dark-700" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button onClick={() => setOpen(!open)} className="p-1">
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-cream-50 border-t border-dark-100 px-4 py-6 space-y-4">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to} className="block font-body font-medium text-dark-700 py-2">
              {link.label}
            </Link>
          ))}
          <hr className="border-dark-100" />
          {user ? (
            <>
              <Link to="/profile" className="block font-body text-dark-700 py-2">My Profile</Link>
              <Link to="/orders" className="block font-body text-dark-700 py-2">My Orders</Link>
              {isAdmin && <Link to="/admin" className="block font-body text-orange-600 font-medium py-2">Admin Panel</Link>}
              <button onClick={logout} className="block font-body text-red-500 py-2">Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn-primary block text-center">Sign In</Link>
          )}
        </div>
      )}
    </nav>
  );
}
