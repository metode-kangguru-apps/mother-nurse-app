import { AnyAction } from "redux";
import { firestore } from "../../../../firebaseConfig";

import { RootState } from "../../types";
import { ThunkAction } from "redux-thunk";

import {
  doc,
  addDoc,
  collection,
  getDocs,
  updateDoc,
  getDoc,
} from "firebase/firestore";

import {
  fetchBabyError,
  fetchBabyRequest,
  fetchBabySuccess,
  setBabyProgress,
} from ".";
import { BabyProgressPayload, Progress } from "./types";
import { setSelectedTerapiBaby } from "../global";
import { Baby } from "../authentication/types";

export const addProgressBaby =
  (
    payload: BabyProgressPayload
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    fetchBabyRequest();
    try {
      const progressList: Progress[] = [];
      const babyRefDocs = doc(firestore, "babies", payload.babyID);
      const progressRef = collection(babyRefDocs, "progress");
      // add new progress
      await addDoc(progressRef, {
        weight: payload.weight,
        length: payload.length,
        temperature: payload.temperature,
      })
        .then(async () => {
          // update existing baby current data and set to redux
          await updateDoc(babyRefDocs, {
            currentWeight: payload.weight,
            currentLength: payload.length,
          }).then(async () => {
            const babyUpdated = await getDoc(babyRefDocs);
            dispatch(setSelectedTerapiBaby(babyUpdated.data() as Baby));
          }).catch(() => {
            throw new Error()
          });
          // get progress list baby and set to redux
          await getDocs(progressRef)
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                progressList.push(doc.data() as Progress);
              });
              dispatch(setBabyProgress(progressList));
              fetchBabySuccess();
            })
            .catch(() => {
              throw new Error();
            });
        })
        .catch(() => {
          throw new Error();
        });
    } catch {
      fetchBabyError();
    }
  };
