import React, { useState, useRef, useEffect } from 'react';
//import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import ProgressBar from './ProgressBar';
import { useOpenAI } from '../contexts/OpenAIContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdvancedQuestionCard from './advancedQuestionCard';
import { Question } from './QuestionCard';

//These are the introspective, crazy, wonderful, beautiful questions that are like personality interviews.
interface ChatCompletionResponse {
  choices: { message: { content: string } }[];
}

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
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { apiKey } = useOpenAI();
  const navigate = useNavigate();

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
  const submitAssessment = async () => {

    if (!apiKey) {
      alert('Missing API key—go back home and enter it.');
      return;
    }
    setSubmitting(true);

    // New instruction: career-focused, actionable, easy to read
    const instruction =
      'You are a career coach. Based on the self-assessment results below, ' +
      'provide clear, actionable career advice tailored to the individual. ' +
      'Organize your response under headings and use bullet points for specific steps or tips, making it easy to read and implement.' + 'focus on actual career paths, not just general advice.';

    // Build prompt
    const prompt = [
      instruction,
      ...questions.map(q => `Q: ${q.text}\nA: ${answers[q.id]}`)
    ].join('\n\n');

    try {
      const res = await axios.post<ChatCompletionResponse>(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
        },
        { headers: { Authorization: `Bearer ${apiKey}` } }
      );
      const chatResponse = res.data.choices[0].message.content;
      console.log('Chat response:', answers);
      navigate('/advanced-feedback', { state: { chatResponse, answers, questions } });
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      navigate('/advanced-feedback', { state: { chatResponse: 'Error calling OpenAI.', answers, questions } });
    } finally {
      setSubmitting(false);
    }
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
              <Button variant="primary"           onClick={submitAssessment}
              >Submit</Button>
            <button onClick={handleClosePopup}>Change Answers</button>
        </div>
      </div>
      )}
      <h1>Advanced Self-Assessment</h1>
      <ProgressBar progress={progress} />
      <div className="container mt-4">
        {questions.map((q: Question) => (
          <AdvancedQuestionCard key={q.id} question={q} onAnswered={incrementProgress} />
        ))}
      </div>
        <Button  variant="success"
          onClick={submitAssessment}
          disabled={submitting || progress < 90}
        >
          {submitting ? 'Submitting…' : 'Submit Assessment'}
Submit</Button>
    </div>
    
  );
}


export default AdvancedQuestions;
