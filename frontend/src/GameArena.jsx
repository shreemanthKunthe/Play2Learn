import React, { useEffect, useMemo, useRef, useState } from 'react';
import Leaderboard, { readLeaderboard, writeLeaderboard } from './Leaderboard';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './GameArena.css';
import AptitudePuzzle from './AptitudePuzzle';

// Subject-specific question banks (legacy flat bank)
const QUESTIONS_BY_SUBJECT = {
  // Default/general JS bank
  default: [
    {
      q: 'What does === mean in JavaScript?',
      options: ['Assignment operator','Strict equality comparison','Loose equality comparison','Type coercion operator'],
      answer: 1,
    },
    {
      q: 'Which array method returns a new array with elements that pass a test?',
      options: ['map','reduce','filter','forEach'],
      answer: 2,
    },
    {
      q: 'Which keyword declares a block-scoped variable?',
      options: ['var','let','const','static'],
      answer: 1,
    },
    {
      q: 'What is the output of typeof null?',
      options: ['null','undefined','object','number'],
      answer: 2,
    },
  ],
  // Cognizant-style gamified scenarios
  'company questions': [
    {
      q: 'Sprint demo in 10 minutes: your API returns 500 in prod for one endpoint. What is your BEST immediate action?',
      options: [
        'Refactor the whole module for long-term stability',
        'Roll back the last deploy and add a quick health-check alert',
        'Ignore it for now and proceed with the demo',
        'Open a Jira ticket and wait for triage tomorrow',
      ],
      answer: 1,
    },
    {
      q: 'You are optimizing a dashboard loading in 6s. Profiling shows 70% spent awaiting 4 sequential API calls. What is the most impactful first step?',
      options: [
        'Minify CSS and images',
        'Parallelize API calls and cache stable responses',
        'Add a loading spinner to improve perceived speed',
        'Move all logic to the client side',
      ],
      answer: 1,
    },
    {
      q: 'A payments feature intermittently fails under load. Logs show race conditions updating the same record. What’s the best fix?',
      options: [
        'Increase server CPU and memory',
        'Introduce optimistic locking or transactions for writes',
        'Retry failed writes endlessly',
        'Disable concurrency until later',
      ],
      answer: 1,
    },
    {
      q: 'Security review flags secrets in code history. What should you do NOW?',
      options: [
        'Remove the secrets from current code only',
        'Rotate the secrets, purge from history, add pre-commit secret scanning',
        'Document the incident and continue',
        'Push secrets to .env and call it done',
      ],
      answer: 1,
    },
  ],
  aptitude: [
    { q: 'If a train travels 120 km in 2 hours, its average speed is?', options: ['40 km/h','50 km/h','60 km/h','80 km/h'], answer: 2 },
    { q: 'The next number in the series 2, 6, 12, 20, ? is', options: ['24','28','30','32'], answer: 1 },
    { q: 'What is 35% of 240?', options: ['72','80','84','96'], answer: 2 },
  ],
  'web development': [
    { q: 'Which CSS layout is best for 2D page grids?', options: ['Flexbox','Grid','Float','Position'], answer: 1 },
    { q: 'Largest Contentful Paint primarily measures?', options: ['Interactivity','Visual stability','Load of largest content','Input delay'], answer: 2 },
    { q: 'Which tag is semantic?', options: ['div','span','section','b'], answer: 2 },
  ],
};

