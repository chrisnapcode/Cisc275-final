import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import ProgressBar from './ProgressBar';

import AdvancedQuestionCard from './advancedQuestionCard';
import { Question } from './QuestionCard';

//These are the introspective, crazy, wonderful, beautiful questions that are like personality interviews.

const questions: Question[] = [
  { id: "q1", text: "Which type of task energizes you most: problem solving, creative design, hands on work or collaborating with people?", answered: false },
  { id: "q2", text: "Describe a project or achievement you are proud of and the main skills you used to complete it.", answered: false },
  { id: "q3", text: "Which subject or topic could you talk about passionately for hours without getting bored?", answered: false },
  { id: "q4", text: "Do you thrive more in a highly structured routine or in a dynamic environment with frequent changes, and why?", answered: false },
  { id: "q5", text: "When you join a team, what role do you naturally take on—leader, organizer, idea-generator, or supporter?", answered: false },
  { id: "q6", text: "What motivates you most at work: achieving tangible goals, helping others succeed, learning new things, or guiding a team?", answered: false },
  { id: "q7", text: "In your ideal job, what three activities would you spend most of your time doing?", answered: false },
];

function AdvancedQuestions() {
  const [progress, setProgress] = useState<number>(0); // tracks the user's info
  const [showPopup, setShowPopup] = useState<boolean>(false); // controls the popup
  
  const answeredSet = useRef<Set<string>>(new Set());
  const [answers, setAnswers] = useState<{ [id: string]: string }>({});
  
  const incrementProgress = (questionId: string, answered: boolean, newVal: string) => {
    // update the answered‐IDs set
    if (answered) {
      answeredSet.current.add(questionId);
    }
    else   {
      answeredSet.current.delete(questionId);
    }
    
    const newProgress = (answeredSet.current.size / questions.length) * 100; //set the progress bar to question length
    setProgress(newProgress);

    setAnswers(prev => ({ ...prev, [questionId]: newVal }));
  };


  const handleFinalSubmit = () => { 
    console.log("Submitting answers:", answers);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  //styling and positioning
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
  useEffect(() => {
    if (progress === 100) {
      setShowPopup(true);
    }
  }, [progress]);

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
      <h1>This is the Advanced Question Page</h1>
      <ProgressBar progress={progress} />
      <div className="container mt-4">
        {questions.map((q: Question) => (
          <AdvancedQuestionCard key={q.id} question={q} onAnswered={incrementProgress} />
        ))}
      </div>
      <Link to="/">
        <Button variant="primary" onClick={handleFinalSubmit}>Submit</Button>
      </Link>
    </div>
    
  );
}


export default AdvancedQuestions;
