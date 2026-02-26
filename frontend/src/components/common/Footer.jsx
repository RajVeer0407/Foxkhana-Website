import { Link } from 'react-router-dom';
import { Instagram, Twitter, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-display font-bold text-base">F</span>
              </div>
              <span className="font-display font-bold text-white text-xl">Fox Khana</span>
            </div>
            <p className="font-body text-dark-400 text-sm leading-relaxed mb-5">
              Premium makhana snacks for the mindful snacker. Pure, nutritious, and irresistibly crunchy.
            </p>
            <p className="font-display italic text-orange-400 text-lg">"Crunch Smart. Eat Smart."</p>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-body font-semibold text-white uppercase tracking-wider text-xs mb-5">Products</h4>
            <ul className="space-y-3">
              {[
                { label: 'Plain Makhana', to: '/plain' },
                { label: 'Peri Peri', to: '/flavoured' },
                { label: 'Cheese & Herbs', to: '/flavoured' },
                { label: 'Pudina Masala', to: '/flavoured' },
                { label: 'Cream & Onion', to: '/flavoured' },
                { label: 'Tangy Tomato', to: '/flavoured' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.to} className="font-body text-dark-400 hover:text-orange-400 transition-colors text-sm flex items-center gap-1 group">
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-body font-semibold text-white uppercase tracking-wider text-xs mb-5">Company</h4>
            <ul className="space-y-3">
              {[
                { label: 'About Us', to: '/about' },
                { label: 'Bulk Orders (B2B)', to: '/bulk-orders' },
                { label: 'Privacy Policy', to: '/privacy' },
                { label: 'Shipping Policy', to: '/shipping' },
                { label: 'Refund Policy', to: '/refunds' },
                { label: 'Contact Us', to: '/contact' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.to} className="font-body text-dark-400 hover:text-orange-400 transition-colors text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body font-semibold text-white uppercase tracking-wider text-xs mb-5">Get In Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail size={15} className="text-orange-400 mt-0.5 shrink-0" />
                <span className="font-body text-dark-400 text-sm">hello@foxkhana.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={15} className="text-orange-400 mt-0.5 shrink-0" />
                <span className="font-body text-dark-400 text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-orange-400 mt-0.5 shrink-0" />
                <span className="font-body text-dark-400 text-sm">Noida, Uttar Pradesh, India</span>
              </li>
            </ul>
            <div className="flex items-center gap-4 mt-6">
              <a href="https://instagram.com" target="_blank" rel="noreferrer"
                className="w-9 h-9 bg-dark-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                <Instagram size={16} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer"
                className="w-9 h-9 bg-dark-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                <Twitter size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-dark-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-dark-400 text-sm">
            © {new Date().getFullYear()} Fox Khana. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="font-body text-dark-400 text-sm">Made with ❤️ in India</span>
            <div className="flex gap-2">
              {['visa', 'mastercard', 'upi', 'razorpay'].map(p => (
                <span key={p} className="px-2 py-1 bg-dark-800 rounded text-[10px] text-dark-400 uppercase tracking-wider font-mono">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
