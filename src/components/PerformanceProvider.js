import { useEffect, createContext, useContext, useState } from 'react';
import { optimizeForDevice, preloadCriticalResources } from '../utils/performance';

const PerformanceContext = createContext();

export const usePerformance = () => useContext(PerformanceContext);

const PerformanceProvider = ({ children }) => {
  const [performanceLevel, setPerformanceLevel] = useState('medium');

  useEffect(() => {
    // Only run browser-specific optimizations on the client
    if (typeof window === 'undefined') return;

    // Initialize performance optimizations
    try {
      optimizeForDevice();
      preloadCriticalResources();
    } catch (e) {
      // non-fatal: keep running even if optimizers fail
      // console.debug('Performance utils failed', e)
    }

    // Add performance classes to body
    const level = window.PERFORMANCE_LEVEL || 'medium';
    setPerformanceLevel(level);
    document.body.classList.add(`${level}-performance`);

    // Optimize for 60fps
    const style = document.createElement('style');
    style.setAttribute('data-generated-by', 'performance-provider');
    style.textContent = `
      * { 
        transform: translateZ(0);
      }
      .animate-on-scroll {
        will-change: transform, opacity;
      }
    `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) document.head.removeChild(style);
      try {
        document.body.classList.remove(`${level}-performance`);
      } catch (e) {}
    };
  }, []);

  return (
    <PerformanceContext.Provider value={{ performanceLevel }}>
      {children}
    </PerformanceContext.Provider>
  );
};

export default PerformanceProvider;