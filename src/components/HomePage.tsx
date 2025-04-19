import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';
import basic from '../basic-assessment.jpg';
import detailed from '../detailed-assessment.jpg';
import ChatGPTBox from './Chatgptbox';



function HomePage() {
  const [key, setKey] = useState<string>(localStorage.getItem("MYKEY") ?? "");
  const [chatResponse, setChatResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  /*const handleSubmit = () => {`
    localStorage.setItem("MYKEY", JSON.stringify(key));
    window.location.reload();
  };
  */
  const changeKey = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKey(event.target.value);
  };

  const handleChatGPTCall = async () => {
    if (!key) {
      alert('Please enter your API key.');
      return;
    }
  
    setLoading(true);
    setChatResponse('');
  
    try {
      const res = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: 'Say hello in a fun way!' }],
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

  return (
    <div className="App">

      <div className="home-title">Career Finder</div>
      <div>Select your assessment:</div>

      <div className="assess_buttons">
        <div>
          <Link to="/basic-question">
            <Button>
              <img className="basic_assess" src={basic} alt="Basic Assessment" />
            </Button>
          </Link>
          <div>A basic career assessment...</div>
        </div>

        <div>
        <Link to="/advanced-question">
          <Button>
            <img className="detailed_assess" src={detailed} alt="Detailed Assessment" />
          </Button>
          </Link>

          <div>A detailed career assessment...</div>
        </div>
        
      </div>
        
      <div className="api-box">
      <ChatGPTBox />
        <Form>
          <Form.Label>API Key:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Insert API Key Here"
            onChange={changeKey}
            value={key}
          />
          <br />
          <Button className="Submit-Button" onClick={handleChatGPTCall}>
          {loading ? 'Talking to GPT...' : 'Chat with GPT'}
          </Button>
          {chatResponse && (
          <div style={{ marginTop: '1rem', backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '5px' }}>
            <strong>ChatGPT Says:</strong>
              <p>{chatResponse}</p>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
}

export default HomePage;