// Level-based difficulty banks; prefer these if present
// Easy -> Level 0, Medium -> Level 1, Hard -> Level 2+
const DIFFICULTY_QUESTIONS_BY_SUBJECT = {
  default: {
    easy: [
      { q: 'Which method adds an element to the end of an array?', options: ['push','pop','shift','unshift'], answer: 0 },
      { q: 'What keyword creates a constant?', options: ['let','var','const','static'], answer: 2 },
      { q: 'What is the type of NaN?', options: ['number','NaN','undefined','object'], answer: 0 },
    ],
    medium: [
      { q: 'What does Array.prototype.reduce do?', options: ['Filters array','Transforms to single value','Maps values','Sorts array'], answer: 1 },
      { q: 'Which equality avoids type coercion?', options: ['==','===','!=','='], answer: 1 },
      { q: 'Which copies an array?', options: ['a2 = a1','a2 = [...a1]','a2 = a1.push()','a2 = a1.slice(1)'], answer: 1 },
    ],
    hard: [
      { q: 'What is the output of [1,2,3].map(parseInt)?', options: ['[1,2,3]','[1,NaN,NaN]','[1,NaN,3]','Error'], answer: 1 },
      { q: 'typeof null is?', options: ['null','object','undefined','number'], answer: 1 },
      { q: 'Promise.race resolves when?', options: ['All resolve','First settles','Any rejects','All reject'], answer: 1 },
    ],
  },
  'company questions': {
    easy: [
      { q: 'You see a minor UI bug before demo. Best first step?', options: ['Refactor whole UI','Log and hotfix after demo','Open ticket and ignore','Fix quickly if low risk'], answer: 3 },
      { q: 'Build failing due to lint. What next?', options: ['Disable lint','Fix lint errors','Force merge','Rollback unrelated service'], answer: 1 },
    ],
    medium: [
      { q: '70% time spent awaiting 4 sequential APIs. First step?', options: ['Minify assets','Parallelize and cache','Add spinner','SSR'], answer: 1 },
      { q: 'Race conditions updating same record. Best fix?', options: ['Bigger server','Transactions/locking','Retry endlessly','Single thread'], answer: 1 },
    ],
    hard: [
      { q: 'Secrets leaked in history. Immediate action?', options: ['Remove current code only','Rotate, purge history, add scanning','Document and continue','Move to .env only'], answer: 1 },
      { q: 'Intermittent prod error with no logs. First approach?', options: ['Add structured logging + correlation IDs','Scale servers','Disable feature','Blame network'], answer: 0 },
    ],
  },
  aptitude: {
    easy: [
      { q: 'What is 20% of 150?', options: ['20','25','30','35'], answer: 2 },
      { q: 'Next in 3, 6, 9, ?', options: ['10','11','12','15'], answer: 2 },
    ],
    medium: [
      { q: 'Average of 10, 20, 30, 40?', options: ['20','25','30','35'], answer: 1 },
      { q: 'Simplify ratio 18:24', options: ['3:4','2:3','4:3','6:8'], answer: 0 },
    ],
    hard: [
      { q: 'Train A is 20% faster than B. If B takes 60 min, A takes?', options: ['48m','50m','55m','58m'], answer: 0 },
      { q: 'Compound interest yields higher than simple when?', options: ['Rate=0','Time=0','Always for t>1','Never'], answer: 2 },
    ],
  },
  'web development': {
    easy: [
      { q: 'CSS for 2D grids?', options: ['Flexbox','Grid','Float','Position'], answer: 1 },
      { q: 'Semantic element?', options: ['div','span','section','b'], answer: 2 },
    ],
    medium: [
      { q: 'Best for responsive images?', options: ['<img srcset>','<picture> only','Fixed px sizes','CSS only'], answer: 0 },
      { q: 'Improve LCP first?', options: ['Defer non-critical','Remove all CSS','Add more JS','Inline all images'], answer: 0 },
    ],
    hard: [
      { q: 'Specificity order (low→high)?', options: ['Inline < ID < Class < Element','Element < Class < ID < Inline','Class < Element < ID < Inline','ID < Inline < Class < Element'], answer: 1 },
      { q: 'Contain layout thrashing by?', options: ['Synchronous measurements','requestAnimationFrame batching','Force reflow repeatedly','Avoid CSS transforms'], answer: 1 },
    ],
  },
};

