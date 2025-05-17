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
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
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

  const handleGoogleSignIn = async () => { // gooogle sign in
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      console.error("Google sign-in failed:", err);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => { // email sign in
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      console.error("Email sign-in failed:", err);
    }
  };

  const handleSignUp = async () => { // email sign up
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
