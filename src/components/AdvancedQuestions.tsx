import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import ProgressBar from './ProgressBar';

function AdvancedQuestions() {
  const [progress, setProgress] = useState<number>(0);
  
  const incrementProgress = () => {
    setProgress((prev: number) => Math.min(prev + 10, 100));
  
  };
  return (
    <div>
      <h1>This is the Advanaced Question Page</h1>
      <ProgressBar progress={progress} />
      <button onClick={incrementProgress}>Add Progress</button>
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default AdvancedQuestions;
