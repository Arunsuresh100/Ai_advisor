import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const HowItWorksPage = () => {
  const steps = [
    {
      id: "01",
      title: "Ask Your Question",
      description: "Simply describe your situation the way you'd explain it to a friend. LAW ADVISOR understands everyday language and translates it into the legal context automatically. You can ask about property disputes, tenant rights, consumer complaints, criminal matters, family law, and much more.",
      example: '"My landlord hasn\'t returned my security deposit after 3 months. What are my rights?"',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      id: "02",
      title: "Get AI Analysis",
      description: "LAW ADVISOR's AI engine cross-references your query across the Indian Penal Code (IPC), Bharatiya Nyaya Sanhita (BNS), Code of Civil Procedure (CPC), Code of Criminal Procedure (CrPC), Bharatiya Nagarik Suraksha Sanhita (BNSS), Indian Evidence Act, Bharatiya Sakshya Adhiniyam (BSA), Constitution of India, and thousands of Supreme Court and High Court judgments to provide comprehensive, accurate analysis.",
      example: "AI identifies relevant sections: Rent Control Act, Security Deposit rules, and applicable High Court rulings in your state.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      id: "03",
      title: "Receive Guidance",
      description: "Your response includes specific sections of applicable laws, relevant case precedents, step-by-step next actions, and when necessary, a recommendation to consult a practicing advocate. All guidance is structured for easy understanding.",
      example: "You receive: applicable rent act sections, a template notice to send your landlord, and the process to file a complaint if needed.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  const whyChoose = [
    {
      title: "Available 24/7",
      desc: "Instant answers at 2 AM or 2 PM. Your legal research never has to wait for business hours.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
    {
      title: "Your Language",
      desc: "Ask questions in Hindi, English, Marathi, Tamil, or any Indian language you prefer.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 11.37 9.198 15.53 3 18.054" /></svg>
    },
    {
      title: "Voice Enabled",
      desc: "Don't want to type? Just speak your question naturally and get instant answers.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
    },
    {
      title: "100% Private",
      desc: "Your conversations are encrypted and never shared. Complete confidentiality guaranteed.",
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    }
  ];

  return (
    <div className="min-h-screen bg-[#000000] font-sans selection:bg-primary-500/30 selection:text-black">
      <Navbar />
      
      <main className="pt-32 pb-24">
        <section id="how-it-works" className="py-12 px-6 relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
            
            {/* Header */}
            <div className="text-center mb-20">
              <div className="inline-block px-4 py-1.5 rounded-full border border-primary-500/30 text-primary-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
                How It Works
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 tracking-tight">
                Legal Help in <span className="text-primary-500">3 Simple Steps</span>
              </h2>
              <p className="text-gray-400 text-sm md:text-base font-medium max-w-2xl mx-auto leading-relaxed">
                No appointments, no waiting rooms, no confusing legal jargon. Just ask your question and get clear, actionable legal guidance in seconds.
              </p>
            </div>

            {/* Steps Grid */}
            <div className="space-y-8 mb-32">
              {steps.map((step, idx) => (
                <div 
                  key={idx}
                  className="bg-[#111111] p-8 md:p-10 rounded-[32px] border border-white/5 relative group hover:border-primary-500/20 transition-all duration-500"
                >
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 shadow-lg shadow-primary-500/5 group-hover:scale-110 transition-transform duration-500">
                        {step.icon}
                      </div>
                      <div className="absolute -top-2 -right-2 w-7 h-7 bg-primary-500 rounded-full flex items-center justify-center text-[10px] font-black text-black border-4 border-[#111111] shadow-xl">
                        {step.id}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-4 tracking-tight group-hover:text-primary-500 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-6 font-medium">
                        {step.description}
                      </p>

                      <div className="bg-[#080808] p-5 rounded-2xl border border-white/5 group-hover:border-primary-500/10 transition-colors">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Example:</p>
                        <p className="text-xs text-gray-300 italic font-medium leading-relaxed">
                          {step.example}
                        </p>
                      </div>
                    </div>
                  </div>

                  {idx < steps.length - 1 && (
                    <div className="hidden md:block absolute left-[2.5rem] bottom-[-2rem] w-px h-8 bg-gradient-to-b from-primary-500/30 to-transparent"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Why Choose Section */}
            <div className="text-center mb-16">
              <h2 className="text-3xl font-display font-bold text-white mb-4 tracking-tight">
                Why Choose LAW ADVISOR?
              </h2>
              <p className="text-gray-400 text-sm font-medium">
                Built to make legal guidance accessible to every Indian citizen.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {whyChoose.map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-[#111111] p-8 rounded-[32px] border border-white/5 flex flex-col items-center text-center group hover:border-primary-500/20 transition-all duration-500"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 mb-6 group-hover:scale-110 transition-transform duration-500 shadow-xl shadow-primary-500/5">
                    {item.icon}
                  </div>
                  <h3 className="text-base font-bold text-white mb-3 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorksPage;
