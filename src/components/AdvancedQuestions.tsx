import React from 'react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';

function AdvancedQuestions() {
  const [progress, setProgress] = useState<number>(0);
  const [showPopup, setShowPopup] = useState<boolean>(false);


  useEffect(() => {
    setShowPopup(true); 
  }, []);

  const incrementProgress = () => {
    setProgress((prev: number) => Math.min(prev + 10, 100));
  
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  };
  
  const popupStyle: React.CSSProperties = {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    textAlign: "center"
  };
  

  return (
    <div>
      {showPopup && (
        <div style={overlayStyle}>
          <div style={popupStyle}>
            <h2>Welcome to the Advanced Questions!</h2>
            <p>Lets get started 🚀</p>
            <button onClick={handleClosePopup}>Continue</button>
          </div>
        </div>
      )}
      <h1>This is the Advanced Question Page</h1>
      <ProgressBar progress={progress} />
      <button onClick={incrementProgress}>Add Progress</button>
      <br />
      <Link to="/">Back to Home</Link>
    </div>
  );
}


export default AdvancedQuestions;
