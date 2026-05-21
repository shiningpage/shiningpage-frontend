import React, { useEffect, useState, useRef } from 'react';

const ScrollAnimation = ({ children, delay = 0, animateIn, animateOut, animateOnce = true }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (animateOnce) observer.unobserve(entry.target);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) observer.observe(elementRef.current);

    return () => {
      if (elementRef.current) observer.unobserve(elementRef.current);
    };
  }, [animateOnce]);

  return (
    <div
      ref={elementRef}
      style={{
        animationDelay: `${delay}ms`,
      }}
      className={`hidden ${isVisible ? animateIn : animateOut || ''}`}
    >
      {children}
    </div>
  );
};

export default ScrollAnimation;
