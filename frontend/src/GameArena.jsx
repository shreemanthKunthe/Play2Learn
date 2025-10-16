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
  const [challengerHP, setChallengerHP] = useState(100);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState('');
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);
  const [playerAnim, setPlayerAnim] = useState('');
  const [challengerAnim, setChallengerAnim] = useState('');

  // Placeholder video sources. Replace with your actual files in /public/Videos
  const playerVideo = '/Videos/player.mp4';
  const challengerVideo = '/Videos/challenger.mp4';

  const question = useMemo(() => QUESTIONS[idx % QUESTIONS.length], [idx]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const onSelect = (i) => {
    if (selected !== null || paused) return;
    setSelected(i);
    const correct = i === question.answer;
    if (correct) {
      setResult('Correct!');
      setChallengerHP((hp) => Math.max(0, hp - 20));
      setChallengerAnim('hit');
    } else {
      setResult('Wrong!');
      setPlayerHP((hp) => Math.max(0, hp - 20));
      setPlayerAnim('hit');
    }
    timerRef.current = setTimeout(() => {
      setSelected(null);
      setResult('');
      setPlayerAnim('');
      setChallengerAnim('');
      setIdx((v) => v + 1);
    }, 1200);
  };
  const gameOver = playerHP === 0 || challengerHP === 0;

  return (
    <div className="arena-page">
      <div className="arena-container">
        <div className="arena-header">
          <span className="subject-pill">{subjectTitle}</span>
          <h1 className="arena-title">{subjectTitle} Arena</h1>
          <p className="arena-subtitle">Answer questions to defeat your opponent. Each mistake costs 20 HP.</p>
        </div>

        <div className="arena-stage">
          <div className={`stage half left ${playerAnim}`}>
            <video src="/Videos/Player.mp4" autoPlay muted loop playsInline />
            <div className="overlay">
              <div className="hp-bar green"><div className="hp-fill" style={{ width: `${playerHP}%` }} /></div>
              <span className="label">Player</span>
            </div>
          </div>
          <div className={`stage half right ${challengerAnim}`}>
            <video src="/Videos/Challenger.mp4" autoPlay muted loop playsInline />
            <div className="overlay">
              <div className="hp-bar red"><div className="hp-fill" style={{ width: `${challengerHP}%` }} /></div>
              <span className="label">Challenger</span>
            </div>
          </div>
          <div className="vs-mid">VS</div>
          <div className="quiz quiz-overlay">
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
              {playerHP === 0 ? 'Game Over - Challenger Wins!' : 'Victory - You Win!'}
              <div className="go-actions">
                <button className="btn yellow" onClick={() => { setPlayerHP(100); setChallengerHP(100); setIdx(0); setSelected(null); setResult(''); }}>Play Again</button>
                <button className="btn gray" onClick={() => navigate('/subjects')}>Back</button>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameArena;
