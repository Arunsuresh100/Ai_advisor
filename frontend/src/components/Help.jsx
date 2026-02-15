
import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Help = () => {
  const [activeCategory, setActiveCategory] = useState('general');

  const faqs = [
    {
      id: 1,
      category: 'general',
      question: "What is AI Advisor?",
      answer: "AI Advisor is an advanced legal-tech platform that utilizes Natural Language Processing (NLP) to provide instant legal insights and research assistance."
    },
    {
      id: 2,
      category: 'general',
      question: "Is AI Advisor a replacement for a lawyer?",
      answer: "No. While AI Advisor provides high-quality legal research and guidance based on existing databases, it is designed to assist, not replace, professional human counsel."
    },
    {
      id: 3,
      category: 'technical',
      question: "How secure is my data?",
      answer: "We use laboratory-grade encryption and decentralized storage methods to ensure that your legal queries and personal data remain strictly confidential."
    },
    {
      id: 4,
      category: 'usage',
      question: "Can I upload legal documents for analysis?",
      answer: "Yes, our AI can analyze uploaded contracts, notices, and agreements to provide summaries and identify potential risks."
    }
  ];

  const categories = [
    { id: 'general', label: 'General Info' },
    { id: 'usage', label: 'How to Use' },
    { id: 'technical', label: 'Privacy & Security' },
    { id: 'account', label: 'Account & Billing' }
  ];

  return (
    <div className="min-h-screen bg-mesh font-sans pt-20">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-1.5 bg-primary-950/30 border border-primary-900/50 rounded-lg text-primary-400 text-xs font-bold tracking-widest uppercase mb-6">
            Knowledge Base
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6 tracking-tight">
            Help & <span className="text-gradient">Resources</span>
          </h1>
          <p className="max-w-2xl mx-auto text-gray-400 text-lg">
            Search our comprehensive database for answers to common questions and technical guides.
          </p>
        </div>

        {/* FAQ Search */}
        <div className="max-w-3xl mx-auto mb-16 relative group">
          <input 
            type="text" 
            placeholder="Search for help (e.g., 'document analysis', 'pricing')..." 
            className="w-full bg-surface-card border border-surface-border rounded-2xl px-12 py-5 text-white focus:outline-none focus:border-primary-500 transition-all shadow-2xl shadow-primary-950/20"
          />
          <svg className="w-6 h-6 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full text-left px-6 py-4 rounded-xl font-semibold transition-all ${activeCategory === cat.id ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' : 'bg-surface-card/30 text-gray-400 hover:bg-surface-card hover:text-white'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="lg:col-span-3 space-y-6">
            {faqs.filter(f => f.category === activeCategory || activeCategory === 'general').map(faq => (
              <div key={faq.id} className="glass-card p-8 border-surface-border hover:border-primary-500/30 transition-all">
                <h3 className="text-xl font-bold mb-4 text-white font-display">{faq.question}</h3>
                <p className="text-gray-400 leading-relaxed font-medium">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Still Need Help? */}
        <div className="mt-32 glass-card p-12 text-center border-primary-500/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 to-green-400 opacity-20"></div>
          <h2 className="text-3xl font-bold mb-4 font-display">Still need help?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            If you couldn't find the answer you were looking for, our support team is available via email or live chat.
          </p>
          <div className="flex flex-col sm:row items-center justify-center gap-4">
            <button className="premium-button px-10 py-4">Contact Support</button>
            <button className="secondary-button px-10 py-4">Visit Blog</button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Help;
