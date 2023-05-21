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
  NursePayload,
  NurseResponse,
  User,
  UserResponse,
} from "./types";
import { Baby, BabyPayload } from "../pmkCare/types";
import { HospitalResponse } from "../hospital/types";
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
    // preparation
    const googleUserSnapshot = await signInWithCredential(auth, credential);

    // create document & collection reference
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

    // start signing in
    const userSnapshot = await getDoc(userDocumentRef);
    if (userSnapshot.exists()) {
      // if user exist get data
      const userData = userSnapshot.data() as UserResponse;
      if (userData.userType === "guest") {
        // if user still guest ask for create account as member
        const savedUserData: User = {
          uid: googleUserSnapshot.user.uid,
          ...(userData as UserResponse),
        };
        dispatch(setUserData(savedUserData));
        console.log("User diharap isi data dulu");
        return;
      } else if (userData.userRole !== selectedUserRole) {
        // if user role not match (mother signing in as nurse or otherwise)
        console.log("User yang terdaftar tidak memiliki role yang sama");
        return;
      } else if (userData.userRole === "mother") {
        // if user is mother
        const motherData = (await getDoc(motherDocumentRef)).data();
        const babyCollectionSnapshots = (await getDocs(motherBabyCollectionRef))
          .docs;
        const babyTempCollection: Baby[] = [];
        if (babyCollectionSnapshots.length && motherData) {
          // get all baby data from collection
          babyCollectionSnapshots.map((babySnapshot) => {
            babyTempCollection.push({
              id: babySnapshot.id,
              ...(babySnapshot.data() as BabyPayload),
            });
          });
          // saved mother data to redux state
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
        // if user is nurse
        const nurseData = (
          await getDoc(nurseDocumentRef)
        ).data() as NurseResponse;

        if (nurseData) {
          const hospitalData = (
            await getDoc(nurseData.hospital)
          ).data() as HospitalResponse;

          if (hospitalData) {
            // get hospital data
            const { motherCollection, ...savedHospitalData } = hospitalData;
            const motherTempCollection: Mother[] = [];

            // get all mother from hospital
            await Promise.all([
              ...fetchAllMotherInHospital(hospitalData, motherTempCollection),
            ]);

            // save nurse data to redux
            const saveNurseData: Nurse = {
              uid: googleUserSnapshot.user.uid,
              hospital: {
                ...savedHospitalData,
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
      // if user not exist, create user and set as guest
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
  // preparation
  const userInformation = payload;
  let credential = {} as UserCredential;
  let userID = uid || "";
  if (userInformation.isAnonymous) {
    credential = await signInAnonymously(auth);
    userID = credential.user.uid;
  }

  // create all document reference
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

  // get user data and start signing up user
  await getDoc(userDocumentRef).then(async (userSnapshot) => {
    if (
      !userSnapshot.exists() ||
      (userSnapshot.exists() &&
        (userSnapshot.data() as User).userType === "guest")
    ) {
      // if user not exist or user google but still guest
      const babyTempCollection: Baby[] = [];
      const { hospital, babyCollection, ...userDocument } = userInformation;

      // get hospital data
      const hospitalData = (
        await getDoc(hospitalDocumentRef)
      ).data() as HospitalResponse;

      // set user data, mother data, get all baby collection
      if (hospitalData) {
        const { motherCollection, ...savedMotherHospitalData } = hospitalData;
        await Promise.all([
          await setDoc(userDocumentRef, userDocument),
          await setDoc(motherDocumentRef, {
            hospital: savedMotherHospitalData,
          }),
          ...addAllBabyInCollection(
            userInformation.babyCollection,
            babyTempCollection,
            motherBabyCollectionRef
          ),
        ]).then(async () => {
          // add new mother to hospital mother collection
          await updateDoc(hospitalDocumentRef, {
            motherCollection: arrayUnion(motherDocumentRef),
          });
          // save mother data to redux state
          const userSavedInformation: Mother = {
            ...userInformation,
            uid: userID,
            babyCollection: babyTempCollection,
            hospital: savedMotherHospitalData,
          };
          dispatch(setUserData(userSavedInformation));
        });
      }
    } else {
      console.log("Terjadi masalah saat membuat akun. Coba lagi nanti!");
    }
  });
});

export const signUpNurseAccount = createAsyncThunk<
  unknown,
  NursePayload,
  { dispatch: AppDispatch }
>("singUpNurseAccount", async (payload, { dispatch }) => {
  const { hospital, uid, ...userData } = payload;

  // create document reference
  const userDocumentRef = doc(firestore, FirebaseCollection.USER, payload.uid);
  const hospitalDocumentRef = doc(
    firestore,
    FirebaseCollection.HOSPITAL,
    payload.hospital.value
  );
  const nurseDocumentRef = doc(
    firestore,
    FirebaseCollection.NURSE,
    payload.uid
  );

  // get hospital data
  const hospitalData = (
    await getDoc(hospitalDocumentRef)
  ).data() as HospitalResponse;

  // set user data, nurse data, and get all mother in hospital
  if (hospitalData) {
    const motherTempCollection: Mother[] = [];
    const { motherCollection, ...savedHospitalData } = hospitalData;
    await Promise.all([
      await setDoc(userDocumentRef, userData),
      await setDoc(nurseDocumentRef, { hospital: hospitalDocumentRef }),
      ...fetchAllMotherInHospital(hospitalData, motherTempCollection),
    ]);
    // save all data to redux state
    const saveNurseData: Nurse = {
      uid: payload.uid,
      hospital: {
        ...savedHospitalData,
        motherCollection: motherTempCollection,
      },
      ...(userData as UserResponse),
    };
    dispatch(setUserData(saveNurseData));
  } else {
    console.log("Terjadi kesalahan saat mendaftarkan perawat!");
  }
});

export const logingOutUser = createAsyncThunk<
  unknown,
  undefined,
  {
    dispatch: AppDispatch;
  }
>("logingOutUser", async (_, { dispatch }) => {
  // loging out user and clear session
  await signOut(auth).then(() => {
    dispatch({ type: "CLEAR_SESSION" });
    persistor.purge();
  });
});
