import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BabyCollection } from "../authentication/types";
import { GlobalState } from "./type";

const initialState: GlobalState = {
  selectedTerapiBaby: undefined
};

const global = createSlice({
  name: "global",
  initialState,
  reducers: {
    setSelectedTerapiBaby: (state, action: PayloadAction<BabyCollection>) => {
      state.selectedTerapiBaby = action.payload
    }
  },
});

export const {
  setSelectedTerapiBaby
} = global.actions;

export default global.reducer;
