
import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import Services from './Services';
import Footer from './Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-mesh font-sans overflow-x-hidden selection:bg-primary-500/30 selection:text-white">
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Footer />
    </div>
  );
};

export default LandingPage;
