import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './ChooseOpponent.css';

function ChooseOpponent() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const subject = (params.get('subject') || 'javascript').toLowerCase();
  const subjectTitle = subject === 'javascript' ? 'JavaScript' : subject === 'python' ? 'Python' : subject === 'htmlcss' ? 'HTML & CSS' : subject;

  return (
    <div className="choose-page">
      <div className="choose-container">
        <div className="choose-header">
          <span className="subject-pill">{subjectTitle}</span>
          <h1 className="choose-title">Choose Your Opponent</h1>
          <p className="choose-subtitle">Pick who you want to challenge to start your {subjectTitle} quiz.</p>
        </div>
        <div className="cards">
          <div className="card player" onClick={() => navigate(`/arena?subject=${subject}&opponent=player`)}>
            <div className="card-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517260739337-6799d9d2b1a8?q=80&w=1200&auto=format&fit=crop')" }} />
            <h3>Player</h3>
          </div>
          <div className="card robot" onClick={() => navigate(`/arena?subject=${subject}&opponent=robot`)}>
            <div className="card-image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518773553398-650c184e0bb3?q=80&w=1200&auto=format&fit=crop')" }} />
            <h3>Robot</h3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChooseOpponent;
