import { Goal } from '@/types';

/**
 * Calculate total weightage of goals
 */
export function calculateTotalWeightage(goals: Goal[]): number {
  return goals.reduce((sum, goal) => sum + goal.weightage, 0);
}

/**
 * Check if total weightage equals 100%
 */
export function isWeightageValid(goals: Goal[]): boolean {
  const total = calculateTotalWeightage(goals);
  return total === 100;
}

/**
 * Check if a goal can be added (max 8 goals, min 10% weightage)
 */
export function canAddGoal(goals: Goal[], newWeightage: number): { valid: boolean; error?: string } {
  if (goals.length >= 8) {
    return { valid: false, error: 'Maximum 8 goals allowed' };
  }
  if (newWeightage < 10) {
    return { valid: false, error: 'Minimum weightage is 10%' };
  }
  if (newWeightage > 100) {
    return { valid: false, error: 'Weightage cannot exceed 100%' };
  }
  const currentTotal = calculateTotalWeightage(goals);
  if (currentTotal + newWeightage > 100) {
    return { valid: false, error: `Total weightage would exceed 100% (current: ${currentTotal}%)` };
  }
  return { valid: true };
}

/**
 * Get average progress from quarterly updates
 */
export function getAverageProgress(goal: Goal): number {
  if (goal.quarterlyUpdates.length === 0) return 0;
  const total = goal.quarterlyUpdates.reduce((sum, update) => sum + update.progressPercentage, 0);
  return Math.round(total / goal.quarterlyUpdates.length);
}

/**
 * Get status badge color
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case 'approved':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'submitted':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'rejected':
      return 'bg-rose-100 text-rose-800 border-rose-300';
    case 'draft':
      return 'bg-slate-100 text-slate-800 border-slate-300';
    case 'locked':
      return 'bg-slate-200 text-slate-900 border-slate-400';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-300';
  }
}

/**
 * Get status icon name
 */
export function getStatusIcon(status: string): string {
  switch (status) {
    case 'approved':
      return 'CheckCircle2';
    case 'submitted':
      return 'Clock';
    case 'rejected':
      return 'XCircle';
    case 'draft':
      return 'FileText';
    case 'locked':
      return 'Lock';
    default:
      return 'HelpCircle';
  }
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get remaining weightage available
 */
export function getRemainingWeightage(goals: Goal[]): number {
  const currentTotal = calculateTotalWeightage(goals);
  return Math.max(0, 100 - currentTotal);
}

/**
 * Get goals by status
 */
export function getGoalsByStatus(goals: Goal[], status: string): Goal[] {
  return goals.filter(goal => goal.status === status);
}

/**
 * Calculate dashboard metrics
 */
export function calculateMetrics(goals: Goal[]) {
  const approved = goals.filter(g => g.status === 'approved').length;
  const pending = goals.filter(g => g.status === 'submitted').length;
  const rejected = goals.filter(g => g.status === 'rejected').length;
  const totalWeightage = calculateTotalWeightage(goals);
  
  const allUpdates = goals.flatMap(g => g.quarterlyUpdates);
  const averageProgress = allUpdates.length > 0
    ? Math.round(allUpdates.reduce((sum, u) => sum + u.progressPercentage, 0) / allUpdates.length)
    : 0;

  return {
    totalGoals: goals.length,
    approvedGoals: approved,
    pendingGoals: pending,
    rejectedGoals: rejected,
    totalWeightage,
    averageProgress,
  };
}
