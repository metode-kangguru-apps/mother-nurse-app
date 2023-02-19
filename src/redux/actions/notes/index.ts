import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notes } from './types';

const initialState: Notes = {
  notes: [],
  notConnected: false,
  loading: false,
  error: false,
};

const notes = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    fetchDataRequest: (state) => {
      state.loading = true;
    },
    fetchDataSuccess: (state, action: PayloadAction<any>) => {
      state.notes = action.payload;
      state.loading = false;
      state.notConnected = false;
    },
    fetchDataError: (state) => {
      state.loading = false;
      state.notConnected = true;
    },
  },
});

export const {
    fetchDataRequest,
    fetchDataSuccess,
    fetchDataError
} = notes.actions;

export default notes.reducer;