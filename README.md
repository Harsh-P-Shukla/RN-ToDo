# React Native Todo (TypeScript)

CAN USE APP BY DOWNLOADING FROM "https://drive.google.com/file/d/1xSuNuX3w-_G6AxdiIrgR9Tx8dnpsCOxB/view?usp=sharing" HERE
AND ALSO CAN SEE THE VIDEO AT "https://youtu.be/4SVxJuPcYjQ?si=H_kmMRS-zA7epQ36" HERE

A small React Native CLI starter that demonstrates a todo list with local authentication, persistent state, and a smart sorting option.

## Features
- Email/password registration and login (stored locally with AsyncStorage for demo purposes)
- Add tasks with title, description, deadline, priority, and optional tag
- Mark complete, delete, and view per-user tasks
- Sorting modes: smart (deadline + priority blend), deadline, priority, created
- Tag filter and persisted state via Zustand + AsyncStorage

## Quick start
1. Install dependencies
   ```sh
   npm install
   ```
2. Start Metro
   ```sh
   npm start
   ```
3. Run on a device/emulator (React Native CLI prerequisites required)
   ```sh
   npm run android
   # or
   npm run ios
   ```

## Project structure
- `App.tsx` switches between auth and home based on login state
- `src/store/useAppStore.ts` global state (users, auth, tasks) with persistence
- `src/screens/AuthScreen.tsx` simple login/register UI
- `src/screens/HomeScreen.tsx` task list, sorting, filters, and logout
- `src/components/TaskForm.tsx` and `TaskCard.tsx` UI pieces
- `src/utils/sort.ts` smart sort helper

## Notes
- Authentication is local-only for the assignment; replace with Firebase or your backend for production.
- Deadlines expect an ISO-like string (e.g., `2024-12-15T14:00`). Consider swapping for a date/time picker.
- Colors are tuned for a dark, neon-accent palette—adjust in the style sheets if desired.

## Next steps
- Wire Firebase Auth/Firestore in `useAppStore` for cloud sync
- Add push notifications for approaching deadlines
- Introduce categories/boards and richer filters
