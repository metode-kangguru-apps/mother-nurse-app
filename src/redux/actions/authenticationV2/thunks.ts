import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, FirebaseCollection } from "@redux/types";
import {
  OAuthCredential,
  signInAnonymously,
  signInWithCredential,
} from "firebase/auth/react-native";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { setUserData } from ".";
import { addAllBabyInCollection, fetchAllMotherInHospital } from "./services";
import { auth, firestore } from "../../../../firebaseConfig";

import {
  Mother,
  MotherPayload,
  Nurse,
  NurseResponse,
  User,
  UserResponse,
} from "./types";
import { Baby, BabyPayload } from "../pmkCare/types";
import { Hospital, HospitalResponse } from "../hospital/types";

export const signInUserWithGoogle = createAsyncThunk<
  unknown,
  {
    credential: OAuthCredential;
    selectedUserRole: "mother" | "nurse";
  },
  {
    dispatch: AppDispatch;
  }
>(
  "signInUserWithGoogle",
  async ({ credential, selectedUserRole }, { dispatch }) => {
    const googleUserSnapshot = await signInWithCredential(auth, credential);
    const userDocumentRef = doc(
      firestore,
      FirebaseCollection.USER,
      googleUserSnapshot.user.uid
    );
    const motherDocumentRef = doc(
      firestore,
      FirebaseCollection.MOTHER,
      googleUserSnapshot.user.uid
    );
    const nurseDocumentRef = doc(
      firestore,
      FirebaseCollection.NURSE,
      googleUserSnapshot.user.uid
    );
    const motherBabyCollectionRef = collection(
      motherDocumentRef,
      FirebaseCollection.BABIES
    );

    const userSnapshot = await getDoc(userDocumentRef);
    if (userSnapshot.exists()) {
      const userData = userSnapshot.data() as Partial<User>;
      if (userData.userType === "guest") {
        const savedMotherData: Partial<Mother> = {
          uid: googleUserSnapshot.user.uid,
          ...(userData as UserResponse),
        };
        dispatch(setUserData(savedMotherData))
        console.log("User diharap isi data dulu");
        return;
      } else if (userData.userRole !== selectedUserRole) {
        console.log("User yang terdaftar tidak memiliki role yang sama");
        return;
      } else if (userData.userRole === "mother") {
        const motherData = (await getDoc(motherDocumentRef)).data();
        const babyCollectionSnapshots = (await getDocs(motherBabyCollectionRef))
          .docs;
        const babyTempCollection: Baby[] = [];
        if (babyCollectionSnapshots.length && motherData) {
          babyCollectionSnapshots.map((babySnapshot) => {
            babyTempCollection.push({
              id: babySnapshot.id,
              ...(babySnapshot.data() as BabyPayload),
            });
          });
          const savedMotherData: Mother = {
            uid: googleUserSnapshot.user.uid,
            babyCollection: babyTempCollection,
            hospital: motherData.hospital,
            ...(userData as UserResponse),
          };
          dispatch(setUserData(savedMotherData));
          return
        } else {
          console.log("Terjadi kesalahan saat masuk, coba lain kali.");
          return;
        }
      } else if (userData.userRole === "nurse") {
        const nurseData = (
          await getDoc(nurseDocumentRef)
        ).data() as NurseResponse;
        if (nurseData) {
          const hospitalData = (
            await getDoc(nurseData.hospital)
          ).data() as HospitalResponse;
          if (hospitalData) {
            const motherTempCollection: Mother[] = [];
            await Promise.all([
              ...fetchAllMotherInHospital(hospitalData, motherTempCollection),
            ]);
            const saveNurseData: Nurse = {
              uid: googleUserSnapshot.user.uid,
              hospital: {
                ...hospitalData,
                motherCollection: motherTempCollection,
              },
              ...(userData as UserResponse),
            };
            dispatch(setUserData(saveNurseData));
            return
          } else {
            console.log("Terjadi kesalahan saat masuk, Coba lagi nanti.");
            return;
          }
        } else {
          console.log("Terjadi kesalahan saat masuk, Coba lagi nanti.");
          return;
        }
      }
    } else {
      const googleUserInitialData: Partial<User> = {
        isAnonymous: false,
        userType: "guest",
        userRole: selectedUserRole,
      };
      await setDoc(userDocumentRef, googleUserInitialData).then(() => {
        dispatch(
          setUserData({
            uid: googleUserSnapshot.user.uid,
            ...googleUserInitialData,
          })
        );
      });
    }
  }
);

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
    await getDoc(userDocumentRef).then(async (userSnapshot) => {
      if (!userSnapshot.exists()) {
        const { hospital, babyCollection, ...userDocument } = userInformation;
        const babyTempCollection: Baby[] = [];
        const hospitalDocument = (await getDoc(hospitalDocumentRef)).data();
        if (hospitalDocument) {
          await Promise.all([
            await setDoc(userDocumentRef, userDocument),
            await setDoc(motherDocumentRef, { hospital: hospitalDocument }),
            ...addAllBabyInCollection(
              userInformation.babyCollection,
              babyTempCollection,
              motherBabyCollectionRef
            ),
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
      } else {
        console.log("Terjadi masalah saat membuat akun. Coba lagi.")
      }
    });
  });
});
