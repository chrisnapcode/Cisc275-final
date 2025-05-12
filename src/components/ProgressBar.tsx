import React, { useEffect, useState, useRef } from 'react';

const ProgressBar = ({ progress }: { progress: number }) => {
  const [isSticky, setIsSticky] = useState(false);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const scrollHandlerRef = useRef<() => void>();

  useEffect(() => {
    const handleScroll = () => {
      if (progressBarRef.current) {
        const rect = progressBarRef.current.getBoundingClientRect();
        // Only update the state if the progress bar position has changed
        if (rect.top <= 0 && !isSticky) {
          setIsSticky(true);
        } else if (rect.top > 0 && isSticky) {
          setIsSticky(false);
        }
      }
    };

    // Throttle scroll events with requestAnimationFrame
    scrollHandlerRef.current = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', scrollHandlerRef.current);

    return () => {
      if (scrollHandlerRef.current) {
        window.removeEventListener('scroll', scrollHandlerRef.current);
      }
    };
  }, [isSticky]); // Dependency array ensures it updates only when necessary

  return (
    <div
      className={`progress-bar-container ${isSticky ? 'sticky' : ''}`}
      ref={progressBarRef}
    >
      <div
        className="progress-bar"
        style={{
          width: `${progress}%`,  // Dynamically adjust width based on progress
        }}
      />
    </div>
  );
};

export default ProgressBar;
