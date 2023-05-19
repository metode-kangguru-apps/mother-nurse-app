import { AppDispatch, FirebaseCollection } from "@redux/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { signInAnonymously } from "firebase/auth/react-native";
import { auth, firestore } from "../../../../firebaseConfig";
import { Mother, MotherPayload } from "./types";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { Baby } from "../pmkCare/types";
import { setUserData } from ".";
import { Hospital } from "../hospital/types";

export const signInMotherAnonymously = createAsyncThunk<
  unknown,
  MotherPayload,
  {
    dispatch: AppDispatch;
  }
>("signInMotherAnonymously", async (payload, { dispatch }) => {
  await signInAnonymously(auth).then(async (credential) => {
    const userInformation = payload;
    const userDocumentRef = doc(
      firestore,
      FirebaseCollection.USER,
      credential.user.uid
    );
    const motherDocumentRef = doc(
      firestore,
      FirebaseCollection.MOTHER,
      credential.user.uid
    );
    const hospitalDocumentRef = doc(
      firestore,
      FirebaseCollection.HOSPITAL,
      payload.hospital.value
    );
    const motherBabyCollectionRef = collection(
      motherDocumentRef,
      FirebaseCollection.BABIES
    );
    const hospitalMotherCollectionRef = collection(
      hospitalDocumentRef,
      FirebaseCollection.MOTHER
    );
    const babyCreatedAt = new Date();
    await getDoc(userDocumentRef).then(async (userSnapshot) => {
      if (!userSnapshot.exists()) {
        const { hospital, babyCollection, ...userDocument } = userInformation;
        const babyTempCollection: Baby[] = [];
        const addBabyDocumentToCollection = userInformation.babyCollection.map(
          async (babyData) => {
            const babySnapshot = await addDoc(
              motherBabyCollectionRef,
              babyData
            );
            const babyCurrentProgress = {
              cratedAt: babyCreatedAt,
              week: babyData.gestationAge,
              weight: babyData.currentWeight,
              length: babyData.currentLength,
            };
            babyTempCollection.push({
              id: babySnapshot.id,
              ...babyData,
            });
            const babyProgressCollectionRef = collection(
              babySnapshot,
              FirebaseCollection.PROGRESS
            );
            await addDoc(babyProgressCollectionRef, babyCurrentProgress);
          }
        );
        const hospitalDocument = (await getDoc(hospitalDocumentRef)).data();
        if (hospitalDocument) {
          await Promise.all([
            await setDoc(userDocumentRef, userDocument),
            await setDoc(motherDocumentRef, { hospital: hospitalDocument }),
            ...addBabyDocumentToCollection,
          ]).then(async () => {
            await updateDoc(hospitalDocumentRef, {
              motherCollection: arrayUnion(motherDocumentRef),
            });
            const userSavedInformation: Mother = {
              ...userInformation,
              hospital: hospitalDocument as Hospital,
              uid: credential.user.uid,
              babyCollection: babyTempCollection,
            };
            dispatch(setUserData(userSavedInformation));
          });
        }
      }
    });
  });
});
