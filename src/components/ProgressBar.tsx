import React, { useEffect, useState, useRef } from 'react';

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => {
  const [isSticky, setIsSticky] = useState(false);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const scrollHandlerRef = useRef<() => void>();

  useEffect(() => {
    const handleScroll = () => {
      if (progressBarRef.current) {
        const rect = progressBarRef.current.getBoundingClientRect();
        if (rect.top <= 0 && !isSticky) {
          setIsSticky(true);
        } else if (rect.top > 0 && isSticky) {
          setIsSticky(false);
        }
      }
    };

    scrollHandlerRef.current = () => {
      requestAnimationFrame(handleScroll);
    };

    window.addEventListener('scroll', scrollHandlerRef.current);

    return () => {
      if (scrollHandlerRef.current) {
        window.removeEventListener('scroll', scrollHandlerRef.current);
      }
    };
  }, [isSticky]);

  return (
    <div
      className={`progress-bar-container ${isSticky ? 'sticky' : ''}`}
      ref={progressBarRef}
    >
      <div
        className="progress-bar"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
