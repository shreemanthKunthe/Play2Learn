import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './GameArena.css';

const QUESTIONS = [
  {
    q: 'What does === mean in JavaScript?',
    options: [
      'Assignment operator',
      'Strict equality comparison',
      'Loose equality comparison',
      'Type coercion operator',
    ],
    answer: 1,
  },
  {
    q: 'Which array method returns a new array with elements that pass a test?',
    options: ['map', 'reduce', 'filter', 'forEach'],
    answer: 2,
  },
  {
    q: 'Which keyword declares a block-scoped variable?',
    options: ['var', 'let', 'const', 'static'],
    answer: 1,
  },
  {
    q: 'What is the output of typeof null?',
    options: ['null', 'undefined', 'object', 'number'],
    answer: 2,
  },
];

function GameArena() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const subject = (params.get('subject') || 'javascript').toLowerCase();
  const subjectTitle = subject === 'javascript' ? 'JavaScript' : subject === 'python' ? 'Python' : subject === 'htmlcss' ? 'HTML & CSS' : subject;
  const [playerHP, setPlayerHP] = useState(100);
  const [robotHP, setRobotHP] = useState(100);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState('');
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const question = useMemo(() => QUESTIONS[idx % QUESTIONS.length], [idx]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const onSelect = (i) => {
    if (selected !== null || paused) return;
    setSelected(i);
    const correct = i === question.answer;
    if (correct) {
      setResult('Correct!');
      setRobotHP((hp) => Math.max(0, hp - 20));
    } else {
      setResult('Wrong!');
      setPlayerHP((hp) => Math.max(0, hp - 20));
    }
    timerRef.current = setTimeout(() => {
      setSelected(null);
      setResult('');
      setIdx((v) => v + 1);
    }, 2000);
  };

  const gameOver = playerHP === 0 || robotHP === 0;

  return (
    <div className="arena-page">
      <div className="arena-container">
        <div className="arena-header">
          <span className="subject-pill">{subjectTitle}</span>
          <h1 className="arena-title">{subjectTitle} Arena</h1>
          <p className="arena-subtitle">Answer questions to defeat your opponent. Each mistake costs 20 HP.</p>
        </div>
        <div className="arena-top">
          <div className="entity">
            <div className="hp-bar green">
              <div className="hp-fill" style={{ width: `${playerHP}%` }} />
            </div>
            <div className="card player">
              <div className="image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517260739337-6799d9d2b1a8?q=80&w=1200&auto=format&fit=crop')" }} />
              <span className="label">Player</span>
            </div>
          </div>

          <div className="vs">VS</div>

          <div className="entity">
            <div className="hp-bar red">
              <div className="hp-fill" style={{ width: `${robotHP}%` }} />
            </div>
            <div className="card robot">
              <div className="image" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518773553398-650c184e0bb3?q=80&w=1200&auto=format&fit=crop')" }} />
              <span className="label">Robot</span>
            </div>
          </div>
        </div>

        <div className="quiz">
          {!gameOver ? (
            <>
              <h2 className="question">{question.q}</h2>
              <div className="options">
                {question.options.map((op, i) => {
                  let cls = 'option';
                  if (selected !== null) {
                    if (i === question.answer && selected === i) cls += ' correct';
                    else if (selected === i && i !== question.answer) cls += ' wrong';
                  }
                  return (
                    <button key={i} className={cls} onClick={() => onSelect(i)} disabled={selected !== null || paused}>
                      {op}
                    </button>
                  );
                })}
              </div>
              <div className="controls">
                <button className="btn yellow" disabled>Submit</button>
                <button className="btn gray" onClick={() => setPaused((p) => !p)}>{paused ? 'Resume' : 'Pause'}</button>
              </div>
              {result && <div className="result">{result}</div>}
            </>
          ) : (
            <div className="gameover">
              {playerHP === 0 ? 'Game Over - Robot Wins!' : 'Victory - You Win!'}
              <div className="go-actions">
                <button className="btn yellow" onClick={() => { setPlayerHP(100); setRobotHP(100); setIdx(0); setSelected(null); setResult(''); }}>Play Again</button>
                <button className="btn gray" onClick={() => navigate('/choose')}>Back</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GameArena;
