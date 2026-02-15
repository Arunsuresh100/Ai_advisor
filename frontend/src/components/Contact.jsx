
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Contact = () => {
  return (
    <div className="min-h-screen bg-mesh font-sans pt-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 bg-primary-950/30 border border-primary-900/50 rounded-lg text-primary-400 text-xs font-bold tracking-widest uppercase mb-6">
            Get In Touch
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 tracking-tight">
            How Can We <span className="text-gradient">Help You?</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg">
            Have questions about AI Advisor or legal guidelines? Our team and AI are here to support you 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="glass-card p-8 md:p-12 border-primary-500/20">
            <h2 className="text-2xl font-bold mb-8 font-display">Send us a Message</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Full Name</label>
                  <input type="text" placeholder="John Doe" className="w-full bg-surface-background border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-2">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full bg-surface-background border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Subject</label>
                <input type="text" placeholder="How can we help?" className="w-full bg-surface-background border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2">Message</label>
                <textarea rows="4" placeholder="Your message here..." className="w-full bg-surface-background border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors resize-none"></textarea>
              </div>
              <button type="submit" className="premium-button w-full py-4 text-lg">Send Message</button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="glass-card p-8 border-surface-border group hover:border-primary-500/30 transition-all">
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-2xl bg-primary-600/10 border border-primary-900/50 flex items-center justify-center flex-shrink-0 text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Email Us</h3>
                  <p className="text-gray-400 mb-1 font-medium">support@legalbot.ai</p>
                  <p className="text-gray-500 text-sm">Response within 24 hours</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 border-surface-border group hover:border-primary-500/30 transition-all">
              <div className="flex gap-6">
                <div className="w-14 h-14 rounded-2xl bg-primary-600/10 border border-primary-900/50 flex items-center justify-center flex-shrink-0 text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-all">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Office Location</h3>
                  <p className="text-gray-400 mb-1 font-medium">LegalTech Square, New Delhi</p>
                  <p className="text-gray-500 text-sm">Main Campus, AI Research Wing</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 border-surface-border group hover:border-primary-500/30 transition-all overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-600/5 rounded-full blur-3xl"></div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-primary-500 rounded-full animate-ping"></span>
                AI Support Available
              </h3>
              <p className="text-gray-400 mb-6 text-sm">
                Our AI Advisor is trained to handle most support queries instantly.
              </p>
              <button className="secondary-button w-full border-primary-500/20 text-primary-400">Ask AI Advisor First</button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
