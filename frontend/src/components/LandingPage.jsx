
import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import BuiltFor from './BuiltFor';
import FeatureExplorer from './FeatureExplorer';
import Footer from './Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-mesh font-sans overflow-x-hidden selection:bg-primary-500/30 selection:text-black">
      <Navbar />
      <Hero />
      <About />
      <BuiltFor />
      <FeatureExplorer />
      <Footer />
    </div>
  );
};

export default LandingPage;
