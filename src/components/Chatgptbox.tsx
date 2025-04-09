import React, { useState } from 'react';
import axios from 'axios';

const ChatGPTBox = () => {
  const [apiKey, setApiKey] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const callChatGPT = async () => {
    if (!apiKey) {
      alert('Enter your API key first!');
      return;
    }

    setLoading(true);
    setResponse('');

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
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      setResponse(res.data.choices[0].message.content);
    } catch (err) {
      console.error(err);
      setResponse('Error talking to GPT!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <input
        type="password"
        placeholder="Enter OpenAI API Key"
        value={apiKey}
        onChange={(e) => {setApiKey(e.target.value);}}
        style={{ width: '300px', marginBottom: '10px' }}
      />
      <br />
      <button onClick={callChatGPT} disabled={loading}>
        {loading ? 'Talking to GPT...' : 'Chat with GPT'}
      </button>
      <div style={{ marginTop: '15px', whiteSpace: 'pre-wrap' }}>{response}</div>
    </div>
  );
};

export default ChatGPTBox;
