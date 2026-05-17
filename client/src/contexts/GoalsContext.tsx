import React, { createContext, useContext, useState } from 'react';
import { Goal, Comment, QuarterlyUpdate } from '@/types';
import { goals as initialGoals, allEmployeeGoals } from '@/lib/dummyData';

interface GoalsContextType {
  goals: Goal[];
  allGoals: Goal[];
  addGoal: (goal: Goal) => void;
  updateGoal: (goal: Goal) => void;
  deleteGoal: (goalId: string) => void;
  submitGoal: (goalId: string) => void;
  approveGoal: (goalId: string) => void;
  rejectGoal: (goalId: string, reason: string) => void;
  addComment: (goalId: string, comment: Comment) => void;
  addQuarterlyUpdate: (goalId: string, update: QuarterlyUpdate) => void;
  lockGoal: (goalId: string) => void;
  unlockGoal: (goalId: string) => void;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export function GoalsProvider({ children }: { children: React.ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [allGoals, setAllGoals] = useState<Goal[]>(allEmployeeGoals);

  const addGoal = (goal: Goal) => {
    setGoals([...goals, goal]);
    setAllGoals([...allGoals, goal]);
  };

  const updateGoal = (updatedGoal: Goal) => {
    setGoals(goals.map(g => (g.id === updatedGoal.id ? updatedGoal : g)));
    setAllGoals(allGoals.map(g => (g.id === updatedGoal.id ? updatedGoal : g)));
  };

  const deleteGoal = (goalId: string) => {
    setGoals(goals.filter(g => g.id !== goalId));
    setAllGoals(allGoals.filter(g => g.id !== goalId));
  };

  const submitGoal = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      const updated = {
        ...goal,
        status: 'submitted' as const,
        submittedAt: new Date(),
      };
      updateGoal(updated);
    }
  };

  const approveGoal = (goalId: string) => {
    const goal = allGoals.find(g => g.id === goalId);
    if (goal) {
      const updated = {
        ...goal,
        status: 'approved' as const,
        approvedAt: new Date(),
      };
      setAllGoals(allGoals.map(g => (g.id === goalId ? updated : g)));
      if (goals.find(g => g.id === goalId)) {
        updateGoal(updated);
      }
    }
  };

  const rejectGoal = (goalId: string, reason: string) => {
    const goal = allGoals.find(g => g.id === goalId);
    if (goal) {
      const updated = {
        ...goal,
        status: 'rejected' as const,
        rejectionReason: reason,
      };
      setAllGoals(allGoals.map(g => (g.id === goalId ? updated : g)));
      if (goals.find(g => g.id === goalId)) {
        updateGoal(updated);
      }
    }
  };

  const addComment = (goalId: string, comment: Comment) => {
    const goal = allGoals.find(g => g.id === goalId);
    if (goal) {
      const updated = {
        ...goal,
        comments: [...goal.comments, comment],
      };
      setAllGoals(allGoals.map(g => (g.id === goalId ? updated : g)));
      if (goals.find(g => g.id === goalId)) {
        updateGoal(updated);
      }
    }
  };

  const addQuarterlyUpdate = (goalId: string, update: QuarterlyUpdate) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      const updated = {
        ...goal,
        quarterlyUpdates: [...goal.quarterlyUpdates, update],
      };
      updateGoal(updated);
    }
  };

  const lockGoal = (goalId: string) => {
    const goal = allGoals.find(g => g.id === goalId);
    if (goal) {
      const updated = {
        ...goal,
        status: 'locked' as const,
      };
      setAllGoals(allGoals.map(g => (g.id === goalId ? updated : g)));
      if (goals.find(g => g.id === goalId)) {
        updateGoal(updated);
      }
    }
  };

  const unlockGoal = (goalId: string) => {
    const goal = allGoals.find(g => g.id === goalId);
    if (goal) {
      const updated = {
        ...goal,
        status: 'approved' as const,
      };
      setAllGoals(allGoals.map(g => (g.id === goalId ? updated : g)));
      if (goals.find(g => g.id === goalId)) {
        updateGoal(updated);
      }
    }
  };

  return (
    <GoalsContext.Provider
      value={{
        goals,
        allGoals,
        addGoal,
        updateGoal,
        deleteGoal,
        submitGoal,
        approveGoal,
        rejectGoal,
        addComment,
        addQuarterlyUpdate,
        lockGoal,
        unlockGoal,
      }}
    >
      {children}
    </GoalsContext.Provider>
  );
}

export function useGoals() {
  const context = useContext(GoalsContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalsProvider');
  }
  return context;
}
