import React, { useState, useRef } from 'react';
//import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import ProgressBar from './ProgressBar';
import { useOpenAI } from '../contexts/OpenAIContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdvancedQuestionCard from './advancedQuestionCard';
import { Question } from './QuestionCard';
import { auth } from '../firebase';
import { ref, get } from 'firebase/database';
import { db } from '../firebase';
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

interface UserProfile {
  age: string;
  hasCollegeDegree: boolean;
  collegeDegree: string;
  softSkills: string;
  experience: string;
  interests: string;
}

function AdvancedQuestions(): React.JSX.Element {
  const [progress, setProgress] = useState<number>(0); // tracks the user's info
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
    const user = auth.currentUser;
    let profileDataText = '';
    if (user) {
      const userId = user.uid;
      const userRef = ref(db, `moreUserInfo/${userId}`); // Fetch user data from the database
      const snapshot = await get(userRef);
      if (snapshot.exists()) { // If user has a form, get the data and fill out the form with it
        const data = snapshot.val() as UserProfile;
    
        profileDataText = `
    User Profile:
    - Age: ${data.age}
    - Has College Degree: ${data.hasCollegeDegree ? 'Yes' : 'No'}
    - Degree: ${data.collegeDegree}
    - Soft Skills: ${data.softSkills}
    - Experience: ${data.experience}
    - Interests: ${data.interests}
        `.trim(); //setting the profile data text
      }
    }
    const prompt = [
      instruction,
      profileDataText,
      '',
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
      navigate('/advanced-feedback', {
        state: {
          chatResponse,
          answers,
          questions,
          cameFromAdvanced: true
        }
      });
          } catch (error) {
      console.error('Error calling OpenAI:', error);
      navigate('/advanced-feedback', { state: { chatResponse: 'Error calling OpenAI.', answers, questions } });
    } finally {
      setSubmitting(false);
    }
  };
  
  //styling and positioning
  
  return (
    <div>
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
</Button>
    </div>
    
  );
}


export default AdvancedQuestions;
