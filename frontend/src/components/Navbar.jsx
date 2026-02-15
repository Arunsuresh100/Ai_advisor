
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

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-green-400 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-primary-600/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
          </div>
          <span className="font-display font-bold text-2xl tracking-tight transition-colors group-hover:text-primary-400 text-white">
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
          {!user ? (
            <>
              <Link to="/login" className="text-gray-400 hover:text-white transition-colors px-4 py-2 text-sm font-semibold">Login</Link>
              <Link to="/register" className="premium-button text-sm px-6 py-2.5">Get Started</Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-1.5 py-1.5 rounded-full hover:bg-white/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-600 to-green-500 flex items-center justify-center text-white font-bold text-lg border-2 border-white/10 group-hover:border-primary-500/50 transition-all shadow-lg overflow-hidden shrink-0">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <svg 
                  className={`w-4 h-4 text-gray-500 group-hover:text-white transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Professional Profile Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-4 w-60 bg-slate-900/95 backdrop-blur-2xl border border-white/5 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-fade-in-up z-[60]">
                  <div className="px-4 py-3 mb-2 border-b border-white/5">
                    <p className="text-xs font-bold text-primary-500 uppercase tracking-widest mb-1">Authenticated Account</p>
                    <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-gray-500 font-medium truncate">{user.email}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <Link 
                      to="/user" 
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-sm font-medium text-gray-300 hover:text-white transition-colors group"
                    >
                      <svg className="w-4 h-4 text-gray-500 group-hover:text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                      Profile
                    </Link>
                  </div>

                  <div className="mt-2 pt-2 border-t border-white/5">
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 text-sm font-medium text-red-400 hover:text-red-300 transition-colors group"
                    >
                      <svg className="w-4 h-4 text-red-400/50 group-hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                      Sign Out
                    </button>
                  </div>
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
