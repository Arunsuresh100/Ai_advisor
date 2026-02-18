import React from 'react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, isDanger = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 max-w-sm w-full shadow-2xl transform transition-all scale-100 animate-slide-up relative overflow-hidden">
        {/* Ambient Background */}
        <div className={`absolute top-0 right-0 w-32 h-32 ${isDanger ? 'bg-red-500/10' : 'bg-primary-500/10'} blur-[50px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none`}></div>
        
        <h3 className="text-xl font-bold text-white mb-2 relative z-10">{title}</h3>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed relative z-10">{message}</p>
        
        <div className="flex gap-3 relative z-10">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 font-bold text-xs uppercase tracking-widest transition-all"
          >
            Cancel
          </button>
          <button 
            onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg ${
              isDanger 
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-900/20' 
                : 'bg-primary-500 hover:bg-primary-600 text-white shadow-primary-900/20'
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
