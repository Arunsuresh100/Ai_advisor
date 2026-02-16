import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const whyChoose = [
    {
      title: "Instant Access",
      desc: "Get answers to your legal queries in real-time. No appointments, no waiting.",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    },
    {
      title: "Wide Coverage",
      desc: "Family law, criminal law, civil law, property law, consumer rights, and more.",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
    },
    {
      title: "User-Friendly",
      desc: "Designed to simplify complex legal information for everyone.",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
    },
    {
      title: "Free Forever",
      desc: "Free since inception and free forever for normal use. Upgrades only for professional needs.",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
    },
    {
      title: "Always Improving",
      desc: "Constantly learning and evolving based on user feedback.",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
    },
    {
      title: "Trusted & Secure",
      desc: "Your data is protected and conversations remain confidential.",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
    }
  ];

  return (
    <div className="min-h-screen bg-[#000000] font-sans selection:bg-primary-500/30 selection:text-black">
      <Navbar />

      <main id="about-page-top" className="pt-32 pb-24">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto px-6 mb-24">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-medium mb-12">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Home
          </Link>
          
          <div className="text-center">
            <div className="inline-block px-4 py-1.5 rounded-full border border-primary-500/30 text-primary-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              About LAW ADVISOR
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight leading-tight">
              Making Legal Information <br />
              <span className="text-primary-500">Accessible to All</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
              Your AI-powered legal assistant, designed to empower people with the knowledge they need to navigate the complexities of Indian law with confidence.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="max-w-7xl mx-auto px-6 mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Story Card */}
            <div className="lg:col-span-6 animate-slide-up">
              <div className="bg-[#111111] p-10 md:p-12 rounded-[40px] border border-white/5 relative group hover:border-primary-500/20 transition-all duration-500">
                <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 mb-8 shadow-xl shadow-primary-500/5">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
                <div className="space-y-6 text-gray-400 text-sm md:text-base leading-relaxed font-medium">
                  <p>
                    LAW ADVISOR was born out of a vision to bridge the gap between everyday citizens and the legal system. We realized that accessing accurate, up-to-date legal information can be difficult, time-consuming, and often expensive.
                  </p>
                  <p>
                    Our team of technology experts, legal professionals, and data scientists came together to create a powerful AI-driven chatbot that can provide quick and reliable legal information to the public for free or at minimal cost.
                  </p>
                </div>
              </div>
            </div>

            {/* Built Different Content */}
            <div className="lg:col-span-6 space-y-8 lg:pl-12">
              <h2 className="text-3xl font-bold text-white tracking-tight">Built Different</h2>
              <div className="space-y-6 text-gray-400 text-base leading-relaxed font-medium">
                <p>
                  LAW ADVISOR is not just another chatbot. It has been carefully developed to understand the nuances of Indian law and answer common legal queries with clarity and precision.
                </p>
                <p>
                  The platform is built with cutting-edge artificial intelligence and continuously updated to ensure that you receive the most accurate and relevant information.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="bg-[#111111] p-8 rounded-3xl border border-white/5 text-center transition-colors hover:border-primary-500/10">
                  <div className="text-3xl font-display font-bold text-primary-500 mb-1">3+</div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest uppercase">Years Experience</div>
                </div>
                <div className="bg-[#111111] p-8 rounded-3xl border border-white/5 text-center transition-colors hover:border-primary-500/10">
                  <div className="text-3xl font-display font-bold text-primary-500 mb-1">2M+</div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest uppercase">Queries Answered</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Us Section */}
        <div className="max-w-7xl mx-auto px-6 mb-32">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full border border-primary-500/30 text-primary-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              Why Choose Us
            </div>
            <h2 className="text-4xl font-display font-bold text-white mb-6">Why LAW ADVISOR?</h2>
            <p className="text-gray-400 text-sm font-medium max-w-xl mx-auto">
              We're committed to making legal information accessible, affordable, and easy to understand.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChoose.map((item, idx) => (
              <div 
                key={idx}
                className="bg-[#111111] p-10 rounded-[40px] border border-white/5 group hover:border-primary-500/20 transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 mb-8 transition-transform duration-500 group-hover:scale-110 shadow-lg shadow-primary-500/5">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4 tracking-tight group-hover:text-primary-500 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-[#111111] p-10 md:p-20 rounded-[48px] border border-white/5 text-center relative overflow-hidden group hover:border-primary-500/20 transition-all duration-500">
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 mx-auto mb-10 shadow-xl shadow-primary-500/5 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15l-2 5L9 9l11 4-5 2z" /></svg>
              </div>
              <h2 className="text-4xl font-display font-bold text-white mb-8">Our Mission</h2>
              <div className="max-w-2xl mx-auto space-y-6">
                <p className="text-gray-400 text-base md:text-lg font-medium leading-relaxed">
                  At LAW ADVISOR, our mission is to make legal information accessible to all. We believe that understanding the law is the first step in exercising your rights and protecting your interests.
                </p>
                <p className="text-gray-400 text-base md:text-lg font-medium leading-relaxed">
                  By offering quick, reliable, and affordable access to legal information, we hope to empower individuals and contribute to a more informed society.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
