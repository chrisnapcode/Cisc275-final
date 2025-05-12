import React, { useRef, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { useOpenAI } from '../contexts/OpenAIContext';
import type { Question } from '../components/QuestionCard';
import { Button } from 'react-bootstrap';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type State = {
  chatResponse?: string;
  responses?: Record<string, string>;
  questions?: Question[];
};

export default function FeedbackPage() {
  const { apiKey } = useOpenAI();
  const location = useLocation();
  const {
    chatResponse = 'No feedback available.',
    responses = {},
    questions = [],
  } = (location.state ?? {}) as State;

  const [followUp, setFollowUp] = useState<string>('');
  const [followUpResponse, setFollowUpResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const contentRef = useRef<HTMLDivElement>(null);

  const scaleLabels: Record<string, string> = {
    '1': 'strongly disagree',
    '2': 'disagree',
    '3': 'neutral',
    '4': 'agree',
    '5': 'strongly agree',
  };

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
        ...questions.map(q => `- ${q.text}: ${responses[q.id]}`),
        '',
        'Initial AI feedback:',
        chatResponse,
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

        {questions.length > 0 ? (
          <>
            <h3>Your Answers:</h3>
            <ul>
              {questions.map(q => {
                const raw = responses[q.id];
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
          <p>No answers to display.</p>
        )}

        <h3>AI Feedback:</h3>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{chatResponse}</pre>

        {followUpResponse && (
          <div className="mt-3 p-3 border rounded bg-light">
            <h4>Follow-up Advice</h4>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{followUpResponse}</pre>
          </div>
        )}
      </div>

      {/* Follow-up box */}
      <div className="mt-4">
        <h3>Ask for more advice:</h3>
        <textarea
          className="form-control"
          rows={3}
          placeholder="Type a follow-up question here..."
          value={followUp}
          onChange={e => {setFollowUp(e.target.value)}}
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

      {/* Export button */}
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