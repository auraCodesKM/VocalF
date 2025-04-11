"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './auth-context';

// Define the exercise interface
export interface Exercise {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  benefits: string[];
  steps: string[];
}

// Define the completed exercise interface
export interface CompletedExercise {
  id: string;
  exerciseId: string;
  title: string;
  difficulty: string;
  completedAt: number;
}

// Define the streak interface (for tracking daily practice)
export interface ExerciseStreak {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  history: string[]; // Array of ISO date strings when exercises were completed
}

type ExercisesContextType = {
  completedExercises: CompletedExercise[];
  streak: ExerciseStreak;
  todaysExercises: CompletedExercise[];
  totalCompletedExercises: number;
  hasCompletedExerciseToday: boolean;
  completedExercisesPercentage: number;
  completeExercise: (exercise: Exercise) => void;
  hasCompletedExercise: (exerciseId: string) => boolean;
  getCompletedExerciseByDate: (date: Date) => CompletedExercise[];
};

const defaultStreak: ExerciseStreak = {
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: null,
  history: []
};

const ExercisesContext = createContext<ExercisesContextType>({
  completedExercises: [],
  streak: defaultStreak,
  todaysExercises: [],
  totalCompletedExercises: 0,
  hasCompletedExerciseToday: false,
  completedExercisesPercentage: 0,
  completeExercise: () => {},
  hasCompletedExercise: () => false,
  getCompletedExerciseByDate: () => []
});

export const ExercisesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [completedExercises, setCompletedExercises] = useState<CompletedExercise[]>([]);
  const [streak, setStreak] = useState<ExerciseStreak>(defaultStreak);
  
  // Load completed exercises from localStorage when component mounts or user changes
  useEffect(() => {
    if (user) {
      const storedExercises = localStorage.getItem(`completed_exercises_${user.uid}`);
      if (storedExercises) {
        setCompletedExercises(JSON.parse(storedExercises));
      }
      
      const storedStreak = localStorage.getItem(`exercise_streak_${user.uid}`);
      if (storedStreak) {
        setStreak(JSON.parse(storedStreak));
      }
    }
  }, [user]);
  
  // Save completed exercises to localStorage whenever they change
  useEffect(() => {
    if (user && completedExercises.length > 0) {
      localStorage.setItem(`completed_exercises_${user.uid}`, JSON.stringify(completedExercises));
    }
  }, [user, completedExercises]);
  
  // Save streak to localStorage whenever it changes
  useEffect(() => {
    if (user && streak.history.length > 0) {
      localStorage.setItem(`exercise_streak_${user.uid}`, JSON.stringify(streak));
    }
  }, [user, streak]);
  
  // Get today's date as ISO string (without time)
  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  // Update streak based on completed exercises
  const updateStreak = () => {
    const today = getTodayDateString();
    
    // Skip if already completed exercise today
    if (streak.lastCompletedDate === today) {
      return;
    }
    
    // Get yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split('T')[0];
    
    // Check if last completed date was yesterday
    if (streak.lastCompletedDate === yesterdayString) {
      // Continue streak
      const newStreak = streak.currentStreak + 1;
      setStreak({
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, streak.longestStreak),
        lastCompletedDate: today,
        history: [...streak.history, today]
      });
    } else {
      // Reset streak
      setStreak({
        currentStreak: 1,
        longestStreak: Math.max(1, streak.longestStreak),
        lastCompletedDate: today,
        history: [...streak.history, today]
      });
    }
  };
  
  // Get exercises completed today
  const todaysExercises = completedExercises.filter(exercise => {
    const exerciseDate = new Date(exercise.completedAt).toISOString().split('T')[0];
    return exerciseDate === getTodayDateString();
  });
  
  // Check if user has completed any exercise today
  const hasCompletedExerciseToday = todaysExercises.length > 0;
  
  // Calculate total completed exercises
  const totalCompletedExercises = completedExercises.length;
  
  // Calculate completion percentage (assuming there are 4 exercises for now)
  const completedExercisesPercentage = Math.min(100, (completedExercises.length / 4) * 100);
  
  // Mark an exercise as completed
  const completeExercise = (exercise: Exercise) => {
    const now = Date.now();
    const completedExercise: CompletedExercise = {
      id: `${exercise.id}_${now}`,
      exerciseId: exercise.id,
      title: exercise.title,
      difficulty: exercise.difficulty,
      completedAt: now
    };
    
    setCompletedExercises(prev => [...prev, completedExercise]);
    updateStreak();
  };
  
  // Check if an exercise has been completed today
  const hasCompletedExercise = (exerciseId: string) => {
    return todaysExercises.some(ex => ex.exerciseId === exerciseId);
  };
  
  // Get completed exercises by date
  const getCompletedExerciseByDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return completedExercises.filter(exercise => {
      const exerciseDate = new Date(exercise.completedAt).toISOString().split('T')[0];
      return exerciseDate === dateString;
    });
  };
  
  return (
    <ExercisesContext.Provider value={{
      completedExercises,
      streak,
      todaysExercises,
      totalCompletedExercises,
      hasCompletedExerciseToday,
      completedExercisesPercentage,
      completeExercise,
      hasCompletedExercise,
      getCompletedExerciseByDate
    }}>
      {children}
    </ExercisesContext.Provider>
  );
};

export const useExercises = () => useContext(ExercisesContext); 