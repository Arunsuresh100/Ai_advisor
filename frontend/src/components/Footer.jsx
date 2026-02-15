
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-surface-card border-t border-surface-border pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-tr from-primary-600 to-green-400 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <span className="font-display font-bold text-xl tracking-tight">LEGAL<span className="text-primary-500 font-extrabold">BOT</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Democratizing legal access through cutting-edge AI technology. Expert guidance, simplified for everyone.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 border border-surface-border rounded-full flex items-center justify-center hover:bg-primary-600 hover:border-primary-600 transition-all text-gray-400 hover:text-white transform hover:scale-110">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 border border-surface-border rounded-full flex items-center justify-center hover:bg-primary-600 hover:border-primary-600 transition-all text-gray-400 hover:text-white transform hover:scale-110">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222.0h.003z"/></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-display font-bold text-white mb-6 uppercase tracking-wider text-xs">Features</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary-400 transition-colors">AI Advisor Chat</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Guideline Database</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Risk Assessment</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Legal Research</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white mb-6 uppercase tracking-wider text-xs">Platform</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Case Precedents</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Compliance</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-white mb-6 uppercase tracking-wider text-xs">Stay Secure</h4>
            <p className="text-sm text-gray-400 mb-6">Receive the latest updates in legal-tech and security directly.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email" 
                className="bg-surface-background border border-surface-border rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-primary-500 flex-1 transition-colors"
              />
              <button className="bg-primary-600 hover:bg-primary-500 text-white p-2.5 rounded-lg transition-colors shadow-lg shadow-primary-600/20 transform hover:scale-110 active:scale-95">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
              </button>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-surface-border flex flex-col md:row items-center justify-between gap-4">
          <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-widest">© 2026 LegalBot AI. Empowering informed decisions.</p>
          <div className="flex gap-6 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            <span>Powered by GPT-4 & India Legal Dataset</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
