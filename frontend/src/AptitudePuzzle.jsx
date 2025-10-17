import React from 'react';
import './AptitudePuzzle.css';

function Shape({ token }) {
  // tokens: plus-blue, circle-green, triangle-orange, square-red, empty, unknown
  const cls = `shape ${token || 'empty'}`;
  return <div className={cls} />;
}

export default function AptitudePuzzle({ puzzle, disabled, selectedIndex, onPick, revealToken, correctState }) {
  if (!puzzle) return null;
  const { grid, options } = puzzle;
  const handleDropOnUnknown = (e) => {
    e.preventDefault();
    if (disabled) return;
    const idxStr = e.dataTransfer.getData('text/plain');
    const idx = Number(idxStr);
    if (!Number.isNaN(idx)) onPick(idx);
  };
  const allowDrop = (e) => { if (!disabled) e.preventDefault(); };
  const handleDragStart = (e, i) => { e.dataTransfer.setData('text/plain', String(i)); };
  return (
    <div className="puzzle-root">
      <div className="puzzle-grid">
        {grid.map((row, r) => (
          <div className="puzzle-row" key={r} style={{ gridTemplateColumns: `repeat(${row.length}, minmax(56px,1fr))` }}>
            {row.map((cell, c) => {
              const isUnknown = cell === 'unknown';
              return (
                <div
                  className={`puzzle-cell ${isUnknown ? 'unknown droppable' : ''} ${isUnknown && revealToken ? `reveal ${correctState===true?'ok':correctState===false?'bad':''}` : ''}`}
                  key={`${r}-${c}`}
                  onDragOver={isUnknown ? allowDrop : undefined}
                  onDrop={isUnknown ? handleDropOnUnknown : undefined}
                >
                  {isUnknown
                    ? (revealToken ? <Shape token={revealToken} /> : <div className="qmark">?</div>)
                    : <Shape token={cell} />}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="puzzle-options">
        {options.map((tok, i) => (
          <button
            key={i}
            className={`puzzle-option ${selectedIndex===i?'selected':''} ${(revealToken && selectedIndex===i && correctState===true)?'is-correct':''} ${(revealToken && selectedIndex===i && correctState===false)?'is-wrong':''}`}
            onClick={() => !disabled && onPick(i)}
            disabled={disabled}
            draggable={!disabled}
            onDragStart={(e)=>handleDragStart(e,i)}
            aria-pressed={selectedIndex===i}
          >
            <Shape token={tok} />
          </button>
        ))}
      </div>
    </div>
  );
}
