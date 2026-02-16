
import React from 'react';

const About = () => {
  const categories = [
    {
      title: 'Litigants',
      desc: 'Understand your rights clearly and navigate legal notices effectively.',
      icon: '🏛️'
    },
    {
      title: 'Lawyers',
      desc: 'Research judgments instantly and prepare bail applications faster.',
      icon: '⚖️'
    },
    {
      title: 'Law Students',
      desc: 'Learn law with AI guidance and organize case-wise legal research.',
      icon: '🎓'
    },
    {
      title: 'Law Firms',
      desc: 'Prepare applications faster and share findings with teams instantly.',
      icon: '🏢'
    }
  ];

  return (
    <section id="about" className="py-32 px-6 bg-slate-950/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-1.5 bg-primary-950/30 border border-primary-900/50 rounded-lg text-primary-400 text-xs font-bold tracking-widest uppercase mb-6">
            NyayAI Ecosystem
          </div>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
            Built for <span className="text-gradient">Legal Clarity</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Our platform is designed to serve every stakeholder in the Indian legal system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((cat, idx) => (
            <div key={idx} className="glass-card p-10 group hover:border-primary-500/50 transition-all duration-500 hover:-translate-y-2">
              <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <h4 className="text-xl font-bold text-white mb-4">{cat.title}</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                {cat.desc}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-24 p-12 glass-card bg-primary-600/5 border-primary-500/20 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary-600/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 relative z-10">Ready to Navigate Indian Law with Confidence?</h3>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto relative z-10">Ask your first legal question for free. No signup required to start exploring clarity.</p>
          <button className="premium-button px-10 py-4 relative z-10">Ask Your First Question Free</button>
        </div>
      </div>
    </section>
  );
};

export default About;
