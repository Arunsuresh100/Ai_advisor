
import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-600/20 rounded-full blur-3xl"></div>
            <div className="glass-card p-4 relative z-10">
              <div className="aspect-square bg-surface-background rounded-xl overflow-hidden flex items-center justify-center p-8">
                <div className="relative w-full h-full border-2 border-dashed border-primary-900/50 rounded-lg flex items-center justify-center">
                   <div className="w-1/2 h-1/2 bg-gradient-to-tr from-primary-600 to-green-400 rounded-3xl animate-pulse blur-xl opacity-50 absolute"></div>
                   <svg className="w-1/3 h-1/3 text-primary-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                   </svg>
                </div>
              </div>
            </div>
            {/* Experience Tag */}
            <div className="absolute -bottom-6 -right-6 glass-card px-8 py-6 max-w-[240px]">
               <div className="text-primary-500 font-bold text-lg mb-1 italic">"Empowering the Justice"</div>
               <p className="text-xs text-gray-400">Our mission is to bridge the gap between complex law and everyday people.</p>
            </div>
          </div>
          
          <div>
            <div className="inline-block px-4 py-1.5 bg-primary-950/30 border border-primary-900/50 rounded-lg text-primary-400 text-xs font-bold tracking-widest uppercase mb-6">
              Who We Are
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 leading-tight">
              Revolutionizing Access to <span className="text-gradient">Legal Expertise</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              LegalBot represents a groundbreaking development in the field of legal technology. 
              Our vision is to democratize access to legal guidance through advanced NLP algorithms and a vast knowledge base.
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-600/10 border border-primary-900/50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Human-Centric Design</h4>
                  <p className="text-gray-500 text-sm">Created with real-world complexities in mind, ensuring accessibility for all.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-600/10 border border-primary-900/50 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-1">Continuous Learning</h4>
                  <p className="text-gray-500 text-sm">Our AI models evolve with every interaction, staying current with legislative changes.</p>
                </div>
              </div>
            </div>
            
            <button className="secondary-button mt-12">Learn More About AI Advisor</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
