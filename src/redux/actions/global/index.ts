import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GlobalState } from "./type";
import { Baby } from "../authentication/types";

const initialState: GlobalState = {
  selectedTerapiBaby: {} as Baby,
};

const global = createSlice({
  name: "global",
  initialState,
  reducers: {
    setSelectedTerapiBaby: (state, action: PayloadAction<Baby>) => {
      state.selectedTerapiBaby = {
        ...state.selectedTerapiBaby,
        ...action.payload,
      };
    },
  },
});

export const { setSelectedTerapiBaby } = global.actions;

export default global.reducer;
