import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GlobalState, Hostpital } from "./type";
import { Baby } from "../authentication/types";

const initialState: GlobalState = {
  loading: false,
  selectedTerapiBaby: {} as Baby,
  hospitalList: [] as Hostpital[],
  error: false,
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
    setHospitalList: (state, action: PayloadAction<Hostpital[]>) => {
      state.hospitalList = action.payload
    },
    fetchGlobalRequest: (state) => {
      state.loading = true;
    },
    fetchGlobalSuccess: (state) => {
      state.loading = false;
      state.error = false;
    },
    fetchGlobalError: (state) => {
      state.loading = false;
      state.error = true;
    },
  },
});

export const {
  setSelectedTerapiBaby,
  setHospitalList,
  fetchGlobalRequest,
  fetchGlobalError,
  fetchGlobalSuccess,
} = global.actions;

export default global.reducer;
