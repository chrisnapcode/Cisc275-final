import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOpenAI } from '../contexts/OpenAIContext';
import axios from 'axios';
import QuestionCard, { Question } from './QuestionCard';
import { Button } from 'react-bootstrap';
import ProgressBar from './ProgressBar';

interface ChatCompletionResponse {
  choices: { message: { content: string } }[];
}
//list of beautiful questions 
const questions: Question[] = [
  { id: "q1", text: "I enjoy working independently without close supervision.", answered: false },
  { id: "q2", text: "I prefer structured tasks over open-ended challenges.", answered: false },
  { id: "q3", text: "I am comfortable making decisions under pressure.", answered: false },
  { id: "q4", text: "I enjoy helping others solve their problems.", answered: false },
  { id: "q5", text: "I like working with data, numbers, or analytics.", answered: false },
  { id: "q6", text: "I am interested in creative tasks like writing, designing, or inventing.", answered: false },
  { id: "q7", text: "I would enjoy leading a team or taking on a leadership role.", answered: false },
];

export default function BasicQuestion(): React.JSX.Element {
  const [progress, setProgress] = useState<number>(0);//set the progress bar's state
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { apiKey } = useOpenAI();
  const navigate = useNavigate();

  const incrementProgress = (questionId: string, answered: boolean) => { //set the progress bar to question length
    setProgress(prev =>
      Math.min(
        Math.max(prev + (answered ? 1 : -1) * (100 / questions.length), 0),
        100
      )
    );
    if (!showPopup && progress + (answered ? 1 : -1) * (100 / questions.length) >= 100) {
      setShowPopup(true);
    }
  };

  const handleResponseChange = (qid: string, val: string) => {
    setResponses(prev => ({ ...prev, [qid]: val }));
  };

  const submitAssessment = async () => {
    if (!apiKey) {
      alert('Missing API key—go back home and enter it.');
      return;
    }
    setSubmitting(true);

    // New instruction: career-focused, actionable, easy to read
    const instruction =
      'You are a career coach. Based on the self-assessment results below (1 = strongly disagree, 5 = strongly agree), ' +
      'provide clear, actionable career advice tailored to the individual. ' +
      'Organize your response under headings and use bullet points for specific steps or tips, making it easy to read and implement.' + 'focus on actual career paths, not just general advice.';

    // Build prompt
    const prompt = [
      instruction,
      ...questions.map(q => `Q: ${q.text}\nA: ${responses[q.id]}`)
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
      navigate('/feedback', { state: { chatResponse, responses, questions, cameFromBasic: true } });
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      navigate('/feedback', { state: { chatResponse: 'Error calling OpenAI.', responses, questions, cameFromBasic: true } });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {showPopup && (
        <div style={{
            position:'fixed', top:0, left:0, width:'100vw', height:'100vh',
            background:'rgba(0,0,0,0.6)', display:'flex',
            justifyContent:'center', alignItems:'center', zIndex:1000
          }}>
          <div style={{
              background:'#fff', padding:'2rem', borderRadius:10,
              boxShadow:'0 4px 12px rgba(0,0,0,0.2)', textAlign:'center'
            }}>
            <h2>Quiz complete! 🚀</h2>
            <p>Submit your answers?</p>
            <Button onClick={submitAssessment} disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit'}
            </Button>{' '}
            <Button variant="secondary" onClick={() => { setShowPopup(false); }}>
              Change Answers
            </Button>
          </div>
        </div>
      )}

      <h1>Basic Self-Assessment</h1>
      <ProgressBar progress={progress} />

      <div className="container mt-4">
        {questions.map(q => (
          <QuestionCard
            key={q.id}
            question={q}
            onAnswered={incrementProgress}
            onResponse={val => { handleResponseChange(q.id, val); }}
          />
        ))}
      </div>

      <div className="d-flex justify-content-center mt-4">
        <Button
          variant="success"
          onClick={submitAssessment}
          disabled={submitting || progress < 90}
        >
          {submitting ? 'Submitting…' : 'Submit Assessment'}
        </Button>
      </div>
    </div>
  );
}
