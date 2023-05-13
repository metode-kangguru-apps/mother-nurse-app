import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GlobalState, Hostpital } from "./type";
import { Baby, Mother } from "../authentication/types";

const initialState: GlobalState = {
  loading: false,
  selectedTerapiBaby: {} as Baby,
  selectedMotherDetail: {} as Mother,
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
    updateBabyProgress: (state, action: PayloadAction<any>) => {
      if (state.selectedTerapiBaby) {
        state.selectedTerapiBaby.currentWeight = action.payload.currentWeight;
        state.selectedTerapiBaby.currentLength = action.payload.currentLength;
      }
    },
    setHospitalList: (state, action: PayloadAction<Hostpital[]>) => {
      state.hospitalList = action.payload;
    },
    setSelectedMotherDetail: (state, action: PayloadAction<Mother>) => {
      state.selectedMotherDetail = {
        ...state.selectedMotherDetail,
        ...action.payload,
      };
    },
    clearGlobalState: (state) => {
      state.selectedMotherDetail = {}
      state.selectedTerapiBaby = {}
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
  updateBabyProgress,
  setSelectedMotherDetail,
  clearGlobalState,
  fetchGlobalRequest,
  fetchGlobalError,
  fetchGlobalSuccess,
} = global.actions;

export default global.reducer;
