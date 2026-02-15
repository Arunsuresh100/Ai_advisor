
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Use global login function to update state and storage
        login(data.user, data.token);
        
        setShowSuccessModal(true);
        setTimeout(() => {
          // Redirect based on role
          if (data.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/'); 
          }
        }, 2000);
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('Cannot connect to the server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh font-sans flex flex-col overflow-hidden text-white">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center p-4 relative">
        <div className="w-full max-w-[480px] animate-slide-up z-10">
          <div className="glass-card p-8 border-primary-500/20 relative backdrop-blur-3xl shadow-2xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-tr from-primary-600 to-green-400 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/20">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-white">AI Advisor</h1>
                <p className="text-gray-400 text-xs font-medium uppercase tracking-widest">Expert Legal Access</p>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-bold flex items-center gap-3 animate-shake">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1 mb-1 block">Email Address</label>
                <input 
                  name="email"
                  type="email" 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="arun@example.com" 
                  className="w-full bg-surface-background/30 border border-surface-border rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-primary-500 transition-all placeholder:text-gray-700" 
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1 ml-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Password</label>
                  <a href="#" className="text-[9px] font-bold text-primary-500 hover:text-primary-400 uppercase tracking-widest">Forgot?</a>
                </div>
                <div className="relative group">
                  <input 
                    name="password"
                    type={showPassword ? 'text' : 'password'} 
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••" 
                    className="w-full bg-surface-background/30 border border-surface-border rounded-lg pl-3 pr-10 py-3 text-sm text-white focus:outline-none focus:border-primary-500 transition-all placeholder:text-gray-700 font-mono" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-primary-500 focus:outline-none"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/></svg>
                    )}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full py-4 mt-6 rounded-xl bg-gradient-to-r from-primary-600 to-green-500 text-white font-bold text-sm tracking-widest uppercase shadow-lg shadow-primary-600/20 hover:shadow-primary-600/40 transform transition-all duration-300 active:scale-[0.98] ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01]'}`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : 'Log In'}
              </button>
            </form>

            <div className="mt-8 text-center pt-6 border-t border-surface-border/30">
              <p className="text-gray-500 text-xs font-semibold">
                New to AI Advisor? <Link to="/register" className="text-primary-500 hover:text-primary-400 font-bold transition-colors">Sign Up</Link>
              </p>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-2 opacity-30 pointer-events-none">
          <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm9.496 3.592a1 1 0 00-1.412-1.412l-3 3a1 1 0 001.412 1.412l3-3z" clipRule="evenodd"/></svg>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-display">Secure LegalTech Environment v1.0</span>
        </div>
      </main>

      {/* Professional Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-fade-in"></div>
          <div className="glass-card max-w-sm w-full p-10 border-primary-500/40 text-center relative z-10 animate-scale-up shadow-[0_0_80px_-15px_rgba(34,197,94,0.4)]">
            <div className="w-24 h-24 bg-primary-600/20 border border-primary-500/30 rounded-full flex items-center justify-center mx-auto mb-8 relative">
               <div className="absolute inset-0 rounded-full bg-primary-500 animate-ping opacity-20"></div>
              <div className="w-16 h-16 bg-gradient-to-tr from-primary-600 to-green-400 rounded-full flex items-center justify-center text-white shadow-xl">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7"/></svg>
              </div>
            </div>
            <h3 className="text-3xl font-display font-bold mb-3 text-white">Welcome!</h3>
            <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8">
              Authentication secured. You are now logged into the **AI Advisor** network.
            </p>
            <div className="flex flex-col items-center gap-2">
               <div className="w-full bg-surface-background/50 h-1 rounded-full overflow-hidden">
                  <div className="bg-primary-500 h-full animate-loading-bar w-full"></div>
               </div>
               <span className="text-[10px] font-bold text-primary-500 uppercase tracking-[0.3em]">Redirecting...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
