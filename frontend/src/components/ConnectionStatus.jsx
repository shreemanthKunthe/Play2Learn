import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const ConnectionStatus = () => {
  const { backendStatus, error, refreshSession } = useAuth();

  if (backendStatus === 'online') return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      padding: '10px 20px',
      borderRadius: '4px',
      backgroundColor: backendStatus === 'offline' ? '#ff4444' : '#ffbb33',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
    }}>
      {backendStatus === 'offline' ? (
        <>
          <span>Connection lost. Trying to reconnect...</span>
          <button 
            onClick={refreshSession}
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid white',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </>
      ) : (
        <span>Connecting to server...</span>
      )}
      {error && (
        <div style={{ marginTop: '5px', fontSize: '0.9em', opacity: 0.9 }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default ConnectionStatus;
