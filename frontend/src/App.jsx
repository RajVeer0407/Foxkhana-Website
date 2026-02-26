import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import './styles/globals.css';

// Pages
import HomePage from './pages/HomePage';
import { PlainMakhanaPage, FlavouredMakhanaPage } from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import BulkOrderPage from './pages/BulkOrderPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import AdminDashboard from './pages/AdminDashboard';
import { OrderSuccessPage, MyOrdersPage } from './pages/OrderPages';

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                fontFamily: '"DM Sans", sans-serif',
                borderRadius: '12px',
                background: '#1A1A1A',
                color: '#ffffff',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#FF6B00', secondary: '#fff' }
              }
            }}
          />
          <Routes>
            {/* Admin (no shared layout) */}
            <Route path="/admin/*" element={<AdminDashboard />} />

            {/* Auth (no footer/navbar) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Main routes */}
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/plain" element={<Layout><PlainMakhanaPage /></Layout>} />
            <Route path="/flavoured" element={<Layout><FlavouredMakhanaPage /></Layout>} />
            <Route path="/product/:slug" element={<Layout><ProductDetailPage /></Layout>} />
            <Route path="/cart" element={<Layout><CartPage /></Layout>} />
            <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
            <Route path="/bulk-orders" element={<Layout><BulkOrderPage /></Layout>} />
            <Route path="/orders" element={<Layout><MyOrdersPage /></Layout>} />
            <Route path="/order-success/:id" element={<Layout><OrderSuccessPage /></Layout>} />

            {/* 404 */}
            <Route path="*" element={
              <Layout>
                <div className="min-h-screen flex items-center justify-center text-center pt-20">
                  <div>
                    <div className="text-8xl mb-4">🦊</div>
                    <h1 className="font-display text-5xl font-bold text-dark-900 mb-4">404</h1>
                    <p className="font-body text-dark-400 mb-6">This page got eaten by the fox.</p>
                    <a href="/" className="btn-primary">Go Home</a>
                  </div>
                </div>
              </Layout>
            } />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
