import { AnyAction } from "redux";
import {
  fetchAuthenticationRequest,
  fetchUserSuccess,
  fetchMotherSuccess,
  fetchNurseSuccess,
  clearAuthenticationDataSuccess,
  fetchAutheticationError,
} from ".";
import { auth, firestore } from "../../../../firebaseConfig";

import { RootState } from "../../types";
import { ThunkAction } from "redux-thunk";
import {
  OAuthCredential,
  signInAnonymously,
  signOut,
} from "firebase/auth/react-native";

import { signInWithCredential } from "firebase/auth";
import {
  doc,
  onSnapshot,
  setDoc,
  addDoc,
  collection,
  getDoc,
} from "firebase/firestore";
import { AutheticationPayload, User } from "./types";

export const loginUser =
  (
    payload: AutheticationPayload
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    dispatch(fetchAuthenticationRequest());
    signInAnonymously(auth)
      .then((credential) => {
        let userInformation: AutheticationPayload = payload;
        // get user data from firestore cloud
        onSnapshot(
          doc(firestore, "users", credential.user.uid),
          async (user) => {
            // check if user exist
            if (!user.exists()) {
              // if not exist create new user
              await setDoc(
                doc(firestore, "users", credential.user.uid),
                userInformation.user
              );
              // set new baby ref for mother
              const babyRefDocs: any[] = [];
              if (userInformation.mother?.babyCollection) {
                for (const baby of userInformation.mother?.babyCollection) {
                  // add new baby
                  const newBabyRef = await addDoc(
                    collection(firestore, "babies"),
                    baby
                  );
                  const newBabyId = newBabyRef.id;
                  babyRefDocs.push(newBabyId);
                }
                // add mother with baby collections
                const motherDocRef = doc(
                  firestore,
                  "mothers",
                  credential.user.uid
                );
                const data = {
                  phoneNumber: userInformation.mother.phoneNumber,
                  babyRoomCode: userInformation.mother.babyRoomCode,
                  babyRefs: babyRefDocs,
                };
                await setDoc(motherDocRef, data);
              }

              // get mother data
              const ref = doc(firestore, "mothers", credential.user.uid);
              const mother = await getDoc(ref);

              // set user data
              dispatch(
                fetchUserSuccess({
                  ...userInformation.user,
                  uid: credential.user.uid,
                })
              );
              dispatch(fetchMotherSuccess({ ...mother.data() }));
            }
          }
        );
      })
      .catch((error) => {
        // save error message
        dispatch(fetchAutheticationError());
        throw error;
      });
  };

export const logOutUser =
  (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    const data: any[] = [];
    try {
      // set loading for request
      dispatch(fetchAuthenticationRequest());
      // sign out account
      signOut(auth)
        .then(() => {
          // clear data from local storage
          dispatch(clearAuthenticationDataSuccess());
        })
        .catch((error) => {
          throw error;
        });
    } catch (error) {
      // save error message
      dispatch(fetchAutheticationError());
    }
  };

export const loginWithGoogle =
  (
    credential: OAuthCredential
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    // save fetch request loading
    dispatch(fetchAuthenticationRequest());
    await signInWithCredential(auth, credential)
      .then((result) => {
        // get user based on user uid
        onSnapshot(doc(firestore, "users", result.user.uid), async (user) => {
          // check is user exist
          if (user.exists()) {
            // if exist get user and user data
            const userRef = await getDoc(
              doc(firestore, "users", result.user.uid)
            );
            // save user data to local storage
            dispatch(fetchUserSuccess(userRef.data()));

            // fetch user based on userRole
            const userRole = userRef.get("userRole");
            if (userRole === "mother") {
              const motherRef = await getDoc(
                doc(firestore, "mothers", result.user.uid)
              );
              dispatch(fetchMotherSuccess(motherRef.data()));
            }
          } else {
            const userGoogleInitialData: User = {
              isAnonymous: false,
              userType: "guest",
            };
            await setDoc(
              doc(firestore, "users", result.user.uid),
              userGoogleInitialData
            );
            // set new baby ref for mother
            dispatch(
              fetchUserSuccess({
                ...userGoogleInitialData,
                uid: result.user.uid,
              })
            );
          }
        });
      })
      .catch((error) => {
        // if error save error message
        dispatch(fetchAutheticationError(error));
      });
  };

export const signUpMotherWithGoogle =
  (
    payload: AutheticationPayload
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    // save fetch request loading
    dispatch(fetchAuthenticationRequest());
    if (payload.user && payload.user.uid) {
      await setDoc(doc(firestore, "users", payload.user.uid), {
        displayName: payload.user.displayName,
        userRole: payload.user.userRole,
        userType: payload.user.userType,
        isAnonymous: payload.user.isAnonymous,
      });
      // set new baby ref for mother
      const babyRefDocs: any[] = [];
      if (payload.mother?.babyCollection) {
        for (const baby of payload.mother?.babyCollection) {
          // add new baby
          const newBabyRef = await addDoc(
            collection(firestore, "babies"),
            baby
          );
          const newBabyId = newBabyRef.id;
          babyRefDocs.push(newBabyId);
        }
        // add mother with baby collections
        const motherDocRef = doc(firestore, "mothers", payload.user.uid);
        const data = {
          phoneNumber: payload.mother.phoneNumber,
          babyRoomCode: payload.mother.babyRoomCode,
          babyRefs: babyRefDocs,
        };
        await setDoc(motherDocRef, data);
      }

      // get mother data
      const ref = doc(firestore, "mothers", payload.user.uid);
      const mother = await getDoc(ref);

      // set user data
      dispatch(
        fetchUserSuccess({
          ...payload.user,
        })
      );
      dispatch(fetchMotherSuccess({ ...mother.data() }));
    }
  };
