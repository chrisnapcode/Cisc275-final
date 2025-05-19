// [Epic 5, #15] Handles reliable ChatGPT interaction through Firebase setup
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAW7PfICZg5wbsLmrCG8-FQEkOsNEhWGgs",
    authDomain: "cisc-275.firebaseapp.com",
    projectId: "cisc-275",
    storageBucket: "cisc-275.firebasestorage.app",
    messagingSenderId: "256749851662",
    appId: "1:256749851662:web:c5af4503ce57bafd0fd85f",
    measurementId: "G-8VQSBYQS2X"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase()
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export{db, auth, provider}

