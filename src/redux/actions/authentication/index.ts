import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserInitialState, Mother, MotherPayload, Nurse } from "./types";
import { AddProgressBabyPayload, Baby } from "../pmkCare/types";

const initialState: UserInitialState = {
  user: undefined,
  loading: false,
  error: false,
  message: "",
};

const authentication = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    setUserData: (
      state,
      action: PayloadAction<Partial<MotherPayload | Mother> | Partial<Nurse>>
    ) => {
      state.user = { ...state.user, ...action.payload } as Mother | Nurse;
    },
    pushBabyToCollection: (state, action: PayloadAction<Baby>) => {
      (state.user as Mother).babyCollection.push(action.payload);
    },
    updateNurseBabyDataAtCollection: (
      state,
      action: PayloadAction<AddProgressBabyPayload>
    ) => {
      (state.user as Nurse).hospital.motherCollection.map(
        (mother, idxMother) => {
          if (mother.uid === action.payload.userID) {
            const mother = (state.user as Nurse).hospital.motherCollection[
              idxMother
            ];
            mother.babyCollection.map((baby, idxBaby) => {
              if (baby.id === action.payload.babyID) {
                (state.user as Nurse).hospital.motherCollection[
                  idxMother
                ].babyCollection[idxBaby] = {
                  ...(state.user as Nurse).hospital.motherCollection[idxMother]
                    .babyCollection[idxBaby],
                  currentWeight: action.payload.weight,
                  currentLength: action.payload.length,
                };
              }
            });
          }
        }
      );
    },
    updateMotherBabyDataAtCollection: (
      state,
      action: PayloadAction<AddProgressBabyPayload>
    ) => {
      (state.user as Mother).babyCollection.map((baby, idxBaby) => {
        if (baby.id === action.payload.babyID) {
          (state.user as Mother).babyCollection[idxBaby] = {
            ...(state.user as Mother).babyCollection[idxBaby],
            currentWeight: action.payload.weight,
            currentLength: action.payload.length,
          };
        }
      });
    },
  },
});

export const {
  setUserData,
  pushBabyToCollection,
  updateMotherBabyDataAtCollection,
  updateNurseBabyDataAtCollection,
} = authentication.actions;

export default authentication.reducer;
