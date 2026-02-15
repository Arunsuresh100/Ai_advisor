
import React from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      title: "AI Advisor Research",
      desc: "Advanced legal research powered by modern NLP models. Get accurate answers to complex legal questions.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.673.337a4 4 0 01-2.583.343l-1.15-.23a2 2 0 01-1.428-1.428l-.23-1.15a4 4 0 01.343-2.583l.337-.673a6 6 0 00.517-3.86l-.477-2.387a2 2 0 00-.547-1.022L7.428 2zM15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
      highlight: true,
      link: "/ai-advisor"
    },
    {
      title: "Document Analysis",
      desc: "Upload contracts or legal documents for instant summary and risk assessment using machine learning.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
      highlight: false,
      link: "#"
    },
    {
      title: "Case Strategy",
      desc: "Identify potential legal precedents and build stronger strategies based on historical data.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
      highlight: false,
      link: "#"
    }
  ];

  return (
    <section id="services" className="py-32 px-6 bg-surface-background/50 relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-1.5 bg-primary-950/30 border border-primary-900/50 rounded-lg text-primary-400 text-xs font-bold tracking-widest uppercase mb-6">
            Our Services
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Cutting-Edge <span className="text-gradient">AI Solutions</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Leveraging machine learning to provide comprehensive legal support and tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div 
              key={idx} 
              className={`glass-card p-10 group transition-all duration-500 hover:translate-y-[-10px] ${service.highlight ? 'border-primary-500/30 ring-1 ring-primary-500/20' : 'hover:border-primary-500/30'}`}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-colors duration-500 ${service.highlight ? 'bg-primary-600 text-white' : 'bg-primary-950/50 text-primary-400 border border-primary-900/50 group-hover:bg-primary-600 group-hover:text-white'}`}>
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-gray-400 leading-relaxed mb-8">
                {service.desc}
              </p>
              {service.link.startsWith('/') ? (
                <Link to={service.link} className="flex items-center gap-2 text-primary-500 font-bold hover:text-primary-400 transition-colors group/link">
                  Learn More
                  <svg className="w-4 h-4 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </Link>
              ) : (
                <a href={service.link} className="flex items-center gap-2 text-primary-500 font-bold hover:text-primary-400 transition-colors group/link">
                  Learn More
                  <svg className="w-4 h-4 transition-transform group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
