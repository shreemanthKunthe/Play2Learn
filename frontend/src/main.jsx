import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './Login.jsx'
import Signup from './Signup.jsx'
import GameArena from './GameArena.jsx'
import SubjectSelect from './SubjectSelect.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/subjects" element={<SubjectSelect />} />
        <Route path="/arena" element={<GameArena />} />
      </Routes>
    </BrowserRouter>
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
