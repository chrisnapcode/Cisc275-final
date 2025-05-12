import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { useOpenAI } from '../contexts/OpenAIContext';
import type { Question } from '../components/QuestionCard';
import { auth, db } from "../firebase";
import { ref, set, get } from "firebase/database";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
/*import { content } from 'html2canvas/dist/types/css/property-descriptors/content';*/

type State = {
  chatResponse?: string;
  answers?: Record<string, string>;
  questions?: Question[];
  cameFromAdvanced?: boolean;
};

export default function AdvancedFeedbackPage() {
  const { apiKey } = useOpenAI();
  const location = useLocation();
  const {
    chatResponse = 'No feedback available.',
    answers = {},
    questions = [],
    cameFromAdvanced = false,
  } = (location.state ?? {}) as State;

  const [followUp, setFollowUp] = useState<string>('');
  const [followUpResponse, setFollowUpResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [loadedQuestions, setQuestions] = useState<Question[]>(questions);
  const [loadedAnswers, setAnswers] = useState<Record<string, string>>(answers);
  const [loadedChatResponse, setChatResponse] = useState<string>(chatResponse);

  const contentRef = useRef<HTMLDivElement>(null); // for PDF export

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) return;

    if (cameFromAdvanced) {
      const questionsRef = ref(db, `advancedFeedback/questions/${user.uid}`);
      set(questionsRef, {
        questions: questions.map(q => ({
          id: q.id,
          text: q.text,
          answer: answers[q.id],
        })),
      }).catch(err => {
        console.error("Failed to save questions:", err);
      });

      if (!chatResponse || chatResponse === "No feedback available.") return;

      const feedbackRef = ref(db, `advancedFeedback/feedback/${user.uid}`);
      set(feedbackRef, {
        feedback: chatResponse,
      }).catch(err => {
        console.error("Failed to save AI feedback:", err);
      });
    } else {
      const questionsRef = ref(db, `advancedFeedback/questions/${user.uid}`);
      get(questionsRef)
        .then(snapshot => {
          if (snapshot.exists()) {
            const data = snapshot.val() as {
              questions: { id: string; text: string; answer: string }[];
            };

            const qList = data.questions.map(q => ({
              id: q.id,
              text: q.text,
              answered: false,
            }));

            const aMap: Record<string, string> = {};
            data.questions.forEach(q => {
              aMap[q.id] = q.answer;
            });

            setQuestions(qList);
            setAnswers(aMap);
          }
        })
        .catch(error => {
          console.error("Error fetching questions:", error);
        });

      const feedbackRef = ref(db, `advancedFeedback/feedback/${user.uid}`);
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
  }, [cameFromAdvanced, chatResponse, questions, answers]);

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
        loadedChatResponse
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

  // PDF Export Handler
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

    // First page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('advanced-feedback.pdf');
  };

  return (
    <div className="container mt-4">
      <div ref={contentRef}>
        <h2>Your Customized Advanced Feedback</h2>

        {loadedQuestions.length > 0 ? (
          <>
            <h3>Your Answers:</h3>
            <ul>
              {loadedQuestions.map(q => (
                <li key={q.id}>
                  <strong>{q.text}</strong>: {loadedAnswers[q.id]}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>No answers to display.</p>
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
          <button
            className="btn btn-primary mt-2"
            onClick={handleFollowUp}
            disabled={loading || !followUp.trim()}
          >
            {loading ? 'Asking…' : 'Ask'}
          </button>
        </div>
      <div className="mt-4">
          <button className="btn btn-success me-2" onClick={handleDownloadPDF}>
            Save as PDF
          </button>
          <Link to="/" className="btn btn-link mt-2">
            ← Back to Home
          </Link>
        </div>
    </div>
  );
}