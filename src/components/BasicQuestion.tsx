import React from 'react';
import { Link } from 'react-router-dom';

function BasicQuestion() {
  return (
    <div>
      <h1>This is the Basic Question Page</h1>
      <Link to="/">Back to Home</Link>
    </div>
  );
}

export default BasicQuestion;
