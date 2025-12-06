import {Task, SortMode} from '../types';

const priorityRank = {
  high: 0,
  medium: 1,
  low: 2,
} as const;

const clamp = (value: number, min: number, max: number) => {
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

const computeSmartScore = (task: Task, now: number) => {
  const basePriority = priorityRank[task.priority] * 1000;
  const deadline = task.deadline ? new Date(task.deadline).getTime() : null;
  const timeToDeadlineHours = deadline ? (deadline - now) / 36e5 : 24 * 30;
  const urgency = clamp(24 * 7 - timeToDeadlineHours, 0, 24 * 7);
  const ageHours = (now - new Date(task.createdAt).getTime()) / 36e5;
  const staleness = clamp(ageHours, 0, 24 * 30) / 2;
  const completionPenalty = task.completed ? 10_000 : 0;
  return basePriority + urgency * 10 + staleness + completionPenalty;
};

export const sortTasks = (tasks: Task[], mode: SortMode): Task[] => {
  const now = Date.now();
  const copy = [...tasks];
  if (mode === 'deadline') {
    return copy.sort((a, b) => {
      const aTime = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      const bTime = b.deadline ? new Date(b.deadline).getTime() : Infinity;
      return aTime - bTime;
    });
  }
  if (mode === 'priority') {
    return copy.sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority]);
  }
  if (mode === 'created') {
    return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  return copy.sort((a, b) => computeSmartScore(a, now) - computeSmartScore(b, now));
};
