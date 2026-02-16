import React, { useState } from 'react';

const FeatureExplorer = () => {
  const [activeTab, setActiveTab] = useState('chat');

  const tabs = [
    { id: 'chat', label: 'AI Legal Chat', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    )},
    { id: 'intelligence', label: 'Document Intelligence', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )},
    { id: 'knowledge', label: 'Case & Knowledge Management', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    )},
    { id: 'security', label: 'Security & Privacy', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )}
  ];

  const content = {
    chat: {
      desc: 'Ask anything about Indian law. Get answers grounded in statutes, judgments, and legal procedures.',
      features: [
        { title: 'Indian Law Trained AI', desc: 'Answers grounded in statutes, judgments, and procedures across family, criminal, civil, property, and consumer law.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { title: 'Response Modes', desc: 'Choose auto, short, medium, or detailed. Get a quick answer or a comprehensive legal analysis.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { title: 'Edit & Regenerate', desc: 'Refine your question and regenerate without losing thread context.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { title: 'Message Versioning', desc: 'Compare multiple AI responses to the same question by switching responses left & right.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { title: 'Voice Input', desc: 'Speak your legal questions naturally. Built-in speech-to-text support.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { title: 'Multi-language', desc: 'Ask in Hindi, get answers in English, or any combination of Indian languages.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 11.37 9.198 15.53 3 18.054"/></svg>, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
        { title: 'Live Web Search', desc: 'Search latest judgments, SC/HC orders, notifications & legal news with sources.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        { title: 'Priority Speed', desc: 'Fast response to all users and priority access to paid users during peak hours.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>, color: 'text-teal-500', bg: 'bg-teal-500/10' },
      ]
    },
    intelligence: {
      desc: 'Upload legal documents and get instant AI-powered analysis and summaries.',
      features: [
        { title: 'Document OCR', desc: 'High-accuracy text extraction from scanned PDFs and images.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        { title: 'Smart Summarization', desc: 'Get key points and executive summaries of long legal documents.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"/></svg>, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { title: 'Clause Extraction', desc: 'Automatically identify and extract specific clauses and obligations.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { title: 'Risk Assessment', desc: 'Flag potential risks or unfavorable terms in contracts.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>, color: 'text-red-500', bg: 'bg-red-500/10' },
        { title: 'Format Conversion', desc: 'Convert documents between various formats with formatting preserved.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { title: 'Batch Processing', desc: 'Analyze multiple documents simultaneously to save time.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
        { title: 'Language Detection', desc: 'Automatically detect the language of the uploaded document.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 11.37 9.198 15.53 3 18.054"/></svg>, color: 'text-teal-500', bg: 'bg-teal-500/10' },
        { title: 'Metadata Extraction', desc: 'Extract dates, entities, and locations from legal texts automatically.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>, color: 'text-gray-500', bg: 'bg-gray-500/10' },
      ]
    },
    knowledge: {
      desc: 'Keep your legal research organized and searchable in one central place.',
      features: [
        { title: 'Case Management', desc: 'Organize files and research by specific case IDs and clients.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>, color: 'text-blue-600', bg: 'bg-blue-600/10' },
        { title: 'Global Search', desc: 'Find any term, clause, or judgment across all your stored data.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>, color: 'text-emerald-600', bg: 'bg-emerald-600/10' },
        { title: 'Knowledge Graph', desc: 'Visualize connections between different cases and legal concepts.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"/></svg>, color: 'text-purple-600', bg: 'bg-purple-600/10' },
        { title: 'Collaborative Workspace', desc: 'Share research folders and documents with your team securely.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>, color: 'text-pink-600', bg: 'bg-pink-600/10' },
        { title: 'Offline Access', desc: 'Keep important research available even when you are offline.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg>, color: 'text-sky-600', bg: 'bg-sky-600/10' },
        { title: 'Auto-Tagging', desc: 'AI automatically categorizes your research for easier retrieval.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>, color: 'text-orange-600', bg: 'bg-orange-600/10' },
        { title: 'Export Capabilities', desc: 'Export research as professionally formatted PDFs or DOCX files.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>, color: 'text-rose-600', bg: 'bg-rose-600/10' },
        { title: 'Version History', desc: 'Track all changes and revert to any previous state of your research.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>, color: 'text-indigo-600', bg: 'bg-indigo-600/10' },
      ]
    },
    security: {
      desc: 'Enterprise-grade security measures to keep your legal data safe and private.',
      features: [
        { title: 'E2E Encryption', desc: 'All your data is encrypted at rest and in transit using military-grade protocols.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { title: 'Not for Training', desc: 'Your private data and conversations are never used to train or improve our AI.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { title: 'Multi-Factor Auth', desc: 'Extra layer of security for your account with 2FA/MFA support.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        { title: 'Access Logs', desc: 'View a detailed history of all access and modifications to your data.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/></svg>, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { title: 'HIPAA Compliance', desc: 'Our infrastructure adheres to international security and privacy standards.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        { title: 'Region Control', desc: 'Control where your data is stored physically across global regions.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { title: 'Auto-Purge', desc: 'Schedule automatic deletion of your search history or vault files.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
        { title: 'Security Audits', desc: 'Regular independent security audits of our entire infrastructure.', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>, color: 'text-teal-500', bg: 'bg-teal-500/10' },
      ]
    }
  };

  return (
    <section id="details" className="py-24 px-6 bg-[#000000] relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block px-4 py-1.5 rounded-full border border-primary-500/30 text-primary-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            EXPLORE FEATURES
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 tracking-tight">
            Dive Into Every Detail
          </h2>
          <p className="text-gray-400 text-sm font-medium">
            Click a category to explore what's inside.
          </p>
        </div>

        {/* Dynamic Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-full text-xs font-bold transition-all duration-500 ${
                activeTab === tab.id 
                  ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/20 scale-105' 
                  : 'bg-[#111111] text-gray-400 border border-white/5 hover:border-primary-500/20'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Description */}
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in" key={`${activeTab}-desc`}>
          <p className="text-gray-400 text-sm md:text-base font-medium leading-relaxed">
            {content[activeTab].desc}
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in" key={`${activeTab}-grid`}>
          {content[activeTab].features.map((feature, idx) => (
            <div 
              key={idx}
              className="bg-[#111111] p-8 rounded-[32px] border border-white/5 group hover:border-primary-500/20 transition-all duration-500"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 ${feature.bg} ${feature.color}`}>
                {feature.icon}
              </div>
              <h3 className="text-sm font-bold text-white mb-2 tracking-tight group-hover:text-primary-500 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-[11px] leading-relaxed font-medium">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureExplorer;
