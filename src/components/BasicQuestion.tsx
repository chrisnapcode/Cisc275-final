import React from 'react';
import { Link } from 'react-router-dom';
import QuestionCard from './QuestionCard';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
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
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const showNotification = () => {
    setShowPopup(true);
  }
  
  const incrementProgress = (questionId: string, answered: boolean) => {
    if (answered) {
      const newProgress = Math.min(Math.max(progress + ((1/ questions.length) * 100), 0), 100);
      setProgress(() => newProgress);
      console.log(newProgress)
      if (newProgress > 99) {
        showNotification()
      }
    } else {
      setProgress((prev: number) => Math.min(Math.max(prev - ((1/ questions.length) * 100), 0), 100));
    }
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
            <h2>You have completed the quiz! 🚀</h2>
            <p>Would you like to submit?</p>
            <Link to="/">
              <Button variant="primary">Submit</Button>
            </Link>
            <button onClick={handleClosePopup}>Change Answers</button>
        </div>
      </div>
      )}
      <h1>This is the Basic Question Page</h1>
      <ProgressBar progress={progress} />
      <div className="container mt-4">
        {questions.map((q: Question) => (
          <QuestionCard key={q.id} question={q} onAnswered={incrementProgress} />
        ))}
      </div>
      <Link to="/">
        <Button variant="primary">Submit</Button>
      </Link>
    </div>
  );
}

export default BasicQuestion;

