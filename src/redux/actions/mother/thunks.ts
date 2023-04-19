import { AnyAction } from "redux";
import { firestore } from "../../../../firebaseConfig";

import { RootState } from "../../types";
import { ThunkAction } from "redux-thunk";

import {
  doc,
  onSnapshot,
  setDoc,
  addDoc,
  collection,
  getDoc,
} from "firebase/firestore";

export const addProgressBaby =
  (payload: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    
  };
