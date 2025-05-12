import React, {useState} from 'react';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';
import HomePage from './components/HomePage'; 
import BasicQuestion from './components/BasicQuestion';
import AdvancedQuestion from './components/AdvancedQuestions';
import FeedbackPage from './components/FeedbackPage';
import AdvancedFeedbackPage from './components/AdvancedFeedBackPage';
import Auth from './components/Auth';
import defaultPicture from './defaultPicture.jpeg';
import { signOut } from "firebase/auth";
import { auth } from './firebase';
import UserProfileForm from './components/UserProfileForm';
import { useNavigate } from "react-router-dom";

function App() {
  const [showProfileDropdown, setShowProfileDropdown] = useState<boolean>(false);
  const navigate = useNavigate();
  
  const toggleProfileDropdown = () => {
    setShowProfileDropdown(prev => !prev);
  };

  const handleSignOut = async () => {
    if (auth.currentUser === null) {
      alert("You are not signed in.");
    }
    else {
    try {
      await signOut(auth);
      // Handle successful sign out (e.g., redirect to home page)
      alert("You have signed out successfully.");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }
  };

  return (
    <>
      <nav className="nav-bar">
        <div className="right-nav">
          <Link to="/">Home</Link>
          <Link to="/basic-question">Basic Questions</Link>
          <Link to="/advanced-question">Advanced Questions</Link>

          <div className="profile-pic-wrapper">
            <button onClick={toggleProfileDropdown} className="profile-pic">
              <img src={defaultPicture} alt="Profile" />
            </button>
          </div>
        </div>
      </nav>
      {showProfileDropdown && (
              <div className="dropdown-content">
                <Link to="/Auth">Sign In / Sign Up</Link>
                <Link to="/feedback">Feedback</Link>
                <Link to="/advanced-feedback">Advanced Feedback</Link>
                <Link to="/user-info">More Info</Link>
                <button
                    onClick={handleSignOut} style={{ all: 'unset', display: 'block', padding: '10px 20px', width: '100%', fontSize: '16px', color: '#333', textAlign: 'left', cursor: 'pointer', lineHeight: '1.5', fontWeight: 'normal', letterSpacing: 'normal', fontFamily: 'inherit', transition: 'background-color 0.3s', }} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f2f2f2'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                    Sign Out
                  </button>
              </div>
            )}


      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/basic-question" element={<BasicQuestion />} />
          <Route path="/advanced-question" element={<AdvancedQuestion />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/advanced-feedback" element={<AdvancedFeedbackPage/>} />
          <Route path="/auth" element={<Auth />} />
          <Route path="user-info" element={<UserProfileForm/>} />

        </Routes>
      </div>
    </>
  );
}

export default App;
