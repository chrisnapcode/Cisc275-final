import React from 'react';



const ProgressBar = ({ progress }: { progress: number }) => { //the progress bar component to add to each page with styling
  return (
    <div style={{
      width: '100%',
      backgroundColor: '#e0e0e0',
      borderRadius: '8px',
      overflow: 'hidden',
      height: '24px',
      margin: '20px 0'
    }}>
      <div style={{
        width: `${progress}%`,
        backgroundColor: '#4caf50',
        height: '100%',
        transition: 'width 0.3s ease-in-out'
      }} />
    </div>
  );
};

export default ProgressBar;