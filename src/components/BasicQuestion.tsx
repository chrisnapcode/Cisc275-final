import React from 'react';
import { Link } from 'react-router-dom';
import QuestionCard from './QuestionCard';
import { useState } from 'react';
import ProgressBar from './ProgressBar';
import { Question }  from './QuestionCard';

const questions: Question[] = [
  { id: "q1", text: "I enjoy working independently without close supervision.", answered: false},
  { id: "q2", text: "I prefer structured tasks over open-ended challenges." , answered: false},
  { id: "q3", text: "I am comfortable making decisions under pressure.", answered: false },
  { id: "q4", text: "I enjoy helping others solve their problems.", answered: false },
  { id: "q5", text: "I like working with data, numbers, or analytics.", answered: false },
  { id: "q6", text: "I am interested in creative tasks like writing, designing, or inventing.", answered: false},
  { id: "q7", text: "I would enjoy leading a team or taking on a leadership role.", answered: false },
];

function BasicQuestion() {
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
      <h1>This is the Basic Question Page</h1>
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

export default BasicQuestion;

