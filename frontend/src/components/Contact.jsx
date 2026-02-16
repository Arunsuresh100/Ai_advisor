
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Contact = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ loading: false, success: false, error: null });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      setStatus({ loading: true, success: false, error: null });
      await axios.post('http://localhost:5000/api/messages', {
        fullName: user.name,
        email: user.email,
        subject: formData.subject,
        message: formData.message
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStatus({ loading: false, success: true, error: null });
      setFormData({ subject: '', message: '' });
      setTimeout(() => setStatus(prev => ({ ...prev, success: false })), 5000);
    } catch (err) {
      setStatus({ loading: false, success: false, error: 'Failed to send message. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] font-sans selection:bg-primary-500/30 selection:text-black">
      <Navbar />
      
      <main className="pt-32 pb-24">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm font-medium mb-12">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Home
          </Link>
          
          <div className="text-center">
            <div className="inline-block px-4 py-1.5 rounded-full border border-primary-500/30 text-primary-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              Contact Us
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 tracking-tight leading-tight">
              We'd Love to <span className="text-primary-500">Hear From You</span>
            </h1>
            <p className="text-gray-400 text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed">
              Have questions, feedback, or suggestions? Reach out to us and we'll get back to you as soon as possible.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-[#111111] p-8 md:p-12 rounded-[40px] border border-white/5 relative group hover:border-primary-500/20 transition-all duration-500 h-full">
                <div className="flex gap-6 items-center mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-500 shadow-xl shadow-primary-500/5">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Send a Message</h2>
                    <p className="text-gray-500 text-sm font-medium">Fill out the form below</p>
                  </div>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                  {status.success && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-2xl text-sm font-medium animate-fade-in text-center">
                      Message sent successfully! We'll get back to you soon.
                    </div>
                  )}
                  {status.error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-sm font-medium animate-fade-in text-center">
                      {status.error}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 text-left">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Name</label>
                      <input 
                        type="text" 
                        readOnly
                        value={user?.name || ''}
                        className="w-full bg-[#1a1a1a]/50 border border-white/5 rounded-2xl px-6 py-4 text-gray-500 text-sm focus:outline-none transition-all font-medium cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2 text-left">
                      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email</label>
                      <input 
                        type="email" 
                        readOnly
                        value={user?.email || ''}
                        className="w-full bg-[#1a1a1a]/50 border border-white/5 rounded-2xl px-6 py-4 text-gray-500 text-sm focus:outline-none transition-all font-medium cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Subject</label>
                    <input 
                      type="text" 
                      required
                      placeholder="What is this regarding?" 
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full bg-[#1a1a1a] border border-white/5 rounded-2xl px-6 py-4 text-white text-sm focus:outline-none focus:border-primary-500 transition-all font-medium placeholder:text-gray-600"
                    />
                  </div>

                  <div className="space-y-2 text-left">
                    <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest ml-1">Message</label>
                    <textarea 
                      rows="6" 
                      required
                      placeholder="Your message..." 
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-[#1a1a1a] border border-white/5 rounded-[24px] px-6 py-4 text-white text-sm focus:outline-none focus:border-primary-500 transition-all font-medium placeholder:text-gray-600 resize-none"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={!user || status.loading}
                    className={`w-full font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg text-sm flex items-center justify-center gap-2 ${
                      user 
                        ? 'bg-primary-600 hover:bg-primary-500 text-white shadow-primary-600/20 active:scale-[0.98]' 
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5'
                    }`}
                  >
                    {status.loading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      user ? 'Send Message' : 'Login to Send Message'
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Right Column: Info Cards */}
            <div className="lg:col-span-5 space-y-6 flex flex-col">
              {/* Get in Touch Card */}
              <div className="bg-[#111111] p-10 rounded-[40px] border border-white/5 group hover:border-primary-500/20 transition-all duration-500 flex-1">
                <h3 className="text-xl font-bold text-white mb-10 tracking-tight">Get in Touch</h3>
                <div className="space-y-8">
                  <div className="flex gap-5 items-start">
                    <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Email</div>
                      <div className="text-gray-300 font-medium text-sm md:text-base">support@gmail.com</div>
                    </div>
                  </div>

                  <div className="flex gap-5 items-start">
                    <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Location</div>
                      <div className="text-gray-300 font-medium text-sm md:text-base">Changanacherry, Kottayam</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Follow Us Card */}
              <div className="bg-[#111111] p-10 rounded-[40px] border border-white/5 group hover:border-primary-500/20 transition-all duration-500">
                <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Follow Us</h3>
                <p className="text-gray-500 text-xs font-medium leading-relaxed mb-8">
                  Stay connected with us on social media for updates, legal tips, and more.
                </p>
                <div className="flex gap-4">
                  {[
                    <svg key="x" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
                    <svg key="ln" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>,
                    <svg key="web" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
                    <svg key="yt" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  ].map((icon, sIdx) => (
                    <div 
                      key={sIdx} 
                      className="w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center text-gray-400 hover:bg-primary-500/10 hover:text-primary-500 transition-all border border-white/5 cursor-pointer hover:border-primary-500/30"
                    >
                      {icon}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
