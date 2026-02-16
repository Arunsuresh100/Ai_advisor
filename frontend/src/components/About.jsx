import React from 'react';

const About = () => {
  const capabilities = [
    {
      title: 'AI Legal Chat',
      desc: 'Ask anything about Indian law. Get answers grounded in statutes, judgments, and legal procedures in any Indian language.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      color: '#10b981', // Emerald
      tags: ['Multi-language', 'Voice Input', 'Live Web Search'],
      iconBg: 'bg-primary-600/20 text-primary-500'
    },
    {
      title: 'Document Intelligence',
      desc: 'Upload contracts, notices, or case files. Ask questions and get AI-powered analysis instantly.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: '#10b981', // Emerald
      tags: ['PDF & DOCX', 'OCR Support', 'Cloud Storage'],
      iconBg: 'bg-emerald-600/20 text-emerald-500'
    },
    {
      title: 'Case & Knowledge Management',
      desc: 'Keep your legal research organized by case, client, or topic in collections. Find any insight in seconds.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
      color: '#f59e0b', // Orange
      tags: ['Collections', 'Global Search', 'Share via Link'],
      iconBg: 'bg-orange-600/20 text-orange-500'
    },
    {
      title: 'Security & Privacy',
      desc: 'Enterprise-grade security. Your conversations and documents remain completely confidential.',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: '#6366f1', // Indigo
      tags: ['End-to-End Privacy', 'Not Used for AI Training', 'Delete Anytime'],
      iconBg: 'bg-indigo-600/20 text-indigo-500'
    }
  ];

  return (
    <section id="capabilities" className="py-24 px-6 bg-[#000000] relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block px-4 py-1.5 rounded-full border border-primary-500/30 text-primary-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            CORE CAPABILITIES
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 tracking-tight">
            Everything You Need for Legal Clarity
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {capabilities.map((cap, idx) => (
            <div 
              key={idx} 
              className="bg-[#111111] p-8 rounded-[32px] border border-white/5 group hover:border-primary-500/20 transition-all duration-500"
            >
              <div className="flex gap-6 items-start">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${cap.iconBg}`}>
                  {cap.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2 tracking-tight group-hover:text-primary-500 transition-colors">
                    {cap.title}
                  </h3>
                  <p className="text-gray-400 text-[13px] leading-relaxed mb-6 font-medium">
                    {cap.desc}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {cap.tags.map((tag, tIdx) => (
                      <span 
                        key={tIdx} 
                        className="px-3 py-1 bg-[#262626] rounded-full text-[9px] font-bold text-gray-500 uppercase tracking-widest"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
