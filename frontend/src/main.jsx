import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import ConnectionStatus from './components/ConnectionStatus';
import './index.css'
import App from './App.jsx'
import Login from './Login.jsx'
import Signup from './Signup.jsx'
import GameArena from './GameArena.jsx'
import SubjectSelect from './SubjectSelect.jsx'

// Loading spinner component
const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f8f9fa'
  }}>
    <div style={{
      width: '50px',
      height: '50px',
      border: '5px solid #f3f3f3',
      borderTop: '5px solid #3498db',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
      margin: '0 auto'
    }} />
    <style>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading, backendStatus } = useAuth();
  
  if (loading || backendStatus === 'checking') {
    return <LoadingSpinner />;
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ConnectionStatus />
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route 
            path="/subjects" 
            element={
              <ProtectedRoute>
                <SubjectSelect />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/arena" 
            element={
              <ProtectedRoute>
                <GameArena />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)

// Keep splash on-screen for a minimum duration
const SPLASH_MIN_MS = 7000; // ~7 seconds
const splashStart = Date.now();
let splashHidden = false;

function hideSplashNow() {
  if (splashHidden) return;
  const el = document.getElementById('splash');
  if (!el) { splashHidden = true; return; }
  splashHidden = true;
  el.style.opacity = '0';
  setTimeout(() => { try { el.remove(); } catch {} }, 300);
}

function tryHideSplash() {
  if (splashHidden) return;
  const elapsed = Date.now() - splashStart;
  const wait = Math.max(0, SPLASH_MIN_MS - elapsed);
  setTimeout(hideSplashNow, wait);
}

// Schedule hide both after mount and on window load, respecting min time
tryHideSplash();
window.addEventListener('load', tryHideSplash);
