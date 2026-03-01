import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'physics_tutor_progress';

const defaultProgress = {
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  lessonsCompleted: {},
  lessonScores: {},
  problemResults: {},
};

function loadProgress() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultProgress, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.error('Failed to load progress:', e);
  }
  return { ...defaultProgress };
}

function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save progress:', e);
  }
}

export function useProgress() {
  const [progress, setProgress] = useState(loadProgress);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const updateStreak = useCallback(() => {
    setProgress(prev => {
      const today = new Date().toISOString().split('T')[0];
      const lastDate = prev.lastActiveDate;

      if (lastDate === today) return prev;

      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const newStreak = lastDate === yesterday ? prev.streak + 1 : 1;

      return { ...prev, streak: newStreak, lastActiveDate: today };
    });
  }, []);

  const addXP = useCallback((amount) => {
    setProgress(prev => ({ ...prev, xp: prev.xp + amount }));
  }, []);

  const completeLesson = useCallback((unitId, lessonId, score) => {
    const key = `${unitId}-${lessonId}`;
    setProgress(prev => {
      const prevScore = prev.lessonScores[key] || 0;
      const bestScore = Math.max(prevScore, score);
      return {
        ...prev,
        lessonsCompleted: { ...prev.lessonsCompleted, [key]: true },
        lessonScores: { ...prev.lessonScores, [key]: bestScore },
      };
    });
    updateStreak();
  }, [updateStreak]);

  const saveProblemResult = useCallback((unitId, lessonId, problemIndex, correct) => {
    const key = `${unitId}-${lessonId}-${problemIndex}`;
    setProgress(prev => ({
      ...prev,
      problemResults: { ...prev.problemResults, [key]: correct },
    }));
  }, []);

  const isLessonCompleted = useCallback((unitId, lessonId) => {
    return !!progress.lessonsCompleted[`${unitId}-${lessonId}`];
  }, [progress.lessonsCompleted]);

  const getLessonScore = useCallback((unitId, lessonId) => {
    return progress.lessonScores[`${unitId}-${lessonId}`] || 0;
  }, [progress.lessonScores]);

  const getUnitProgress = useCallback((unitId, totalLessons) => {
    let completed = 0;
    for (let i = 1; i <= totalLessons; i++) {
      if (progress.lessonsCompleted[`${unitId}-${i}`]) completed++;
    }
    return completed / totalLessons;
  }, [progress.lessonsCompleted]);

  const resetProgress = useCallback(() => {
    setProgress({ ...defaultProgress });
  }, []);

  return {
    progress,
    addXP,
    completeLesson,
    saveProblemResult,
    isLessonCompleted,
    getLessonScore,
    getUnitProgress,
    updateStreak,
    resetProgress,
  };
}
