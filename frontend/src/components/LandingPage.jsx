
import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Capabilities from './Capabilities';
import BuiltFor from './BuiltFor';
import FeatureExplorer from './FeatureExplorer';
import Footer from './Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-mesh font-sans overflow-x-hidden selection:bg-primary-500/30 selection:text-black">
      <Navbar />
      <Hero />
      <Capabilities />
      <BuiltFor />
      <FeatureExplorer />
      <Footer />
    </div>
  );
};

export default LandingPage;
