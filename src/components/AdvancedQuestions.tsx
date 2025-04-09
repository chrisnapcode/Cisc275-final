import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import ProgressBar from './ProgressBar';

import QuestionCard from './QuestionCard';
import { Question } from './QuestionCard';

const questions: Question[] = [
  { id: "q1", text: "I feel energized when I solve complex problems.", answered: false },
  { id: "q2", text: "I value job security and long-term stability over variety or excitement.", answered: false },
  { id: "q3", text: "I enjoy collaborating with others more than working alone.", answered: false },
  { id: "q4", text: "I am interested in how things work mechanically or technically.", answered: false },
  { id: "q5", text: "I prefer hands-on work over sitting at a desk.", answered: false },
  { id: "q6", text: "I enjoy learning new skills, even outside of my comfort zone.", answered: false },
  { id: "q7", text: "I would enjoy a fast-paced environment with frequent changes and challenges.", answered: false },
];

function AdvancedQuestions() {
  const [progress, setProgress] = useState<number>(0);
  
  const incrementProgress = (questionId: string, answered: boolean) => {
    if (answered) {
      setProgress((prev: number) => Math.min(Math.max(prev + ((1/ questions.length) * 100), 0), 100));
    } else {
      setProgress((prev: number) => Math.min(Math.max(prev - ((1/ questions.length) * 100), 0), 100));
    }
  };

  return (
    <div>
      <h1>This is the Advanaced Question Page</h1>
      <ProgressBar progress={progress} />
      <div className="container mt-4">
        {questions.map((q: Question) => (
          <QuestionCard key={q.id} question={q} onAnswered={incrementProgress} />
        ))}
      </div>
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default AdvancedQuestions;
