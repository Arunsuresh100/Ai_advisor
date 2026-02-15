
import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section id="home" className="relative pt-48 pb-32 px-6 overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-950/30 border border-primary-900/50 rounded-full text-primary-400 text-xs font-semibold tracking-wider uppercase mb-8 animate-fade-in shadow-xl shadow-primary-950/20 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
          </span>
          AI-Powered Legal Intelligence
        </div>
        
        <h1 className="text-6xl md:text-8xl font-display font-bold mb-8 tracking-tight animate-slide-up bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 leading-[1.1]">
          Justice Simplified <br /> Through <span className="text-gradient">AI Advisor</span>
        </h1>
        
        <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl mb-12 animate-slide-up [animation-delay:200ms] leading-relaxed">
          Access world-class legal guidance, research assistance, and document analysis with our advanced AI Advisor. 
          Empowering you to navigate the legal system with confidence.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-slide-up [animation-delay:400ms]">
          <Link to="/ai-advisor" className="premium-button text-lg px-10 py-5 flex items-center gap-3">
            Interact with AI Advisor
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
          </Link>
          <button className="secondary-button text-lg px-10 py-5 hover:border-primary-500/30 border border-transparent">
            View Guideline DB
          </button>
        </div>

        {/* Floating Stats */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in [animation-delay:600ms]">
          <div className="p-6 rounded-2xl border border-surface-border bg-surface-card/30 backdrop-blur-sm">
            <div className="text-3xl font-bold text-white mb-1">99%</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold text-[10px]">Uptime</div>
          </div>
          <div className="p-6 rounded-2xl border border-surface-border bg-surface-card/30 backdrop-blur-sm">
            <div className="text-3xl font-bold text-white mb-1">50k+</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold text-[10px]">Cases Analyzed</div>
          </div>
          <div className="p-6 rounded-2xl border border-surface-border bg-surface-card/30 backdrop-blur-sm">
            <div className="text-3xl font-bold text-white mb-1">0.1s</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold text-[10px]">Response Time</div>
          </div>
          <div className="p-6 rounded-2xl border border-surface-border bg-surface-card/30 backdrop-blur-sm">
            <div className="text-3xl font-bold text-white mb-1">24/7</div>
            <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold text-[10px]">Availability</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
