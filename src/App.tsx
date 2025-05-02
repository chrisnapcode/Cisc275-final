import React from 'react';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './components/HomePage'; 
import BasicQuestion from './components/BasicQuestion';
import AdvancedQuestion from './components/AdvancedQuestions';
import FeedbackPage from './components/FeedbackPage';
import AdvancedFeedbackPage from './components/AdvancedFeedBackPage';
function App() {
  return (
        <>
          <nav className="nav-bar">
            <Link to="/">Home</Link>
            <Link to="/basic-question">Basic Questions</Link>
            <Link to="/advanced-question">Advanced Questions</Link>
          </nav>

          <div className="app-container">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/basic-question" element={<BasicQuestion />} />
              <Route path="/advanced-question" element={<AdvancedQuestion />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/advanced-feedback" element={<AdvancedFeedbackPage />} />

            </Routes>
          </div>
        </>
  );
}

export default App;
