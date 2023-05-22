import { AppDispatch, FirebaseCollection } from "@redux/types";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../../../../firebaseConfig";
import { AddProgressBabyPayload, Baby, Progress, Session } from "./types";
import { pushUpdatedBabyAndProgress, setBabyProgressAndSession } from ".";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { selectBabyCurrentStatus } from "./helper";

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
    await getDocs(progressCollectionRef).then((snapshot) => {
      console.log(snapshot.docs);
    });
    console.log(progressSnapshots);

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
    const currentStatus = selectBabyCurrentStatus(
      payload.weight,
      payload.temperature,
      payload.previousWeight
    );
    const updatedBabyData = {
      currentWeight: payload.weight,
      currentLength: payload.length,
      currentStatus: currentStatus,
    };
    await addDoc(progressCollectionRef, savedProgressBaby);
    await updateDoc(babyDocumentRef, updatedBabyData);
    dispatch(pushUpdatedBabyAndProgress(payload));
  } catch {
    console.log("Terjadi kesalahan saat memilih bayi");
  }
});
