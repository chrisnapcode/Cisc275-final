import React, { useState } from 'react';
import './App.css';
import { Button, Form } from 'react-bootstrap';

import basic from './basic-assessment.jpg'
import detailed from './detailed-assessment.jpg'

//local storage and API Key: key should be entered in by the user and will be stored in local storage (NOT session storage)
let keyData: string = "";
const saveKeyData = "MYKEY";
const prevKey = localStorage.getItem(saveKeyData); //so it'll look like: MYKEY: <api_key_value here> in the local storage when you inspect
if (prevKey !== null) {
  keyData = JSON.parse(prevKey) as string;
}

function App() {
  const [key, setKey] = useState<string>(keyData); //for api key input
  
  //sets the local storage item to the api key the user inputed
  function handleSubmit() {
    localStorage.setItem(saveKeyData, JSON.stringify(key));
    window.location.reload(); //when making a mistake and changing the key again, I found that I have to reload the whole site before openai refreshes what it has stores for the local storage variable
  }

  //whenever there's a change it'll store the api key in a local state called key but it won't be set in the local storage until the user clicks the submit button
  function changeKey(event: React.ChangeEvent<HTMLInputElement>) {
    setKey(event.target.value);
  }
  return (
    <div className="App">
      <header className="App-header">
        <button className="btn btn-primary btn-sm">
          Home Page
        </button>
      </header>
      <div className="home-title">
        Career Finder
      </div>
      <div>
        Click either of the below images for different complexities of career assessment
      </div>

      <div className='assess_buttons'>
        <div>
          <Button>
            <img className='basic_assess' src={basic}/>
          </Button>
          <div>
            A basic career assessment surveys some surface level information to create a preliminary decision on the ideal career path for you.
          </div>
        </div>
    
        <div>
          <Button>
            <img className='detailed_assess' src={detailed}/>
          </Button>
          <div>
            A detailed career assessment that uses top of the line technology to find precisely your next career path.
          </div>
        </div>
      </div>

      <div className="api-box">
        <Form>
          <Form.Label>API Key:</Form.Label>
          <Form.Control type="password" placeholder="Insert API Key Here" onChange={changeKey}></Form.Control>
          <br></br>
          <Button className="Submit-Button" onClick={handleSubmit}>Submit</Button>
        </Form>
      </div>
    </div>
  );
}

export default App;
