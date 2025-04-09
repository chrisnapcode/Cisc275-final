import React from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage'; 
import BasicQuestion from './components/BasicQuestion';
import AdvancedQuestion from './components/AdvancedQuestions';

function App(){
  return (
    <div>
      {/* Route handling */}
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/basic-question" element={<BasicQuestion />} />
      <Route path="/advanced-question" element={<AdvancedQuestion />} />

      </Routes>
    </div>
  );
}

export default App;
