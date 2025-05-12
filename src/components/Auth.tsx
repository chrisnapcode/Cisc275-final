import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, provider } from "../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

const Auth: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user){
        alert("You are signed in."); 
        navigate("/");
      }

    });
    return () => { unsubscribe(); };
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      console.error("Google sign-in failed:", err);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      alert("Invalid email or password.");
      console.error("Email sign-in failed:", err);
    }
  };

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      console.error("Sign-up failed:", err);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-box">
        <h2 className="auth-title">Sign In/Sign Up</h2>

        <button onClick={handleGoogleSignIn} className="auth-button google-button">
          Sign in with Google
        </button>

        <form onSubmit={handleEmailSignIn} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            className="auth-input"
            value={email}
            onChange={(e) => { setEmail(e.target.value); }}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="auth-input"
            value={password}
            onChange={(e) => { setPassword(e.target.value); }}
            required
          />
          <button type="submit" className="auth-button email-button">
            Sign In with Email
          </button>
        </form>

        <button onClick={handleSignUp} className="auth-button signup-button">
          Sign Up with Email
        </button>
      </div>
    </div>
  );
};

export default Auth;
