import { useState, useCallback } from 'react';

const SESSION_COUNT_KEY = 'breathwork_session_count';
const FREE_SESSION_LIMIT = 3;

export const useSessionCounter = () => {
  const [sessionCount, setSessionCount] = useState<number>(() => {
    const stored = localStorage.getItem(SESSION_COUNT_KEY);
    return stored ? parseInt(stored, 10) : 0;
  });

  const incrementSessionCount = useCallback(() => {
    // Read directly from localStorage to avoid stale closure
    const current = parseInt(localStorage.getItem(SESSION_COUNT_KEY) || '0', 10);
    const newCount = current + 1;
    localStorage.setItem(SESSION_COUNT_KEY, newCount.toString());
    setSessionCount(newCount);
    return newCount;
  }, []);

  const hasReachedFreeLimit = sessionCount >= FREE_SESSION_LIMIT;
  const remainingFreeSessions = Math.max(0, FREE_SESSION_LIMIT - sessionCount);

  return {
    sessionCount,
    incrementSessionCount,
    hasReachedFreeLimit,
    remainingFreeSessions,
    freeSessionLimit: FREE_SESSION_LIMIT,
  };
};
