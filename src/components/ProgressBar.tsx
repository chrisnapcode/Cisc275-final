import React, { useEffect, useState, useRef } from 'react';

const ProgressBar = ({ progress }: { progress: number }) => {
  const [isSticky, setIsSticky] = useState(false);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (progressBarRef.current) {
        // Get the distance from the top of the page to the progress bar
        const rect = progressBarRef.current.getBoundingClientRect();
        if (rect.top <= 0) {
          setIsSticky(true);  // Make it sticky when it reaches the top
        } else {
          setIsSticky(false);  // Keep it absolute when it's not at the top
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={`progress-bar-container ${isSticky ? 'sticky' : ''}`}
      ref={progressBarRef}
    >
      <div
        className="progress-bar"
        style={{
          width: `${progress}%`, // Dynamically adjust width based on progress
        }}
      />
    </div>
  );
};

export default ProgressBar;