import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { HospitalPayload, HospitalInitialState } from "./types";

const initialState: HospitalInitialState = {
  loading: false,
  selectedHospital: undefined,
  hospitalList: [] as HospitalPayload[],
  error: false,
  message: "",
};

const hospital = createSlice({
  name: "hospital",
  initialState,
  reducers: {
    setSelectedHospital: (state, action: PayloadAction<HospitalPayload>) => {
      state.selectedHospital = action.payload;
    },
    setHospitalList: (state, action: PayloadAction<HospitalPayload[]>) => {
      state.hospitalList = action.payload;
    },
  },
});

export const { setSelectedHospital, setHospitalList } = hospital.actions;

export default hospital.reducer;
