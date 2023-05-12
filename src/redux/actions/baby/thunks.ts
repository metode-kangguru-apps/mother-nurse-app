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
  query,
  orderBy,
} from "firebase/firestore";

import {
  fetchBabyError,
  fetchBabyRequest,
  fetchBabySuccess,
  setBabyProgress,
} from ".";
import { BabyProgressPayload, Progress } from "./types";
import { updateBabyProgress } from "../global";
import { Baby } from "../authentication/types";
import { updateMotherBabyCollectionData } from "../authentication";

export const addProgressBaby =
  (
    payload: BabyProgressPayload
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    dispatch(fetchBabyRequest());
    try {
      const progressList: Progress[] = [];
      const babyRefDocs = doc(firestore, "babies", payload.babyID);
      const progressRef = collection(babyRefDocs, "progress");
      // add new progress
      await addDoc(progressRef, {
        createdAt: new Date(),
        week: payload.week,
        weight: payload.weight,
        length: payload.length,
        temperature: payload.temperature,
      })
        .then(async () => {
          // update existing baby current data and set to redux
          await updateDoc(babyRefDocs, {
            currentWeight: payload.weight,
            currentLength: payload.length,
          })
            .then(async () => {
              const babyUpdated = await getDoc(babyRefDocs);
              const babyDocument = {
                id: babyRefDocs.id,
                ...babyUpdated.data(),
              } as Baby;
              dispatch(
                updateBabyProgress({
                  currentWeight: payload.weight,
                  currentLength: payload.length,
                })
              );
              dispatch(updateMotherBabyCollectionData(babyDocument));
            })
            .catch(() => {
              throw new Error();
            });
          // get progress list baby and set to redux
          const progressOrderByCreatedAt = query(
            progressRef,
            orderBy("createdAt", "desc")
          );
          await getDocs(progressOrderByCreatedAt)
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                progressList.push(doc.data() as Progress);
              });
              dispatch(setBabyProgress(progressList));
              dispatch(fetchBabySuccess());
            })
            .catch(() => {
              throw new Error();
            });
        })
        .catch(() => {
          throw new Error();
        });
    } catch {
      dispatch(fetchBabyError());
    }
  };

export const getProgressBaby =
  (
    payload: BabyProgressPayload["babyID"]
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    dispatch(fetchBabyRequest());
    try {
      const babyRefDocs = doc(firestore, "babies", payload);
      const progressRef = query(
        collection(babyRefDocs, "progress"),
        orderBy("createdAt", "desc")
      );
      const progressList: Progress[] = [];
      await getDocs(progressRef)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            progressList.push(doc.data() as Progress);
          });
          dispatch(setBabyProgress(progressList));
          dispatch(fetchBabySuccess());
        })
        .catch(() => {
          throw new Error();
        });
    } catch {
      dispatch(fetchBabyError());
    }
  };
