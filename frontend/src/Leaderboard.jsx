import React from 'react';
import './Leaderboard.css';

function getLeaderboardKey(subject) {
  return `leaderboard:${(subject || '').toLowerCase()}`;
}

export function readLeaderboard(subject) {
  try {
    const raw = localStorage.getItem(getLeaderboardKey(subject));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function writeLeaderboard(subject, entries) {
  try {
    localStorage.setItem(getLeaderboardKey(subject), JSON.stringify(entries.slice(0, 10)));
  } catch {}
}

export default function Leaderboard({ subject, limit = 5 }) {
  const entries = readLeaderboard(subject).slice(0, limit);
  if (!entries.length) return (
    <div className="lb-card">
      <div className="lb-title">Leaderboard</div>
      <div className="lb-empty">No scores yet. Be the first!</div>
    </div>
  );
  return (
    <div className="lb-card">
      <div className="lb-title">Leaderboard</div>
      <ol className="lb-list">
        {entries.map((e, i) => (
          <li key={i} className="lb-item">
            <span className="rank">{i+1}</span>
            <span className="name">{e.name || 'Player'}</span>
            <span className="score">{Math.round(e.score)}%</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
