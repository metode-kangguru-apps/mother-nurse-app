import { AnyAction } from "redux";
import {
  fetchAuthenticationRequest,
  setUserData,
  setMotherData,
  fetchAuthenticationError,
  fetchAuthenticationSuccess,
  setNurseData,
  updateMotherBabyCollectionData,
} from ".";
import { auth, firestore } from "../../../../firebaseConfig";

import { RootState } from "../../types";
import { ThunkAction } from "redux-thunk";
import {
  OAuthCredential,
  signInAnonymously,
  signOut,
} from "firebase/auth/react-native";

import { linkWithCredential, signInWithCredential } from "firebase/auth";
import {
  doc,
  onSnapshot,
  setDoc,
  addDoc,
  collection,
  getDoc,
  Timestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { AddBabyPayload, Authentication, Baby, Mother, User } from "./types";

export const loginUser =
  (payload: Authentication): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    dispatch(fetchAuthenticationRequest());
    try {
      signInAnonymously(auth)
        .then((credential) => {
          let userInformation: Authentication = payload;
          // get user data from firestore cloud
          onSnapshot(
            doc(firestore, "users", credential.user.uid),
            async (user) => {
              // check if user not exist
              if (!user.exists()) {
                // create new user with id cred uid
                await setDoc(
                  doc(firestore, "users", credential.user.uid),
                  userInformation.user
                ).catch((error) => {
                  throw new Error(error);
                });

                // add all baby doc to firebase
                const babyRefID: string[] = [];
                const babyCollection: Baby[] = [];
                if (userInformation.mother?.babyCollection) {
                  const babyCreatedAt = new Date();
                  for (const baby of userInformation.mother.babyCollection) {
                    const babyDocument = {
                      createdAt: babyCreatedAt,
                      ...baby,
                    };
                    // add baby document
                    await addDoc(collection(firestore, "babies"), babyDocument)
                      .then(async (querySnapshot) => {
                        babyRefID.push(querySnapshot.id);
                        babyCollection.push({
                          ...babyDocument,
                          id: querySnapshot.id,
                          createdAt: Timestamp.fromMillis(
                            babyCreatedAt.getTime()
                          ),
                        });
                        const progressRef = collection(
                          querySnapshot,
                          "progress"
                        );
                        await addDoc(progressRef, {
                          createdAt: new Date(),
                          week: babyDocument.gestationAge,
                          weight: babyDocument.currentWeight,
                          length: babyDocument.currentLength,
                        }).catch(() => {
                          throw new Error();
                        });
                      })
                      .catch((error) => {
                        throw new Error(error);
                      });
                  }

                  // add mother with baby refs collection id to firebase
                  const motherData = {
                    ...userInformation.mother,
                    babyCollection: babyRefID,
                  };
                  await setDoc(
                    doc(firestore, "mothers", credential.user.uid),
                    motherData
                  )
                    .then(() => {
                      dispatch(
                        setMotherData({
                          ...motherData,
                          babyCollection,
                        })
                      );
                      // set user data to redux
                      dispatch(
                        setUserData({
                          ...userInformation.user,
                          uid: credential.user.uid,
                        })
                      );
                      dispatch(fetchAuthenticationSuccess());
                    })
                    .catch((error) => {
                      throw new Error(error);
                    });
                }
              }
            }
          );
        })
        .catch((error) => {
          throw new Error(error);
        });
    } catch (error) {
      dispatch(fetchAuthenticationError(""));
    }
  };

export const logOutUser =
  (): ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch) => {
    try {
      dispatch(fetchAuthenticationRequest());
      // sign out account
      signOut(auth)
        .then(() => {
          // clear data from local storage
          dispatch({ type: "CLEAR_SESSION" });
          dispatch(fetchAuthenticationSuccess());
        })
        .catch(() => {
          throw new Error();
        });
    } catch {
      dispatch(fetchAuthenticationError(""));
    }
  };

