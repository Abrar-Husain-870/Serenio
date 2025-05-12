import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface MoodEntry {
  id: string;
  date: string;
  mood: 'happy' | 'neutral' | 'sad';
  note?: string;
}

interface MoodState {
  entries: MoodEntry[];
  loading: boolean;
  error: string | null;
}

const initialState: MoodState = {
  entries: [],
  loading: false,
  error: null,
};

const moodSlice = createSlice({
  name: 'mood',
  initialState,
  reducers: {
    addMoodStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addMoodSuccess: (state, action: PayloadAction<MoodEntry>) => {
      state.loading = false;
      state.entries.unshift(action.payload);
      state.error = null;
    },
    addMoodFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setMoods: (state, action: PayloadAction<MoodEntry[]>) => {
      state.entries = action.payload;
    },
    deleteMood: (state, action: PayloadAction<string>) => {
      state.entries = state.entries.filter((entry) => entry.id !== action.payload);
    },
  },
});

export const { addMoodStart, addMoodSuccess, addMoodFailure, setMoods, deleteMood } = moodSlice.actions;
export default moodSlice.reducer; 