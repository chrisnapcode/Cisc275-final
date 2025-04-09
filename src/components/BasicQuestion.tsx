import React from 'react';
import { Link } from 'react-router-dom';
import QuestionCard from './QuestionCard';

import { Question }  from './QuestionCard';

const questions: Question[] = [
  { id: "q1", text: "I enjoy working independently without close supervision." },
  { id: "q2", text: "I prefer structured tasks over open-ended challenges." },
  { id: "q3", text: "I am comfortable making decisions under pressure." },
  { id: "q4", text: "I enjoy helping others solve their problems." },
  { id: "q5", text: "I like working with data, numbers, or analytics." },
  { id: "q6", text: "I am interested in creative tasks like writing, designing, or inventing."},
  { id: "q7", text: "I would enjoy leading a team or taking on a leadership role." },
];

function BasicQuestion() {
  return (
    <div>
      <h1>This is the Basic Question Page</h1>
      <div className="container mt-4">
        {questions.map((q: Question) => (
          <QuestionCard key={q.id} question={q} />
        ))}
      </div>
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default BasicQuestion;
