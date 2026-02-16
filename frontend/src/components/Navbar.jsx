
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const isChat = location.pathname === '/ai-advisor';

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-4 group cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-tr from-primary-600 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/20 group-hover:scale-110 transition-transform">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-xl tracking-tight text-white leading-none">
              LAW <span className="text-primary-500">ADVISOR</span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold mt-1">
              Legal Intelligence for India
            </span>
          </div>
        </Link>
        
        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide text-gray-400">
          <Link to="/" className={`hover:text-primary-400 transition-colors ${location.pathname === '/' ? 'text-primary-500' : ''}`}>Features</Link>
          <Link to="/#how-it-works" className="hover:text-primary-400 transition-colors">How it works</Link>
          <Link to="/ai-advisor" className={`hover:text-primary-400 transition-colors ${isChat ? 'text-primary-500' : ''}`}>AI Advisor</Link>
          <Link to="/#about" className="hover:text-primary-400 transition-colors">About</Link>
          <Link to="/contact" className={`hover:text-primary-400 transition-colors ${location.pathname === '/contact' ? 'text-primary-500' : ''}`}>Contact</Link>
        </div>

        {/* Auth Buttons / User Dropdown */}
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link to="/login" className="text-gray-400 hover:text-white transition-colors px-4 py-2 text-sm font-semibold">Login</Link>
              <Link to="/register" className="premium-button text-sm px-6 py-2.5">Get Started</Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-3 bg-white/5 hover:bg-white/10 transition-colors rounded-full pl-2 pr-4 py-1.5 border border-white/10 group shadow-lg"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-500 to-emerald-400 flex items-center justify-center text-xs font-bold text-white uppercase shadow-inner">
                  {user.name?.charAt(0) || 'U'}
                </div>
                <span className="text-sm font-medium text-gray-200 group-hover:text-white">{user.name?.split(' ')[0]}</span>
                <svg className={`w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-2 animate-slide-up origin-top-right z-50">
                  {/* User Info Header */}
                  <div className="px-5 py-4 mb-2 border-b border-white/5 bg-white/5">
                    <p className="text-sm font-bold text-white truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5 font-medium">{user.email}</p>
                  </div>
                  
                  <Link to="/user" className="flex items-center gap-3 px-5 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors" onClick={() => setIsDropdownOpen(false)}>
                    <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </div>
                    Profile Settings
                  </Link>
                  <div className="h-px bg-white/5 mx-2 my-1"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    </div>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