// Visual puzzles (Cognizant-style aptitude) scoped to the subject 'Game Based Aptitude'
const PUZZLES_BY_SUBJECT = {
  'game based aptitude': [
    {
      grid: [
        ['plus-blue','plus-blue','plus-blue','empty'],
        ['circle-green','triangle-orange','circle-green','unknown'],
        ['empty','empty','empty','empty'],
        ['square-red','empty','empty','empty'],
      ],
      options: ['square-red','circle-green','plus-blue','triangle-orange'],
      answer: 3,
      rule: { type: 'row-sequence', axis: 'row', index: 1, sequence: ['circle-green','triangle-orange','circle-green','triangle-orange'], cyclic: true },
      explain: 'Row pattern alternates Circle, Triangle. The missing tile should be Triangle (orange).',
    },
    {
      grid: [
        ['square-red','circle-green','plus-blue','triangle-orange'],
        ['square-red','circle-green','plus-blue','unknown'],
        ['empty','empty','empty','empty'],
        ['empty','empty','empty','empty'],
      ],
      options: ['triangle-orange','plus-blue','circle-green','square-red'],
      answer: 0,
      rule: { type: 'row-sequence', axis: 'row', index: 1, sequence: ['square-red','circle-green','plus-blue','triangle-orange'], cyclic: false },
      explain: 'Second row follows the same left-to-right sequence as the first row.',
    },
  ],
};

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
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const LEVELS = useMemo(() => ([
    { name: 'Level 1: Trainee', challengerVideo: '/Videos/Challenger.mp4' },
    { name: 'Level 2: Specialist', challengerVideo: '/Videos/Blue.mp4' },
    { name: 'Level 3: Boss', challengerVideo: '/Videos/green.mp4' },
  ]), []);
  const [level, setLevel] = useState(0);

  // Placeholder video sources. Replace with your actual files in /public/Videos
  const playerVideo = '/Videos/player.mp4';
  const challengerVideo = (LEVELS[level] && LEVELS[level].challengerVideo) || '/Videos/Challenger.mp4';

  const questions = useMemo(() => {
    const key = subject; // already lowercased
    const banks = DIFFICULTY_QUESTIONS_BY_SUBJECT[key];
    if (banks) {
      const bucket = level >= 2 ? 'hard' : level === 1 ? 'medium' : 'easy';
      const set = banks[bucket] || [];
      if (set.length) return set;
    }
    // fallback to legacy flat bank
    return QUESTIONS_BY_SUBJECT[key] || QUESTIONS_BY_SUBJECT.default;
  }, [subject, level]);
  const question = useMemo(() => questions[idx % questions.length], [idx, questions]);

  const puzzles = useMemo(() => PUZZLES_BY_SUBJECT[subject] || null, [subject]);
  const usePuzzle = !!puzzles; // subjects that use visual puzzles
  const [generatedPuzzle, setGeneratedPuzzle] = useState(null);
  const puzzle = useMemo(() => {
    // prefer generated puzzle when in puzzle mode
    return usePuzzle ? generatedPuzzle : null;
  }, [usePuzzle, generatedPuzzle]);

  // Procedural puzzle generator
  const SHAPES = ['plus','circle','triangle','square'];
  const COLORS = ['blue','green','orange','red'];
  const tok = (shape, color) => `${shape}-${color}`;
  const randInt = (n) => Math.floor(Math.random()*n);
  const shuffle = (arr) => { const a=arr.slice(); for(let i=a.length-1;i>0;i--){const j=randInt(i+1); [a[i],a[j]]=[a[j],a[i]];} return a; };

  // Token helpers for rule engine (moved up so generators can use them)
  const tokenShape = (t) => {
    if (!t) return t;
    if (t.startsWith('plus')) return 'plus';
    if (t.startsWith('circle')) return 'circle';
    if (t.startsWith('triangle')) return 'triangle';
    if (t.startsWith('square')) return 'square';
    return t;
  };
  const tokenColor = (t) => {
    if (!t) return t;
    const parts = t.split('-');
    return parts[1] || null;
  };

  // Procedural puzzle generators with difficulty scaling
  const makeOptions = (correctTok, similarBias=0.7) => {
    // Generate distractors with increasing similarity (same shape or same color) as similarBias grows
    const distractors = new Set();
    const [cShape, cColor] = [tokenShape(correctTok), tokenColor(correctTok)];
    while (distractors.size < 3) {
      let s = SHAPES[randInt(SHAPES.length)];
      let c = COLORS[randInt(COLORS.length)];
      if (Math.random() < similarBias) {
        // keep either shape or color to increase confusion
        if (Math.random() < 0.5) { s = cShape; } else { c = cColor; }
      }
      const candidate = tok(s, c);
      if (candidate !== correctTok) distractors.add(candidate);
    }
    const options = shuffle([correctTok, ...Array.from(distractors)]).slice(0,4);
    return { options, answer: options.indexOf(correctTok) };
  };

  const genRowSequence = (size, similarity=0.5) => {
    const shapes = shuffle(SHAPES).slice(0, size);
    const colorMap = {};
    shapes.forEach(s => { colorMap[s] = COLORS[randInt(COLORS.length)]; });
    const sequence = shapes.map(s => tok(s, colorMap[s]));
    const grid = Array.from({ length: size }, () => Array.from({ length: size }, () => 'empty'));
    for (let c=0; c<size; c++) grid[0][c] = sequence[c];
    for (let c=0; c<size; c++) grid[1][c] = sequence[c];
    const unknownCol = randInt(size);
    const correctTok = grid[1][unknownCol];
    grid[1][unknownCol] = 'unknown';
    const { options, answer } = makeOptions(correctTok, similarity);
    return { grid, options, answer, rule: { type: 'row-sequence', axis: 'row', index: 1, sequence, cyclic: false }, explain: 'Match the row sequence.' };
  };

  const genColumnSequence = (size, similarity=0.6) => {
    const shapes = shuffle(SHAPES).slice(0, size);
    const colorMap = {};
    shapes.forEach(s => { colorMap[s] = COLORS[randInt(COLORS.length)]; });
    const sequence = shapes.map(s => tok(s, colorMap[s]));
    const grid = Array.from({ length: size }, () => Array.from({ length: size }, () => 'empty'));
    for (let r=0; r<size; r++) grid[r][0] = sequence[r];
    for (let r=0; r<size; r++) grid[r][1] = sequence[r];
    const unknownRow = randInt(size);
    const correctTok = grid[unknownRow][1];
    grid[unknownRow][1] = 'unknown';
    const { options, answer } = makeOptions(correctTok, similarity);
    return { grid, options, answer, rule: { type: 'column-sequence', axis: 'column', index: 1, sequence, cyclic: false }, explain: 'Match the column sequence.' };
  };

  const genSetCoverage = (size, similarity=0.5) => {
    // Each row must contain one of each shape (color-agnostic). Hide one cell.
    const grid = Array.from({ length: size }, () => Array.from({ length: size }, () => 'empty'));
    for (let r=0; r<size; r++) {
      const rowShapes = shuffle(SHAPES).slice(0, size);
      for (let c=0; c<size; c++) {
        const color = COLORS[randInt(COLORS.length)];
        grid[r][c] = tok(rowShapes[c], color);
      }
    }
    const ur = randInt(size); const uc = randInt(size);
    const correctTok = grid[ur][uc];
    grid[ur][uc] = 'unknown';
    const { options, answer } = makeOptions(correctTok, similarity);
    return { grid, options, answer, rule: { type: 'set-coverage' }, explain: 'Each row contains one of each shape.' };
  };

  const genCounting = (size, similarity=0.6) => {
    // Each column must contain a specified set of tokens at least once
    const set = [tok('plus', 'blue'), tok('circle', 'green')];
    const grid = Array.from({ length: size }, () => Array.from({ length: size }, () => 'empty'));
    for (let c=0; c<size; c++) {
      // place set items in random rows for this column
      const rows = shuffle(Array.from({ length: size }, (_, i) => i)).slice(0, set.length);
      for (let i=0; i<rows.length; i++) grid[rows[i]][c] = set[i];
      // fill remaining with random tokens
      for (let r=0; r<size; r++) if (grid[r][c] === 'empty') grid[r][c] = tok(SHAPES[randInt(SHAPES.length)], COLORS[randInt(COLORS.length)]);
    }
    const ur = randInt(size); const uc = randInt(size);
    const correctTok = grid[ur][uc];
    grid[ur][uc] = 'unknown';
    const { options, answer } = makeOptions(correctTok, similarity);
    return { grid, options, answer, rule: { type: 'counting', set, axis: 'column' }, explain: 'Each column contains at least one of each required token.' };
  };

  const generatePuzzle = (level) => {
    const size = level >= 2 ? 4 + (Math.random() < 0.3 ? 1 : 0) : level === 1 ? 4 : 3; // sometimes 5x5 on hard
    const similarity = level >= 2 ? 0.85 : level === 1 ? 0.7 : 0.5; // harder distractors on higher level
    const pick = Math.random();
    if (pick < 0.35) return genRowSequence(size, similarity);
    if (pick < 0.6) return genColumnSequence(size, similarity);
    if (pick < 0.85) return genSetCoverage(size, similarity);
    return genCounting(size, similarity);
  };

  // Generate a fresh puzzle whenever level/idx/subject changes in puzzle mode
  useEffect(() => {
    if (!usePuzzle) { setGeneratedPuzzle(null); return; }
    setGeneratedPuzzle(generatePuzzle(level));
  }, [usePuzzle, level, idx, subject]);
  const [puzzleSelected, setPuzzleSelected] = useState(null);
  const [selectedCorrect, setSelectedCorrect] = useState(null);

  

  // Rule engine
  const validatePuzzle = (pz, pickIndex) => {
    if (!pz) return false;
    const { grid, options, answer, rule } = pz;
    const candidate = options[pickIndex];
    // find unknown position
    let ur = -1, uc = -1;
    for (let r=0;r<grid.length;r++){
      const c = grid[r].indexOf('unknown');
      if (c !== -1){ ur=r; uc=c; break; }
    }
    if (ur === -1) return pickIndex === answer; // fallback

    // place candidate
    const g = grid.map(row => row.slice());
    g[ur][uc] = candidate;

    // rule types
    const checkRowSequence = () => {
      const seq = rule.sequence || [];
      const row = g[rule.index] || [];
      if (!row.length || !seq.length) return false;
      // If cyclic, allow wrapping; else exact match length
      for (let i=0;i<row.length;i++){
        const expected = rule.cyclic ? seq[i % seq.length] : seq[i];
        if (!expected) return false;
        if (row[i] !== expected) return false;
      }
      return true;
    };

    const checkColumnSequence = () => {
      const seq = rule.sequence || [];
      const colIdx = rule.index;
      for (let r=0;r<g.length;r++){
        const expected = rule.cyclic ? seq[r % seq.length] : seq[r];
        if (!expected) return false;
        if (g[r][colIdx] !== expected) return false;
      }
      return true;
    };

    const checkCounting = () => {
      const set = rule.set || [];
      const axis = rule.axis || 'row';
      const colCount = g[0]?.length || 0;
      const rowCount = g.length;
      if (axis === 'row'){
        return g.every(row => {
          const seen = new Set();
          for (const cell of row){ if (cell !== 'empty'){ seen.add(cell); } }
          return set.every(tok => seen.has(tok));
        });
      } else {
        for (let c=0;c<colCount;c++){
          const seen = new Set();
          for (let r=0;r<rowCount;r++){ const cell=g[r][c]; if (cell!=='empty') seen.add(cell); }
          if (!set.every(tok => seen.has(tok))) return false;
        }
        return true;
      }
    };

    const checkSetCoverage = () => {
      // each row contains exactly one of each SHAPE (color-agnostic)
      const shapes = ['plus','circle','triangle','square'];
      return g.every(row => {
        const seen = new Set();
        for (const cell of row){ if (cell!=='empty'){ seen.add(tokenShape(cell)); } }
        return shapes.every(s => seen.has(s));
      });
    };

    let ok = false;
    if (rule){
      switch(rule.type){
        case 'row-sequence': ok = rule.axis==='row' ? checkRowSequence() : checkColumnSequence(); break;
        case 'column-sequence': ok = checkColumnSequence(); break;
        case 'counting': ok = checkCounting(); break;
        case 'set-coverage': ok = checkSetCoverage(); break;
        default: ok = (pickIndex === answer);
      }
    } else {
      ok = (pickIndex === answer);
    }
    return ok;
  };

  // Reset score when subject changes
  useEffect(() => {
    setCorrectCount(0);
    setTotalCount(0);
    setPuzzleSelected(null);
    setSelectedCorrect(null);
  }, [subject]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  // Countdown and suggestion logic (timer scales by level). Hints suppressed for puzzle mode.
  useEffect(() => {
    if (paused || gameOver) return;
    const initial = Math.max(8, 15 - level * 2);
    setTimeLeft(initial);
    setSuggestion('');
    const iv = setInterval(() => {
      setTimeLeft((t) => {
        if (selected !== null) return t; // stop counting when answered
        if (t <= 1) {
          clearInterval(iv);
          if (!usePuzzle && !suggestion) setSuggestion(generateSuggestion(question));
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, paused, level, usePuzzle]);

  // Reset puzzle pick on question advance
  useEffect(() => {
    setPuzzleSelected(null);
    setSelectedCorrect(null);
  }, [idx]);

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
    const correct = usePuzzle ? validatePuzzle(puzzle, i) : (i === question.answer);
    if (usePuzzle) setSelectedCorrect(!!correct);
    setTotalCount((n) => n + 1);
    if (correct) {
      setResult('Correct!');
      setCorrectCount((n) => n + 1);
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

  // Persist score to leaderboard once per game over
  const [savedScore, setSavedScore] = useState(false);
  useEffect(() => {
    if (!gameOver || savedScore) return;
    const denom = totalCount || 0;
    const percent = denom ? (correctCount / denom) * 100 : 0;
    const name = localStorage.getItem('playerName') || 'Player';
    const key = subject;
    const list = readLeaderboard(key);
    const next = [...list, { name, score: percent, ts: Date.now() }]
      .sort((a,b) => b.score - a.score || a.ts - b.ts);
    writeLeaderboard(key, next);
    setSavedScore(true);
    // reset flag when restarting
  }, [gameOver, savedScore, correctCount, totalCount, subject]);

  return (
    <div className="arena-page">
      <div className="arena-container">
        <div className="arena-header">
          <span className="subject-pill">{subjectTitle}</span>
          {/* Title intentionally removed per request */}
          <p className="arena-subtitle">Answer questions to defeat your opponent. Each mistake costs 20 HP.</p>
          <div className="arena-level" style={{opacity:.9, marginTop:8}}>{LEVELS[level]?.name}</div>
        </div>
        <div className="arena-stage">
          <div className="video-stack">
            <div className={`stage half left ${playerAnim}`}>
              <video src="/Videos/Player.mp4" autoPlay muted loop playsInline />
              <div className="overlay">
                <div className="hp-bar green"><div className="hp-fill" style={{ width: `${playerHP}%` }} /></div>
                <span className="label">Player</span>
              </div>
            </div>
            <div className={`stage half right ${challengerAnim}`}>
              <video src={challengerVideo} autoPlay muted loop playsInline />
              <div className="overlay">
                <div className="hp-bar red"><div className="hp-fill" style={{ width: `${challengerHP}%` }} /></div>
                <span className="label">Challenger</span>
              </div>
            </div>
          </div>
          <div className="quiz quiz-card">
            {!gameOver ? (
              <>
                {!usePuzzle && <h2 className="question">{question.q}</h2>}
                <div className="quiz-meta" style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12}}>
                  <div className="timer" style={{opacity:0.9}}>Time left: {timeLeft}s</div>
                  <div className="actions" style={{display:'flex', gap:8}}>
                    <button className="btn gray" onClick={toggleListening} type="button">{listening ? 'Stop Mic' : 'Use Voice'}</button>
                  </div>
                </div>
                {usePuzzle ? (
                  <AptitudePuzzle
                    puzzle={puzzle}
                    disabled={selected !== null || paused}
                    selectedIndex={puzzleSelected}
                    onPick={(i)=>setPuzzleSelected(i)}
                    revealToken={selected !== null ? puzzle?.options?.[selected] : null}
                    correctState={selected !== null ? selectedCorrect : null}
                  />
                ) : (
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
                )}
                <div className="controls">
                  <button
                    className="btn yellow"
                    disabled={usePuzzle ? (puzzleSelected==null || selected!==null || paused) : true}
                    onClick={() => { if(usePuzzle && puzzleSelected!=null) onSelect(puzzleSelected); }}
                  >
                    Submit
                  </button>
                  <button className="btn gray" onClick={() => setPaused((p) => !p)}>{paused ? 'Resume' : 'Pause'}</button>
                </div>
                {!usePuzzle && suggestion && selected === null && (
                  <div className="result" style={{opacity:0.9}}>{suggestion}</div>
                )}
                {result && <div className="result">{result}</div>}
              </>
            ) : (
              <div className="gameover">
                {playerHP === 0 ? 'Game Over - Challenger Wins!' : 'Victory - You Win!'}
                <div className="score" style={{marginTop:12}}>
                  Score: {correctCount}/{totalCount} ({totalCount ? Math.round((correctCount/totalCount)*100) : 0}%)
                </div>
                <div className="go-actions" style={{display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center'}}>
                  {playerHP > 0 && level < LEVELS.length - 1 && (
                    <button className="btn yellow" onClick={() => {
                      setIdx(0);
                      setSelected(null);
                      setResult('');
                      setPlayerHP(100);
                      setChallengerHP(100);
                      setPlayerAnim('');
                      setChallengerAnim('');
                      setLevel((lv) => lv + 1);
                    }}>Next Level</button>
                  )}
                  <button className="btn yellow" onClick={() => { setPlayerHP(100); setChallengerHP(100); setIdx(0); setSelected(null); setResult(''); setCorrectCount(0); setTotalCount(0); setLevel(0); }}>Restart</button>
                  <button className="btn gray" onClick={() => navigate('/subjects')}>Back</button>
                </div>
                <div style={{ marginTop: 16 }}>
                  <Leaderboard subject={subject} limit={5} />
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
