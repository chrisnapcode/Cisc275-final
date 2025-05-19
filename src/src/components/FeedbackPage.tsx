import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { useOpenAI } from '../contexts/OpenAIContext';
import type { Question } from '../components/QuestionCard';
import { Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { ref, set, get } from "firebase/database";
import { auth, db } from "../firebase";

type State = {
  chatResponse?: string;
  responses?: Record<string, string>;
  questions?: Question[];
  cameFromBasic?: boolean;
};

export default function FeedbackPage(): React.JSX.Element {
  const { apiKey } = useOpenAI();
  const location = useLocation();
  const {
    chatResponse = 'No feedback available.',
    responses = {},
    questions = [],
    cameFromBasic = false,
  } = (location.state ?? {}) as State;

  const [followUp, setFollowUp] = useState<string>('');
  const [followUpResponse, setFollowUpResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadedQuestions, setQuestions] = useState<Question[]>(questions);
  const [loadedAnswers, setAnswers] = useState<Record<string, string>>(responses);
  const [loadedChatResponse, setChatResponse] = useState<string>(chatResponse);

  const contentRef = useRef<HTMLDivElement>(null);

  const scaleLabels: Record<string, string> = {
    '1': 'strongly disagree',
    '2': 'disagree',
    '3': 'neutral',
    '4': 'agree',
    '5': 'strongly agree',
  };
  if (cameFromBasic) {
    alert("Your answers have been processed");
  }

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
    
    const questionsRef = ref(db, `basicFeedback/questions/${user.uid}`);
    const feedbackRef = ref(db, `basicFeedback/feedback/${user.uid}`);
    //checks if the user came from the basic questions page
    //if the user came from the basic questions page, it will save the questions and feedback to the database
    //if the user did not come from the basic questions page, it will fetch the questions and feedback from the database

    if (cameFromBasic) {
      set(questionsRef, {
        questions: questions.map(q => ({
          id: q.id,
          text: q.text,
          responses: responses[q.id],
        })),
      }).catch(err => {
        console.error("Failed to save questions:", err);
      });

      if (chatResponse && chatResponse !== "No feedback available.") {
        set(feedbackRef, { feedback: chatResponse }).catch(err => {
          console.error("Failed to save AI feedback:", err);
        });
      }
    } else {
      const questionsRef = ref(db, `basicFeedback/questions/${user.uid}`);
      const feedbackRef = ref(db, `basicFeedback/feedback/${user.uid}`);
  
  
    
      get(questionsRef)
        .then(snapshot => {
          if (snapshot.exists()) {
            const data = snapshot.val() as {
              questions: { id: string; text: string; responses: string }[];
            };

            const qList = data.questions.map(q => ({
              id: q.id,
              text: q.text,
              answered: false,
            }));

            const aMap: Record<string, string> = {};
            data.questions.forEach(q => {
              aMap[q.id] = q.responses;
            });

            setQuestions(qList);
            setAnswers(aMap);
          }
        })
        .catch(error => {
          console.error("Error fetching questions:", error);
        });

      get(feedbackRef)
        .then(snapshot => {
          if (snapshot.exists()) {
            setChatResponse(snapshot.val().feedback);
          }
        })
        .catch(error => {
          console.error("Error fetching feedback:", error);
        });
    }
  }}, [cameFromBasic, chatResponse, questions, responses]);

  const handleFollowUp = async () => {
    if (!apiKey) {
      alert('Missing API key—please enter it on the home screen.');
      return;
    }
    if (!followUp.trim()) return;

    setLoading(true);
    setFollowUpResponse('');

    try {
      const context = [
        'Self-assessment results:',
        ...loadedQuestions.map(q => `- ${q.text}: ${loadedAnswers[q.id]}`),
        '',
        'Initial AI feedback:',
        loadedChatResponse,
      ].join('\n');

      const messages = [
        { role: 'system', content: 'You are a career coach.' },
        { role: 'user', content: context },
        { role: 'user', content: followUp },
      ];

      const res = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        { model: 'gpt-3.5-turbo', messages },
        { headers: { Authorization: `Bearer ${apiKey}` } }
      );

      setFollowUpResponse(res.data.choices[0].message.content);
    } catch (err) {
      console.error(err);
      setFollowUpResponse('Error fetching follow-up advice.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;

    const canvas = await html2canvas(contentRef.current, {
      scale: 2,
      useCORS: true,
      scrollY: -window.scrollY,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('basic-feedback.pdf');
  };

  return (
    <div className="container mt-4">
      <div ref={contentRef}>
        <h2>Your Customized Feedback</h2>

        {loadedQuestions.length > 0 ? (
          <>
            <h3>Your Answers:</h3>
            <ul>
              {loadedQuestions.map(q => {
                const raw = loadedAnswers[q.id];
                const label = scaleLabels[raw];
                return (
                  <li key={q.id}>
                    <strong>{q.text}</strong>: {raw} ({label})
                  </li>
                );
              })}
            </ul>
          </>
        ) : (
          <p>No answers to display. Try clicking on the blank user profile picture if you are signed in and you are sure have answered the quiz.</p>
        )}

        <h3>AI Feedback:</h3>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{loadedChatResponse}</pre>

        {followUpResponse && (
          <div className="mt-3 p-3 border rounded bg-light">
            <h4>Follow-up Advice</h4>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{followUpResponse}</pre>
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3>Ask for more advice:</h3>
        <textarea
          className="form-control"
          rows={3}
          placeholder="Type a follow-up question here..."
          value={followUp}
          onChange={e => { setFollowUp(e.target.value); }}
          disabled={loading}
        />
        <Button
          className="mt-2"
          onClick={handleFollowUp}
          disabled={loading || !followUp.trim()}
        >
          {loading ? 'Asking…' : 'Ask'}
        </Button>
      </div>

      <div className="mt-4">
        <Button variant="success" onClick={handleDownloadPDF}>
          Save as PDF
        </Button>
      </div>

      <Link to="/" className="btn btn-link mt-3">
        ← Back to Home
      </Link>
    </div>
  );
}
