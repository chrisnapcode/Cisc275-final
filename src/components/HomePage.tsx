import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import basic from '../basic-assessment.jpg';
import detailed from '../detailed-assessment.jpg';
import './HomePage.css';
import { useOpenAI } from '../contexts/OpenAIContext';

function HomePage() {
  const { apiKey: key, setApiKey: changeKey } = useOpenAI();
  const [chatResponse, setChatResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isKeyValid, setIsKeyValid] = useState<boolean>(false);
  const navigate = useNavigate();

  const validateKey = async (newKey: string): Promise<void> => {
    if (!newKey.trim()) {
      setIsKeyValid(false);
      return;
    }

    try {
      const res = await axios.get('https://api.openai.com/v1/models', {
        headers: {
          Authorization: `Bearer ${newKey}`,
        },
      });
      setIsKeyValid(res.status === 200);
    } catch {
      setIsKeyValid(false);
    }
  };

  const handleKeyChange = async (newKey: string) => {
    changeKey(newKey);
    validateKey(newKey); // silent check
  };

  const handleChatGPTCall = async () => {
    if (!key || !isKeyValid) {
      alert('Please enter a valid OpenAI API key first.');
      return;
    }

    setLoading(true);
    setChatResponse('');

    try {
      const res = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'Say hello' }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
          },
        }
      );

      setChatResponse(res.data.choices[0].message.content);
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      setChatResponse('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleAssessmentClick = (path: string) => {
    if (!key || !isKeyValid) {
      alert('Please enter a valid OpenAI API key first.');
      return;
    }
    navigate(path);
  };

  return (
    <div className="homepage-container"> {/* Wrap content with this class */}
      <div className="home-title">Career Finder</div>
      <div>Select your assessment:</div>

      <div className="assess_buttons">
        <div>
          <Button onClick={() => {handleAssessmentClick('/basic-question')}}>
            <img className="basic_assess" src={basic} alt="Basic Assessment" />
          </Button>
          <div>A basic career assessment...</div>
        </div>

        <div>
          <Button onClick={() => {handleAssessmentClick('/advanced-question')}}>
            <img className="detailed_assess" src={detailed} alt="Detailed Assessment" />
          </Button>
          <div>A detailed career assessment...</div>
        </div>
      </div>

      <div className="api-box">
        <Form>
          <Form.Label>API Key:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Insert API Key Here"
            value={key}
            onChange={e => {handleKeyChange(e.target.value)}}
          />
          <br />
          <Button
            className="Submit-Button"
            onClick={handleChatGPTCall}
            disabled={loading}
          >
            {loading ? 'Talking to GPT...' : 'Chat with GPT'}
          </Button>
        </Form>

        {chatResponse && (
          <div
            style={{
              marginTop: '1rem',
              backgroundColor: '#f4f4f4',
              padding: '10px',
              borderRadius: '5px',
            }}
          >
            <strong>ChatGPT Says:</strong>
            <p>{chatResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;