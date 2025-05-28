import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  mood?: string;
}

interface JournalState {
  entries: JournalEntry[];
  loading: boolean;
  error: string | null;
}

const initialState: JournalState = {
  entries: [],
  loading: false,
  error: null,
};

const journalSlice = createSlice({
  name: 'journal',
  initialState,
  reducers: {
    addEntryStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    addEntrySuccess: (state, action: PayloadAction<JournalEntry>) => {
      state.loading = false;
      state.entries.unshift(action.payload);
      state.error = null;
    },
    addEntryFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setEntries: (state, action: PayloadAction<JournalEntry[]>) => {
      state.entries = action.payload;
    },
    updateEntry: (state, action: PayloadAction<JournalEntry>) => {
      const index = state.entries.findIndex((entry) => entry.id === action.payload.id);
      if (index !== -1) {
        state.entries[index] = action.payload;
      }
    },
    deleteEntry: (state, action: PayloadAction<string>) => {
      state.entries = state.entries.filter((entry) => entry.id !== action.payload);
    },
  },
});

export const {
  addEntryStart,
  addEntrySuccess,
  addEntryFailure,
  setEntries,
  updateEntry,
  deleteEntry,
} = journalSlice.actions;
export default journalSlice.reducer; 