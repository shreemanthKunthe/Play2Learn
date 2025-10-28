import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "./firebaseConfig";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 🔹 Email/Password Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      // Send token to backend for verification
      const res = await fetch("http://localhost:5000/verifyToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (res.ok) {
        console.log("✅ Verified:", data);
        navigate("/subjects");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // 🔹 Google Login
  const handleGoogleLogin = async () => {
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
        console.log("✅ Verified Google Login:", data);
        navigate("/subjects");
      } else {
        setError(data.error || "Google Login failed");
      }
    } catch (err) {
      console.error("Google Login Error:", err);
      if (err.code === "auth/popup-closed-by-user") setError("Login cancelled. Please try again.");
      else if (err.code === "auth/popup-blocked") setError("Popup blocked. Please allow popups.");
      else setError(err.message || "Google Login failed. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-mascot-panel">
          <video
            src="/Videos/TeamS.mp4"
            poster="/Images/maskot2.png"
            autoPlay
            muted
            loop
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>

        <div className="login-right">
          <div className="login-header">
            <h1 className="login-logo" onClick={() => navigate("/")}>Play2Learn</h1>
            <p className="login-subtitle">
              Welcome back! Sign in to continue your learning journey.
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
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

            <div className="form-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>

            <button type="submit" className="login-button">Sign In</button>

            <div className="login-divider"><span>or</span></div>

            <button type="button" className="google-login" onClick={handleGoogleLogin}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M19.8055 10.2292C19.8055 9.55056 19.7508 8.86717 19.6359 8.19775H10.2002V12.0492H15.6014C15.3773 13.2911 14.6571 14.3898 13.6025 15.0879V17.5866H16.8251C18.7172 15.8449 19.8055 13.2728 19.8055 10.2292Z" fill="#4285F4"/>
                <path d="M10.2002 20.0006C12.9516 20.0006 15.2727 19.1151 16.8306 17.5865L13.608 15.0879C12.7063 15.6979 11.5508 16.0433 10.2057 16.0433C7.54148 16.0433 5.28174 14.2834 4.48272 11.9097H1.16309V14.4818C2.75809 17.6536 6.31245 20.0006 10.2002 20.0006Z" fill="#34A853"/>
                <path d="M4.47729 11.9097C4.05729 10.6678 4.05729 9.33777 4.47729 8.09587V5.52368H1.16309C-0.387574 8.60777 -0.387574 12.3978 1.16309 15.4819L4.47729 11.9097Z" fill="#FBBC04"/>
                <path d="M10.2002 3.95805C11.6235 3.93577 13.0006 4.47805 14.0407 5.45805L16.8962 2.60234C15.1851 0.990341 12.9352 0.0956775 10.2002 0.122341C6.31245 0.122341 2.75809 2.46934 1.16309 5.64663L4.47729 8.21881C5.27087 5.83969 7.53605 3.95805 10.2002 3.95805Z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <p className="signup-link">
              Don't have an account?{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); navigate("/signup"); }}>
                Sign up
              </a>
            </p>

            {error && <p className="error-message">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
