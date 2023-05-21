import { createAsyncThunk } from "@reduxjs/toolkit";
import { AppDispatch, FirebaseCollection } from "@redux/types";
import {
  OAuthCredential,
  UserCredential,
  signInAnonymously,
  signInWithCredential,
  signOut,
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
import { persistor } from "@redux/store";

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
        dispatch(setUserData(savedMotherData));
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
          return;
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
            return;
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

export const signUpMotherAccount = createAsyncThunk<
  unknown,
  {
    uid: string;
    payload: MotherPayload;
  },
  {
    dispatch: AppDispatch;
  }
>("signUpMotherAccount", async ({ uid, payload }, { dispatch }) => {
  const userInformation = payload;
  let credential = {} as UserCredential;
  let userID = uid || "";
  if (userInformation.isAnonymous) {
    credential = await signInAnonymously(auth);
    userID = credential.user.uid;
  }
  const userDocumentRef = doc(firestore, FirebaseCollection.USER, userID);
  const motherDocumentRef = doc(firestore, FirebaseCollection.MOTHER, userID);
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
    if (
      !userSnapshot.exists() ||
      (userSnapshot.exists() &&
        (userSnapshot.data() as User).userType === "guest")
    ) {
      const { hospital, babyCollection, ...userDocument } = userInformation;
      const babyTempCollection: Baby[] = [];
      const hospitalDocument = (
        await getDoc(hospitalDocumentRef)
      ).data() as Hospital;
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
            uid: userID,
            babyCollection: babyTempCollection,
            hospital: {
              name: hospitalDocument.name,
              bangsal: hospitalDocument.bangsal,
            },
          };
          dispatch(setUserData(userSavedInformation));
        });
      }
    } else {
      console.log("Terjadi masalah saat membuat akun. Coba lagi.");
    }
  });
});

export const signUpMotherWithGoogle = createAsyncThunk<
  unknown,
  MotherPayload,
  {
    dispatch: AppDispatch;
  }
>("signUpMotherWithGoogle", async () => {});

export const logingOutUser = createAsyncThunk<
  unknown,
  undefined,
  {
    dispatch: AppDispatch;
  }
>("logingOutUser", async (_, { dispatch }) => {
  await signOut(auth).then(() => {
    dispatch({ type: "CLEAR_SESSION" });
    persistor.purge();
  });
});
