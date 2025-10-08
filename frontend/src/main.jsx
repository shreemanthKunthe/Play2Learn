import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './Login.jsx'
import Signup from './Signup.jsx'
import ChooseOpponent from './ChooseOpponent.jsx'
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
        <Route path="/choose" element={<ChooseOpponent />} />
        <Route path="/arena" element={<GameArena />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
