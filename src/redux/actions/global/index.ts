import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  selectedTerapiBaby: undefined
};

const global = createSlice({
  name: "global",
  initialState,
  reducers: {
    setSelectedTerapiBaby: (state, action: PayloadAction<any>) => {
      state.selectedTerapiBaby = action.payload.selectedTerapiBaby
    }
  },
});

export const {
  setSelectedTerapiBaby
} = global.actions;

export default global.reducer;
