
import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const AdminGate = ({ children }) => {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const SECRET_PIN = '7994444996';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (pin === SECRET_PIN) {
      setIsUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setPin('');
      // Vibrate effect on error
      const input = document.getElementById('pin-input');
      input?.classList.add('animate-shake');
      setTimeout(() => input?.classList.remove('animate-shake'), 500);
    }
  };

  if (isUnlocked) {
    return children;
  }

  return (
    <div className="min-h-screen bg-black font-sans selection:bg-primary-500/30">
      <Navbar />
      
      <main className="pt-48 pb-24 flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full bg-[#111111] p-10 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden group">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>
          
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-3xl bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto mb-6 shadow-xl shadow-amber-500/5 group-hover:scale-110 transition-transform duration-500">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-display font-bold text-white mb-3 tracking-tight">Security <span className="text-amber-500">Gate</span></h1>
            <p className="text-gray-500 text-sm font-medium">Accessing sensitive area. Please enter your administrator PIN to proceed.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <input 
                  id="pin-input"
                  type={showPin ? "text" : "password"}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter Secret PIN" 
                  className={`w-full bg-black border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-6 py-4 text-white text-center text-xl tracking-[0.5em] focus:outline-none focus:border-amber-500 transition-all font-bold placeholder:text-gray-800 placeholder:tracking-normal placeholder:text-sm`}
                />
                <button 
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 p-2"
                >
                  {showPin ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                  )}
                </button>
              </div>
              {error && (
                <p className="text-red-400 text-[10px] font-bold uppercase tracking-wider text-center animate-fade-in">Invalid PIN. Access Denied.</p>
              )}
            </div>

            <button 
              type="submit" 
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-amber-600/20 active:scale-[0.98] text-sm tracking-widest uppercase"
            >
              Verify & Enter
            </button>
          </form>

          <p className="text-gray-600 text-[9px] text-center mt-8 font-bold uppercase tracking-[0.2em]">
            Authorized Personnel Only
          </p>
        </div>
      </main>
    </div>
  );
};

export default AdminGate;
