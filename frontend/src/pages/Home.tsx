import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from '../components/Hero';
import Trust from '../components/Trust';
import ServicesHome from '../components/ServicesHome';
import Specialization from '../components/Specialization';
import DatasetsPreview from '../components/DatasetsPreview';
import CTAHome from '../components/CTAHome';
import SplashScreen from '../components/SplashScreen';

const Home = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <Helmet>
        <title>nyansa | The Hub for African Language AI & Agri-Tech Datasets</title>
        <meta name="description" content="Scale your AI with ground-truth data in African dialects. We specialize in high-precision linguistic and agricultural datasets for inclusive technology solutions." />
        <meta property="og:title" content="nyansa | African Language AI & Agri-Tech Data" />
        <meta property="og:description" content="High-quality datasets for African dialects and precision agriculture." />
        <meta property="og:type" content="website" />
      </Helmet>
      
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      
      <Hero />
      {/* <Trust /> */}
      <ServicesHome />
      <Specialization />
      <DatasetsPreview />
      <CTAHome />
    </>
  );
};

export default Home;
