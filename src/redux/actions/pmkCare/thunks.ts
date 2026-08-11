import { AppDispatch, FirebaseCollection, RootStateV2 } from "@redux/types";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "../../../../firebaseConfig";
import {
  AddProgressBabyPayload,
  Baby,
  Progress,
  Session,
  SessionPayload,
} from "./types";
import {
  pushAddNewSession,
  pushUpdateSessionDuration,
  pushUpdatedBabyAndProgress,
  setBabyProgressAndSession,
} from ".";
import { AnyAction, ThunkAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Mother } from "../authentication/types";
import { setUserData } from "../authentication";

export const updateMotherFinnishedOnboarding =
  (userID: string): ThunkAction<void, RootStateV2, unknown, AnyAction> =>
  async (dispatch) => {
    try {
      const motherDocumentRef = doc(
        firestore,
        FirebaseCollection.MOTHER,
        userID
      );
      const updatedMotherData: Partial<Mother> = {
        isFinnishedOnboarding: true,
      };
      await updateDoc(motherDocumentRef, updatedMotherData);
      dispatch(setUserData(updatedMotherData));
    } catch {
      console.log("Terjadi kesalahan saat update data ibu!");
    }
  };

export const getBabyProgressAndSession = createAsyncThunk<
  unknown,
  {
    userID: string;
    baby: Baby;
  },
  { dispatch: AppDispatch }
>("getBabyProgressAndSession", async ({ userID, baby }, { dispatch }) => {
  try {
    // create document reference
    const babyDocumentRef = doc(
      firestore,
      FirebaseCollection.MOTHER,
      userID,
      FirebaseCollection.BABIES,
      baby.id
    );
    const progressCollectionRef = collection(
      babyDocumentRef,
      FirebaseCollection.PROGRESS
    );
    const sessionCollectionRef = collection(
      babyDocumentRef,
      FirebaseCollection.SESSION
    );

    const progressOrderByCreatedAt = query(
      progressCollectionRef,
      orderBy("createdAt", "desc")
    );

    // get docs
    const progressSnapshots = (await getDocs(progressOrderByCreatedAt)).docs;
    const sessionSnapshots = (await getDocs(sessionCollectionRef)).docs;

    const savedProgress: Progress[] = [];
    const savedSession: Session[] = [];
    await getDocs(progressCollectionRef);

    progressSnapshots.map((snapshot) => {
      savedProgress.push(snapshot.data() as Progress);
    });

    sessionSnapshots.map((snapshot) => {
      savedSession.push(snapshot.data() as Session);
    });

    // save to redux
    dispatch(
      setBabyProgressAndSession({
        baby: baby,
        progress: savedProgress,
        sessions: savedSession,
      })
    );
  } catch {
    console.log("Terjadi kesalahan saat mengambil data");
  }
});

export const addBabyProgress = createAsyncThunk<
  unknown,
  AddProgressBabyPayload,
  { dispatch: AppDispatch }
>("addBabyProgress", async (payload, { dispatch }) => {
  try {
    const babyDocumentRef = doc(
      firestore,
      FirebaseCollection.MOTHER,
      payload.userID,
      FirebaseCollection.BABIES,
      payload.babyID
    );
    const progressCollectionRef = collection(
      babyDocumentRef,
      FirebaseCollection.PROGRESS
    );
    const { userID, babyID, ...savedProgressBaby } = payload;
    const updatedBabyData = {
      currentWeight: payload.weight,
      currentLength: payload.length,
      currentStatus: payload.currentStatus,
    };
    await addDoc(progressCollectionRef, savedProgressBaby);
    await updateDoc(babyDocumentRef, updatedBabyData);
    dispatch(pushUpdatedBabyAndProgress(payload));
  } catch {
    console.log("Terjadi kesalahan saat memilih bayi");
  }
});

export const addSessionData = createAsyncThunk<
  unknown,
  SessionPayload,
  {
    dispatch: AppDispatch;
  }
>("addSessionData", async (payload, { dispatch }) => {
  try {
    const babyDocumentRef = doc(
      firestore,
      FirebaseCollection.MOTHER,
      payload.userID,
      FirebaseCollection.BABIES,
      payload.babyID
    );
    const sessionCollectionRef = collection(
      babyDocumentRef,
      FirebaseCollection.SESSION
    );
    const sessionQuery = query(
      sessionCollectionRef,
      where("monitoredRangeDate", "==", payload.monitoredRangeDate)
    );
    const sessionSnapshots = await getDocs(sessionQuery);
    if (sessionSnapshots.empty) {
      const savedSessionData: Session = {
        monitoredRangeDate: payload.monitoredRangeDate,
        durations: [payload.duration],
      };
      await addDoc(sessionCollectionRef, savedSessionData);
      dispatch(pushAddNewSession(savedSessionData));
    } else {
      const sessionDocument = sessionSnapshots.docs[0];
      const snapshotDocumentRef = doc(
        firestore,
        FirebaseCollection.MOTHER,
        payload.userID,
        FirebaseCollection.BABIES,
        payload.babyID,
        FirebaseCollection.SESSION,
        sessionDocument.id
      );
      await updateDoc(snapshotDocumentRef, {
        durations: arrayUnion(payload.duration),
      });
      dispatch(pushUpdateSessionDuration(payload));
    }
  } catch {
    console.log("Terjadi kesalahan saat dispatch data");
  }
});
