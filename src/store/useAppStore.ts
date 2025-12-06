import AsyncStorage from '@react-native-async-storage/async-storage';
import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {AuthUser, Priority, SortMode, Task} from '../types';
import {ThemeMode} from '../theme';

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const randomId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export type AppState = {
  user: AuthUser | null;
  users: Record<string, string>;
  tasks: Task[];
  sortMode: SortMode;
  themeMode: ThemeMode;
  streaks: Record<string, {count: number; lastCompleted: string | null}>;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  addTask: (input: {
    title: string;
    description: string;
    deadline?: string;
    priority: Priority;
    tag?: string;
  }) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  setSortMode: (mode: SortMode) => void;
  setThemeMode: (mode: ThemeMode) => void;
};

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const isYesterday = (today: Date, other: Date) => {
  const yesterday = new Date(today);
  yesterday.setHours(0, 0, 0, 0);
  yesterday.setDate(today.getDate() - 1);
  return isSameDay(yesterday, other);
};

export const useAppStore = create<AppState>()(
  persist<AppState>(
    (set, get): AppState => ({
      user: null,
      users: {},
      tasks: [],
      sortMode: 'smart',
      themeMode: 'dark',
      streaks: {},
      register: async (email: string, password: string) => {
        const normalized = normalizeEmail(email);
        const users = get().users;
        if (users[normalized]) {
          throw new Error('User already exists. Try logging in.');
        }
        set({
          users: {...users, [normalized]: password},
          user: {email: normalized},
        });
      },
      login: async (email: string, password: string) => {
        const normalized = normalizeEmail(email);
        const users = get().users;
        if (!users[normalized]) {
          throw new Error('No account found for that email.');
        }
        if (users[normalized] !== password) {
          throw new Error('Incorrect password.');
        }
        set({user: {email: normalized}});
      },
      logout: () => set({user: null}),
      addTask: (input: {
        title: string;
        description: string;
        deadline?: string;
        priority: Priority;
        tag?: string;
      }) => {
        const user = get().user;
        if (!user) return;
        const task: Task = {
          id: randomId(),
          title: input.title.trim(),
          description: input.description.trim(),
          deadline: input.deadline,
          priority: input.priority,
          tag: input.tag?.trim() || undefined,
          completed: false,
          ownerEmail: user.email,
          createdAt: new Date().toISOString(),
        };
        set({tasks: [task, ...get().tasks]});
      },
      toggleTask: (id: string) => {
        const state = get();
        const user = state.user;
        const originalTask = state.tasks.find((task: Task) => task.id === id);
        if (!originalTask) return;

        const toggledTask: Task = {...originalTask, completed: !originalTask.completed};
        const updatedTasks: Task[] = state.tasks.map((task: Task) =>
          task.id === id ? toggledTask : task,
        );

        const updates: Partial<AppState> = {tasks: updatedTasks};

        if (user && toggledTask.completed) {
          const today = new Date();
          const streakEntry = state.streaks[user.email] || {count: 0, lastCompleted: null};
          let newCount = 1;
          if (streakEntry.lastCompleted) {
            const last = new Date(streakEntry.lastCompleted);
            if (isSameDay(today, last)) {
              newCount = streakEntry.count;
            } else if (isYesterday(today, last)) {
              newCount = streakEntry.count + 1;
            }
          }
          updates.streaks = {
            ...state.streaks,
            [user.email]: {count: newCount, lastCompleted: today.toISOString()},
          };
        }

        set(updates as AppState);
      },
      deleteTask: (id: string) =>
        set({tasks: get().tasks.filter((task: Task) => task.id !== id)}),
      setSortMode: (mode: SortMode) => set({sortMode: mode}),
      setThemeMode: (mode: ThemeMode) => set({themeMode: mode}),
    }),
    {
      name: 'rn-todo-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state: AppState) =>
        ({
          users: state.users,
          tasks: state.tasks,
          sortMode: state.sortMode,
          user: state.user ?? null,
          themeMode: state.themeMode,
          streaks: state.streaks,
        } as AppState),
    },
  ),
);

export const selectTasksForUser = (email: string) =>
  useAppStore
    .getState()
    .tasks.filter((task: Task) => task.ownerEmail === normalizeEmail(email));
