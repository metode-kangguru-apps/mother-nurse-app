import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  showDateTimePicker: false,
  dateTimePicker: ''
};

const global = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setShowDateTimePicker: (state, action: PayloadAction<any>) => {
        state.showDateTimePicker = action.payload.showDateTimePicker;
    },
    setDateTimePickerValue: (state, action: PayloadAction<any>) => {
        state.dateTimePicker = action.payload.dateTimePicker;
        state.showDateTimePicker = false;
    },
    clearDateTimePicker: (state) => {
        state.dateTimePicker = ''
    }
  },
});

export const {
    setShowDateTimePicker,
    setDateTimePickerValue,
    clearDateTimePicker
} = global.actions;

export default global.reducer;