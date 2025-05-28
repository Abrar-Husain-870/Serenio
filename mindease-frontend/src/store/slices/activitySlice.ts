import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Activity {
  id: string;
  title: string;
  description: string;
  type: 'meditation' | 'exercise' | 'gratitude' | 'breathing';
  duration: string;
  completed: boolean;
  date: string;
}

interface ActivityState {
  activities: Activity[];
  streak: number;
  loading: boolean;
  error: string | null;
}

const initialState: ActivityState = {
  activities: [],
  streak: 0,
  loading: false,
  error: null,
};

const activitySlice = createSlice({
  name: 'activity',
  initialState,
  reducers: {
    setActivities: (state, action: PayloadAction<Activity[]>) => {
      state.activities = action.payload;
    },
    toggleActivity: (state, action: PayloadAction<string>) => {
      const activity = state.activities.find((a) => a.id === action.payload);
      if (activity) {
        activity.completed = !activity.completed;
      }
    },
    updateStreak: (state, action: PayloadAction<number>) => {
      state.streak = action.payload;
    },
    addActivity: (state, action: PayloadAction<Activity>) => {
      state.activities.push(action.payload);
    },
    updateActivity: (state, action: PayloadAction<Activity>) => {
      const index = state.activities.findIndex((a) => a.id === action.payload.id);
      if (index !== -1) {
        state.activities[index] = action.payload;
      }
    },
    deleteActivity: (state, action: PayloadAction<string>) => {
      state.activities = state.activities.filter((a) => a.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setActivities,
  toggleActivity,
  updateStreak,
  addActivity,
  updateActivity,
  deleteActivity,
  setLoading,
  setError,
} = activitySlice.actions;
export default activitySlice.reducer; 