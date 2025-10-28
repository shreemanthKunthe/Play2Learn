import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { auth } from '../firebase';
import { verifyToken, checkBackendHealth } from '../utils/api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState('checking'); // 'checking', 'online', 'offline'
  const [error, setError] = useState(null);

  // Check backend health
  const checkBackend = useCallback(async () => {
    try {
      setBackendStatus('checking');
      await checkBackendHealth();
      setBackendStatus('online');
      return true;
    } catch (err) {
      console.error('Backend connection error:', err);
      setBackendStatus('offline');
      setError('Unable to connect to the server. Please check your connection and try again.');
      return false;
    }
  }, []);

  // Verify user session with backend
  const verifySession = useCallback(async (user) => {
    if (!user) {
      setCurrentUser(null);
      return false;
    }

    try {
      const isBackendAlive = await checkBackend();
      if (!isBackendAlive) return false;

      const token = await user.getIdToken();
      await verifyToken(token);
      setCurrentUser(user);
      setError(null);
      return true;
    } catch (error) {
      console.error('Session validation failed:', error);
      try {
        await auth.signOut();
      } catch (signOutError) {
        console.error('Error during sign out:', signOutError);
      }
      setCurrentUser(null);
      setError('Your session has expired. Please log in again.');
      return false;
    }
  }, [checkBackend]);

  // Set up auth state listener
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // First check if backend is available
        const isBackendAlive = await checkBackend();
        if (!isBackendAlive) {
          setLoading(false);
          return;
        }

        // Set up auth state listener
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
          if (!isMounted) return;
          
          if (user) {
            await verifySession(user);
          } else {
            setCurrentUser(null);
          }
          setLoading(false);
        });

        return () => {
          isMounted = false;
          unsubscribe();
        };
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('Failed to initialize authentication. Please refresh the page.');
        setLoading(false);
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [checkBackend, verifySession]);

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    backendStatus,
    error,
    refreshSession: () => currentUser && verifySession(currentUser),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
