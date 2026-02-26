import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`);
      const redirect = params.get('redirect');
      navigate(redirect ? `/${redirect}` : data.user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
              <span className="text-white font-display font-bold text-xl">F</span>
            </div>
            <div className="text-left">
              <span className="font-display font-bold text-dark-900 text-2xl">Fox</span>
              <span className="font-display font-bold text-orange-500 text-2xl"> Khana</span>
            </div>
          </Link>
          <p className="font-body text-dark-400 mt-4">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-dark-50 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-body text-dark-600 text-sm font-medium mb-2 block">Email Address</label>
              <input type="email" required value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="input-field" placeholder="you@example.com" />
            </div>
            <div>
              <label className="font-body text-dark-600 text-sm font-medium mb-2 block">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="input-field pr-12" placeholder="Your password" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary py-4 text-base">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="font-body text-dark-400 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-orange-500 font-semibold hover:underline">Create one</Link>
            </p>
          </div>

          {/* Admin hint */}
          <div className="mt-6 p-4 bg-cream-50 rounded-2xl border border-orange-100">
            <p className="font-body text-xs text-dark-500 text-center">
              <strong>Admin Demo:</strong> admin@foxkhana.com / Admin@123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      toast.success('Account created! Welcome to Fox Khana 🦊');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
              <span className="text-white font-display font-bold text-xl">F</span>
            </div>
            <div className="text-left">
              <span className="font-display font-bold text-dark-900 text-2xl">Fox</span>
              <span className="font-display font-bold text-orange-500 text-2xl"> Khana</span>
            </div>
          </Link>
          <p className="font-body text-dark-400 mt-4">Create your account</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-dark-50 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-body text-dark-600 text-sm font-medium mb-2 block">Full Name *</label>
              <input required value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="input-field" placeholder="Your full name" />
            </div>
            <div>
              <label className="font-body text-dark-600 text-sm font-medium mb-2 block">Email Address *</label>
              <input type="email" required value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="input-field" placeholder="you@example.com" />
            </div>
            <div>
              <label className="font-body text-dark-600 text-sm font-medium mb-2 block">Phone (optional)</label>
              <input value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                className="input-field" placeholder="+91 XXXXX XXXXX" />
            </div>
            <div>
              <label className="font-body text-dark-600 text-sm font-medium mb-2 block">Password *</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="input-field pr-12" placeholder="Min. 6 characters" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary py-4 text-base">
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="font-body text-dark-400 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-orange-500 font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
