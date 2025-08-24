
import React, { useEffect, useRef } from 'react';

const StarryBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const starCount = 150;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'absolute bg-white rounded-full animate-twinkle';
      
      const size = Math.random() * 1.5 + 0.5;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.left = `${Math.random() * 100}vw`;
      star.style.top = `${Math.random() * 100}vh`;
      star.style.animationDuration = `${Math.random() * 3 + 2}s`;
      star.style.animationDelay = `${Math.random() * 5}s`;
      
      if (Math.random() > 0.7) {
        star.style.boxShadow = '0 0 4px rgba(255, 255, 255, 0.5)';
      }

      fragment.appendChild(star);
    }
    container.appendChild(fragment);

  }, []);

  return <div ref={containerRef} className="fixed top-0 left-0 w-full h-full -z-20" aria-hidden="true"></div>;
};

export default StarryBackground;
