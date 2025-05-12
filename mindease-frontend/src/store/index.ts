import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import moodReducer from './slices/moodSlice';
import journalReducer from './slices/journalSlice';
import activityReducer from './slices/activitySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    mood: moodReducer,
    journal: journalReducer,
    activity: activityReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 