import { useEffect, useState } from 'react';

// Returns current viewport width & boolean breakpoints for responsive logic
export function useViewport() {
  const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return {
    width,
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024,
  };
}