export const loginMotherWithGoogle =
  (
    credential: OAuthCredential,
    selectedUserRole: "mother" | "nurse"
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    dispatch(fetchAuthenticationRequest());
    try {
      await signInWithCredential(auth, credential)
        .then((result) => {
          // get user based on user uid
          onSnapshot(doc(firestore, "users", result.user.uid), async (user) => {
            // check is user exist
            if (user.exists()) {
              // get user data
              const userRef = await getDoc(
                doc(firestore, "users", result.user.uid)
              );

              // fetch user based on userRole
              const userRole = userRef.get("userRole");

              if (userRole !== selectedUserRole) {
                throw Error(
                  "Email yang anda gunakan sepertinya sudah terdaftar pada peran lain"
                );
              }
              if (userRole === "mother") {
                await getDoc(doc(firestore, "mothers", result.user.uid)).then(
                  async (querySnapshot) => {
                    const motherData = querySnapshot.data();
                    const babyCollection: Baby[] = [];
                    if (motherData?.babyCollection) {
                      for (const babyRefID of motherData.babyCollection) {
                        await getDoc(doc(firestore, "babies", babyRefID)).then(
                          (document) => {
                            babyCollection.push({
                              id: document.id,
                              ...document.data(),
                            } as Baby);
                          }
                        );
                      }
                      const savedMotherData: Mother = {
                        ...motherData,
                        babyCollection,
                      };
                      dispatch(setMotherData(savedMotherData));
                      // save user data to local storage
                      dispatch(
                        setUserData({
                          uid: result.user.uid,
                          ...userRef.data(),
                        })
                      );
                      dispatch(fetchAuthenticationSuccess());
                    }
                  }
                );
              }
              dispatch(fetchAuthenticationSuccess());
            } else {
              const userGoogleInitialData: User = {
                isAnonymous: false,
                userType: "guest",
                userRole: selectedUserRole,
              };
              await setDoc(
                doc(firestore, "users", result.user.uid),
                userGoogleInitialData
              )
                .then(() => {
                  dispatch(
                    setUserData({
                      ...userGoogleInitialData,
                      uid: result.user.uid,
                    })
                  );
                  dispatch(fetchAuthenticationSuccess());
                })
                .catch(() => {
                  throw new Error();
                });
            }
          });
        })
        .catch((error) => {
          // if error save error message
          throw new Error(error);
        });
    } catch (error) {
      const errorMessage = new Error(error as string).message;
      dispatch(fetchAuthenticationError(errorMessage));
    }
  };

export const signUpMotherWithGoogle =
  (payload: Authentication): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    dispatch(fetchAuthenticationRequest());
    try {
      if (payload.user && payload.user.uid) {
        // create new user and set to redux
        await setDoc(doc(firestore, "users", payload.user.uid), {
          displayName: payload.user.displayName,
          userRole: payload.user.userRole,
          userType: payload.user.userType,
          isAnonymous: payload.user.isAnonymous,
        }).catch(() => {
          throw new Error();
        });

        // create all baby and add to firestore
        const babyRefCollection: string[] = [];
        const babyCollection: Baby[] = [];
        if (payload.mother?.babyCollection) {
          const babyCreatedAt = new Date();
          for (const babyData of payload.mother.babyCollection) {
            // add new baby to the collection
            const babyDocument: Baby = {
              createdAt: babyCreatedAt,
              ...babyData,
            };
            await addDoc(collection(firestore, "babies"), babyDocument)
              .then(async (querySnapshot) => {
                // ref id collection for firebase mother baby collection
                babyRefCollection.push(querySnapshot.id);
                // data to save in redux
                babyCollection.push({
                  ...babyDocument,
                  id: querySnapshot.id,
                  createdAt: Timestamp.fromMillis(babyCreatedAt.getTime()),
                });
                const progressRef = collection(querySnapshot, "progress");
                await addDoc(progressRef, {
                  createdAt: new Date(),
                  week: babyDocument.gestationAge,
                  weight: babyDocument.currentWeight,
                  length: babyDocument.currentLength,
                }).catch(() => {
                  throw new Error();
                });
              })
              .catch(() => {
                throw new Error();
              });
          }

          // add mother with baby collections and set mother to redux
          const motherData = {
            ...payload.mother,
            babyCollection: babyRefCollection,
          };
          await setDoc(doc(firestore, "mothers", payload.user.uid), motherData)
            .then(() => {
              dispatch(setMotherData({ ...motherData, babyCollection }));
              dispatch(setUserData(payload.user));
              dispatch(fetchAuthenticationSuccess());
            })
            .catch(() => {
              throw new Error();
            });
        }
      } else {
        throw new Error();
      }
    } catch {
      dispatch(fetchAuthenticationError(""));
    }
  };

