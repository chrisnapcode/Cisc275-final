import React from 'react';
import { Link } from 'react-router-dom';
import QuestionCard from './QuestionCard';

import { Question }  from './QuestionCard';

const questions: Question[] = [
  { id: "q1", text: "I feel energized when I solve complex problems." },
  { id: "q2", text: "I value job security and long-term stability over variety or excitement." },
  { id: "q3", text: "I enjoy collaborating with others more than working alone." },
  { id: "q4", text: "I am interested in how things work mechanically or technically." },
  { id: "q5", text: "I prefer hands-on work over sitting at a desk." },
  { id: "q6", text: "I enjoy learning new skills, even outside of my comfort zone."},
  { id: "q7", text: "I would enjoy a fast-paced environment with frequent changes and challenges." },
];

function AdvancedQuestions() {
  return (
    <div>
      <h1>This is the Advanced Question Page</h1>
      <div className="container mt-4">
        {questions.map((q: Question) => (
          <QuestionCard key={q.id} question={q} />
        ))}
      </div>
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default AdvancedQuestions;
