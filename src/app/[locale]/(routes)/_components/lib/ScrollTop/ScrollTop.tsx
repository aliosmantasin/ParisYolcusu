"use client"

import React, { ReactNode } from 'react';
import { useState, useEffect } from 'react';

interface ScrollTopProps {
  children: ReactNode;
}

const ScrollTop: React.FC<ScrollTopProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 100) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      onClick={handleClick}
      className={`fixed bottom-20 right-4 z-50 cursor-pointer p-3 rounded-full shadow-md transition-opacity duration-300 bg-primary scrollTopColor ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      role="button"
      aria-label="Scroll to top"
    >
      {children}
    </div>
  );
};

export default ScrollTop;
