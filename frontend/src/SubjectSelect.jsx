import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SubjectSelect.css';

const SUBJECTS = [
  {
    key: 'javascript',
    title: 'JavaScript',
    desc: 'ES6+, DOM, async, and more.',
    color: '#f7df1e',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop'
  },
  {
    key: 'python',
    title: 'Python',
    desc: 'Basics, OOP, data, and libs.',
    color: '#3776ab',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop'
  },
  {
    key: 'htmlcss',
    title: 'HTML & CSS',
    desc: 'Layouts, flex/grid, responsive.',
    color: '#ff6a00',
    image: 'https://images.unsplash.com/photo-1520975922420-6c0b5abe3462?q=80&w=1200&auto=format&fit=crop'
  },
];

export default function SubjectSelect() {
  const navigate = useNavigate();

  return (
    <div className="subjects-page">
      <div className="subjects-container">
        <div className="subjects-header">
          <h1 className="title">Pick a Subject</h1>
          <p className="subtitle">Start with JavaScript or explore more. Your journey begins here.</p>
        </div>
        <div className="grid">
          {SUBJECTS.map((s) => (
            <button key={s.key} className="subject-card" onClick={() => navigate(`/choose?subject=${s.key}`)}>
              <div className="thumb" style={{ backgroundImage: `url(${s.image})` }} />
              <div className="meta">
                <span className="pill" style={{ background: s.color, color: '#0b0c10' }}>{s.title}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
