import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, updateProfile, GoogleAuthProvider } from 'firebase/auth';
import './Signup.css';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCQgFyhNohdhbSC7QkM0QmPUUa-voxMEQw",
  authDomain: "play2learn-b84ef.firebaseapp.com",
  projectId: "play2learn-b84ef",
  storageBucket: "play2learn-b84ef.appspot.com",
  messagingSenderId: "385714339470",
  appId: "1:385714339470:web:a4af2fb156659f85dd13df"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name
      });
      const token = await userCredential.user.getIdToken();

      // Send token to backend for verification
      const res = await fetch("http://localhost:5000/verifyToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("✅ User created and verified:", data);
        navigate("/subjects");
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message || 'Failed to create an account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Google Signup
  const handleGoogleSignup = async () => {
    try {
      setError("");
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();

      const res = await fetch("http://localhost:5000/verifyToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("✅ Google signup verified:", data);
        navigate("/subjects");
      } else {
        setError(data.error || "Google signup failed");
      }
    } catch (err) {
      console.error("Google Signup Error:", err);
      if (err.code === "auth/popup-closed-by-user") setError("Login cancelled.");
      else if (err.code === "auth/popup-blocked") setError("Popup blocked. Allow popups.");
      else setError(err.message || "Google signup failed.");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-mascot-panel">
          <video
            src="/Videos/TeamS.mp4"
            poster="/Images/maskot2.png"
            autoPlay
            muted
            loop
            playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
        <div className="signup-right">
          <div className="signup-header">
            <h1 className="signup-logo" onClick={() => navigate('/')}>Play2Learn</h1>
            <p className="signup-subtitle">Create your account to start your learning journey.</p>
          </div>

          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button 
              type="submit" 
              className="signup-button"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </button>

            <div className="signup-divider">
              <span>or</span>
            </div>

            <button type="button" className="google-signup" onClick={handleGoogleSignup}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M19.8055 10.2292C19.8055 9.55056 19.7508 8.86717 19.6359 8.19775H10.2002V12.0492H15.6014C15.3773 13.2911 14.6571 14.3898 13.6025 15.0879V17.5866H16.8251C18.7172 15.8449 19.8055 13.2728 19.8055 10.2292Z" fill="#4285F4"/>
                <path d="M10.2002 20.0006C12.9516 20.0006 15.2727 19.1151 16.8306 17.5865L13.608 15.0879C12.7063 15.6979 11.5508 16.0433 10.2057 16.0433C7.54148 16.0433 5.28174 14.2834 4.48272 11.9097H1.16309V14.4818C2.75809 17.6536 6.31245 20.0006 10.2002 20.0006Z" fill="#34A853"/>
                <path d="M4.47729 11.9097C4.05729 10.6678 4.05729 9.33777 4.47729 8.09587V5.52368H1.16309C-0.387574 8.60777 -0.387574 12.3978 1.16309 15.4819L4.47729 11.9097Z" fill="#FBBC04"/>
                <path d="M10.2002 3.95805C11.6235 3.93577 13.0006 4.47805 14.0407 5.45805L16.8962 2.60234C15.1851 0.990341 12.9352 0.0956775 10.2002 0.122341C6.31245 0.122341 2.75809 2.46934 1.16309 5.64663L4.47729 8.21881C5.27087 5.83969 7.53605 3.95805 10.2002 3.95805Z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <p className="signin-link">
              Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>Sign in</a>
            </p>

            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
