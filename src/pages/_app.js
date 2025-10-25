import '../styles/globals.css'
import Head from 'next/head'
import { useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import Layout from '../components/Layout'
import MobilePerformanceOptimizer from '../components/MobilePerformanceOptimizer'
import CustomCursor from '../components/CustomCursor'

export default function App({ Component, pageProps, router }) {
  useEffect(() => {
    // Reveal animations on scroll
    const handleScroll = () => {
      const reveals = document.querySelectorAll('.reveal');
      
      reveals.forEach((reveal) => {
        const windowHeight = window.innerHeight;
        const revealTop = reveal.getBoundingClientRect().top;
        const revealPoint = 150;
        
        if (revealTop < windowHeight - revealPoint) {
          reveal.classList.add('active');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
      </Head>
      <CustomCursor />
      <AnimatePresence mode="wait">
        <MobilePerformanceOptimizer />
        <Layout>
          <Component {...pageProps} key={router.route} />
        </Layout>
      </AnimatePresence>
    </>
  )
}