
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const isChat = location.pathname === '/ai-advisor';

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface-background/80 backdrop-blur-xl border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-green-400 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-primary-600/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>
          <span className="font-display font-bold text-2xl tracking-tight transition-colors group-hover:text-primary-400">
            LEGAL<span className="text-primary-500 font-extrabold">BOT</span>
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-10 text-sm font-semibold tracking-wide text-gray-400">
          <Link to="/" className={`hover:text-primary-400 transition-colors ${location.pathname === '/' ? 'text-primary-500' : ''}`}>Home</Link>
          <Link to="/ai-advisor" className={`hover:text-primary-400 transition-colors ${isChat ? 'text-primary-500' : ''}`}>AI Advisor</Link>
          <Link to="/contact" className={`hover:text-primary-400 transition-colors ${location.pathname === '/contact' ? 'text-primary-500' : ''}`}>Contact</Link>
          <Link to="/help" className={`hover:text-primary-400 transition-colors ${location.pathname === '/help' ? 'text-primary-500' : ''}`}>Help</Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-gray-400 hover:text-white transition-colors px-4 py-2 text-sm font-semibold">Login</button>
          <Link to="/ai-advisor" className="premium-button text-sm px-6 py-2.5">Get Started</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
