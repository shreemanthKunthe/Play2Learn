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
  const [timeLeft, setTimeLeft] = useState(15);
  const [suggestion, setSuggestion] = useState('');
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // Placeholder video sources. Replace with your actual files in /public/Videos
  const playerVideo = '/Videos/player.mp4';
  const challengerVideo = '/Videos/challenger.mp4';

  const question = useMemo(() => QUESTIONS[idx % QUESTIONS.length], [idx]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  // Countdown and suggestion logic
  useEffect(() => {
    if (paused || gameOver) return;
    setTimeLeft(15);
    setSuggestion('');
    const iv = setInterval(() => {
      setTimeLeft((t) => {
        if (selected !== null) return t; // stop counting when answered
        if (t <= 1) {
          clearInterval(iv);
          if (!suggestion) setSuggestion(generateSuggestion(question));
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, paused]);

  // Voice recognition setup/teardown
  useEffect(() => {
    return () => {
      try { recognitionRef.current && recognitionRef.current.stop(); } catch {}
    };
  }, []);

  const generateSuggestion = (q) => {
    const text = (q.q || '').toLowerCase();
    const opts = q.options.map((o) => o.toLowerCase());
    // simple keyword heuristics
    const heuristics = [
      ['strict equality', /===|strict/],
      ['filter', /filter|pass a test|subset/],
      ['let', /block-scoped|block scoped|mutable/],
      ['object', /typeof null|null/],
    ];
    for (const [optKeyword, re] of heuristics) {
      if (re.test(text)) {
        const idx = opts.findIndex((o) => o.includes(optKeyword));
        if (idx !== -1) return `Hint: Consider "${q.options[idx]}"`;
      }
    }
    // fallback: match any word overlap
    let best = 0, bestIdx = 0;
    opts.forEach((o, i) => {
      const score = o.split(/\W+/).reduce((s, w) => s + (w && text.includes(w) ? 1 : 0), 0);
      if (score > best) { best = score; bestIdx = i; }
    });
    return `Hint: Maybe "${q.options[bestIdx]}"`;
  };

  const toggleListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Speech recognition is not supported in this browser.'); return; }
    if (!listening) {
      const rec = new SR();
      rec.lang = 'en-US';
      rec.continuous = true;
      rec.interimResults = false;
      rec.onresult = (e) => {
        if (selected !== null || paused) return;
        const transcript = Array.from(e.results).map(r => r[0].transcript).join(' ').toLowerCase();
        // try to map spoken words to an option
        const numbered = transcript.match(/(option|choice|number|no\.?|answer)\s*(one|two|three|four|1|2|3|4|first|second|third|fourth|a|b|c|d)/);
        const words = ['one','two','three','four','1','2','3','4','first','second','third','fourth','a','b','c','d'];
        const numMap = { one:0, 1:0, first:0, a:0, two:1, 2:1, second:1, b:1, three:2, 3:2, third:2, c:2, four:3, 4:3, fourth:3, d:3 };
        let matchedIndex = null;
        if (numbered) {
          const token = numbered[2];
          matchedIndex = numMap[token];
        }
        if (matchedIndex == null) {
          matchedIndex = question.options.findIndex(op => transcript.includes(op.toLowerCase()));
        }
        if (matchedIndex != null && matchedIndex >= 0 && matchedIndex < question.options.length) {
          onSelect(matchedIndex);
        }
      };
      rec.onend = () => { setListening(false); };
      try { rec.start(); setListening(true); recognitionRef.current = rec; } catch {}
    } else {
      try { recognitionRef.current && recognitionRef.current.stop(); } catch {}
      setListening(false);
    }
  };

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
    setSuggestion('');
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
              <div className="quiz-meta" style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12}}>
                <div className="timer" style={{opacity:0.9}}>Time left: {timeLeft}s</div>
                <div className="actions" style={{display:'flex', gap:8}}>
                  <button className="btn gray" onClick={toggleListening} type="button">{listening ? 'Stop Mic' : 'Use Voice'}</button>
                </div>
              </div>
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
              {suggestion && selected === null && (
                <div className="result" style={{opacity:0.9}}>{suggestion}</div>
              )}
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