export const signUpNurseWithGoogle =
  (payload: Authentication): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    dispatch(fetchAuthenticationRequest());
    try {
      if (payload.user && payload.nurse && payload.user.uid) {
        await setDoc(doc(firestore, "users", payload.user.uid), {
          displayName: payload.user.displayName,
          userRole: payload.user.userRole,
          userType: payload.user.userType,
          isAnonymous: payload.user.isAnonymous,
        })
          .then(() => {
            dispatch(setUserData({ ...payload.user }));
          })
          .catch(() => {
            throw new Error();
          });
        await setDoc(doc(firestore, "nurses", payload.user.uid), {
          phoneNumber: payload.nurse.phoneNumber,
          hospitalCode: payload.nurse.hospitalCode,
        })
          .then(() => {
            dispatch(setNurseData({ ...payload.nurse }));
          })
          .catch(() => {
            throw new Error();
          });
        dispatch(fetchAuthenticationSuccess());
      }
    } catch {
      dispatch(fetchAuthenticationError(""));
    }
  };

export const getMotherData =
  (motherId: string): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    dispatch(fetchAuthenticationRequest());
    try {
      await getDoc(doc(firestore, "mothers", motherId)).then(
        async (querySnapshot) => {
          const motherData = querySnapshot.data();
          const babyCollection: Baby[] = [];
          if (motherData?.babyCollection) {
            for (const babyRefID of motherData.babyCollection) {
              await getDoc(doc(firestore, "babies", babyRefID)).then(
                (document) => {
                  babyCollection.push(document.data() as Baby);
                }
              );
            }
            const savedMotherData: Mother = {
              ...motherData,
              babyCollection,
            };
            dispatch(setMotherData(savedMotherData));
            dispatch(fetchAuthenticationSuccess());
          }
        }
      );
    } catch {
      dispatch(fetchAuthenticationError(""));
    }
  };

export const addNewBaby =
  (payload: AddBabyPayload): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    dispatch(fetchAuthenticationRequest());
    try {
      const babyCreatedAt = new Date();
      const babyDocument: Baby = {
        createdAt: babyCreatedAt,
        ...payload.babyData,
      };
      const motherRef = doc(firestore, "mothers", payload.userId);
      await addDoc(collection(firestore, "babies"), babyDocument)
        .then(async (querySnapshot) => {
          // update mother baby collections
          updateDoc(motherRef, {
            babyCollection: arrayUnion(querySnapshot.id),
          });
          babyDocument.id = querySnapshot.id;
          babyDocument.createdAt = Timestamp.fromMillis(
            babyCreatedAt.getTime()
          );

          // add current data as progress
          const progressRef = collection(querySnapshot, "progress");
          await addDoc(progressRef, {
            createdAt: new Date(),
            week: babyDocument.gestationAge,
            weight: babyDocument.currentWeight,
            length: babyDocument.currentLength,
          }).catch(() => {
            throw new Error();
          });
          dispatch(updateMotherBabyCollectionData(babyDocument));
          dispatch(fetchAuthenticationSuccess());
        })
        .catch(() => {
          throw new Error();
        });
    } catch {
      dispatch(fetchAuthenticationError("Bayi gagal ditambah"));
    }
  };

export const bindAnonymousAccoutToGoogle =
  (
    credential: OAuthCredential
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    try {
      dispatch(fetchAuthenticationRequest())
      if (auth.currentUser) {
        linkWithCredential(auth.currentUser, credential)
          .then(() => {
            if (auth.currentUser?.uid) {
              updateDoc(doc(firestore, "users", auth.currentUser.uid), {
                isAnonymous: false,
              })
                .then(() => {
                  dispatch(setUserData({ isAnonymous: false }));
                  dispatch(fetchAuthenticationSuccess())
                })
                .catch(() => {
                  throw new Error();
                });
            }
          })
          .catch(() => {
            throw new Error();
          });
      }
    } catch {
      dispatch(fetchAuthenticationError("Account Google sudah pernah dipakai"));
    }
  };
