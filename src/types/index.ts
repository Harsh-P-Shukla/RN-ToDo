export type Priority = 'low' | 'medium' | 'high';

export type SortMode = 'smart' | 'deadline' | 'priority' | 'created';

export type AuthUser = {
  email: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  deadline?: string;
  priority: Priority;
  completed: boolean;
  tag?: string;
  ownerEmail: string;
};
