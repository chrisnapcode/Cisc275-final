import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import '../App.css';
import basic from '../basic-assessment.jpg';
import detailed from '../detailed-assessment.jpg';

function HomePage() {
  const [key, setKey] = useState<string>(localStorage.getItem("MYKEY") ?? "");

  const handleSubmit = () => {
    localStorage.setItem("MYKEY", JSON.stringify(key));
    window.location.reload();
  };

  const changeKey = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKey(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <button className="btn btn-primary btn-sm">Home Page</button>
      </header>

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
        <Form>
          <Form.Label>API Key:</Form.Label>
          <Form.Control
            type="password"
            placeholder="Insert API Key Here"
            onChange={changeKey}
            value={key}
          />
          <br />
          <Button className="Submit-Button" onClick={handleSubmit}>
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default HomePage;
