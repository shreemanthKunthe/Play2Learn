import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SubjectSelect.css';

const SUBJECTS = [
  {
    key: 'Company Quizes',
    title: 'Company Quizes',
    desc: 'ES6+, DOM, async, and more.',
    color: '#f7df1e',
    image: '/Images/CQuiz.png'
  },
  {
    key: 'Aptitude',
    title: 'Aptitude',
    desc: 'Basics, OOP, data, and libs.',
    color: '#3776ab',
    image: '/Images/Aptitude.png'
  },
  {
    key: 'Web Development',
    title: 'Web Development',
    desc: 'Layouts, flex/grid, responsive.',
    color: '#ff6a00',
    image: '/Images/Web.png'
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
            <Link key={s.key} className="subject-card" to={`/arena?subject=${encodeURIComponent(s.key)}`}>
              <div className="thumb" style={{ backgroundImage: `url(${s.image})` }} />
              <div className="meta">
                <span className="pill" style={{ background: s.color, color: '#0b0c10' }}>{s.title}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
