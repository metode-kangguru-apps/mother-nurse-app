import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Baby,
  PMKCareInitialState,
  SelectBabyPayload,
  AddProgressBabyPayload,
  Progress,
  Session,
} from "./types";
import { Timestamp } from "firebase/firestore";
import { Mother } from "../authentication/types";

const initialState: PMKCareInitialState = {
  mother: {} as Mother,
  baby: {} as Baby,
  progress: [],
  sessions: [],
  loading: false,
  error: false,
  message: "",
};

const PMKCare = createSlice({
  name: "pmk-care",
  initialState,
  reducers: {
    setFocusedMother: (state, action: PayloadAction<Mother>) => {
      state.mother = action.payload;
    },
    setBabyProgressAndSession: (
      state,
      action: PayloadAction<SelectBabyPayload>
    ) => {
      state.baby = action.payload.baby;
      state.progress = action.payload.progress;
      state.sessions = action.payload.sessions;
    },
    pushUpdatedBabyAndProgress: (
      state,
      action: PayloadAction<AddProgressBabyPayload>
    ) => {
      const { userID, babyID, previousWeight, ...savedBabyProgress } =
        action.payload;
      state.baby = {
        ...state.baby,
        currentWeight: action.payload.weight,
        currentLength: action.payload.length,
      };
      state.progress.unshift({
        ...savedBabyProgress,
        createdAt: Timestamp.fromMillis(
          (savedBabyProgress.createdAt as Date).getTime()
        ),
      } as Progress);

      if (Object.keys(state.mother).length) {
        state.mother.babyCollection.map((baby, idx) => {
          if (baby.id === action.payload.babyID) {
            state.mother.babyCollection[idx] = {
              ...baby,
              currentWeight: action.payload.weight,
              currentLength: action.payload.length,
            };
          }
        });
      }
    },
    clearPMKCareState: (state) => {
      state.mother = {} as Mother;
      state.baby = {} as Baby;
      state.progress = [] as Progress[];
      state.sessions = [] as Session[];
    },
  },
});

export const {
  setFocusedMother,
  setBabyProgressAndSession,
  pushUpdatedBabyAndProgress,
  clearPMKCareState,
} = PMKCare.actions;

export default PMKCare.reducer;
