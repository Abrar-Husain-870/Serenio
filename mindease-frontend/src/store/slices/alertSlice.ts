import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AlertStatus = 'success' | 'error' | 'warning' | 'info';

export interface AppAlert {
  id: string;
  status: AlertStatus;
  title: string;
  description?: string;
  durationMs?: number; // auto-dismiss duration
}

interface AlertsState {
  items: AppAlert[];
}

const initialState: AlertsState = {
  items: [],
};

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    addAlert: (state, action: PayloadAction<Omit<AppAlert, 'id'>>) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      state.items.push({ id, ...action.payload });
    },
    removeAlert: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((a) => a.id !== action.payload);
    },
    clearAlerts: (state) => {
      state.items = [];
    },
  },
});

export const { addAlert, removeAlert, clearAlerts } = alertsSlice.actions;
export default alertsSlice.reducer;
