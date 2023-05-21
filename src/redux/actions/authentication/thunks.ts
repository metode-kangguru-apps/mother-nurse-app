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

import { AppDispatch, RootState } from "../../types";
import { ThunkAction } from "redux-thunk";
import {
  OAuthCredential,
  signInAnonymously,
  signOut,
} from "firebase/auth/react-native";

import { linkWithCredential, signInWithCredential } from "firebase/auth";
import {
  doc,
  setDoc,
  addDoc,
  collection,
  getDoc,
  Timestamp,
  updateDoc,
  arrayUnion,
  getDocs,
  DocumentReference,
} from "firebase/firestore";
import {
  AddBabyPayload,
  AuthenticationState,
  Baby,
  Mother,
  User,
} from "./types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { persistor } from "@redux/store";
import { BabyStatus } from "../baby/types";

export const loginUser =
  (
    payload: AuthenticationState
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    dispatch(fetchAuthenticationRequest());
    try {
      signInAnonymously(auth)
        .then((credential) => {
          let userInformation: AuthenticationState = payload;
          // get user data from firestore cloud
          getDoc(doc(firestore, "users", credential.user.uid)).then(
            async (user) => {
              // check if user not exist
              if (!user.exists()) {
                // create new user with id cred uid
                await setDoc(
                  doc(firestore, "users", credential.user.uid),
                  userInformation.user
                )
                  .then(() => {
                    // set user data to redux
                    dispatch(
                      setUserData({
                        ...userInformation.user,
                        uid: credential.user.uid,
                      })
                    );
                  })
                  .catch((error) => {
                    throw new Error(error);
                  });

                // add all baby doc to firebase
                const babyRefID: any[] = [];
                const babyCollection: Baby[] = [];
                if (
                  userInformation.mother?.babyCollection &&
                  payload.mother?.hospital
                ) {
                  const babyCreatedAt = new Date();
                  for (const baby of userInformation.mother.babyCollection) {
                    const babyDocument = {
                      createdAt: babyCreatedAt,
                      currentStatus: BabyStatus.ON_PROGRESS,
                      ...baby,
                    };
                    // add baby document
                    await addDoc(collection(firestore, "babies"), babyDocument)
                      .then(async (querySnapshot) => {
                        babyRefID.push(querySnapshot);
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
                  const hospitalRef = doc(
                    firestore,
                    "hospitals",
                    payload.mother?.hospital.value
                  );
                  const motherData = {
                    ...userInformation.mother,
                    displayName: userInformation.user?.displayName,
                    babyCollection: babyRefID,
                    hospital: (await getDoc(hospitalRef)).data(),
                  };
                  const motherRef = doc(
                    firestore,
                    "mothers",
                    credential.user.uid
                  );
                  await setDoc(motherRef, motherData)
                    .then(async () => {
                      dispatch(
                        setMotherData({
                          ...motherData,
                          babyCollection,
                        })
                      );
                      dispatch(fetchAuthenticationSuccess());
                      const motherCollection = collection(
                        hospitalRef,
                        "mothers"
                      );
                      await addDoc(motherCollection, {
                        motherRef: motherRef,
                      });
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
          persistor.purge();
        })
        .catch(() => {
          throw new Error();
        });
    } catch {
      dispatch(fetchAuthenticationError(""));
    }
  };

export const loginWithGoogle =
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
          getDoc(doc(firestore, "users", result.user.uid)).then(
            async (user) => {
              // check is user exist
              if (user.exists()) {
                // get user data
                const userRef = await getDoc(
                  doc(firestore, "users", result.user.uid)
                );
                const userData = userRef.data();
                // save user data to local storage
                dispatch(
                  setUserData({
                    uid: result.user.uid,
                    ...userData,
                  })
                );

                if (userData?.userType === "guest") {
                  dispatch(fetchAuthenticationSuccess());
                  return;
                }

                // get user rele
                const userRole = userRef.get("userRole");

                // not set user data if role login diff
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
                      if (motherData && motherData.babyCollection) {
                        for (const babyRefID of motherData.babyCollection) {
                          const babySnapshot = await getDoc(babyRefID);
                          babyCollection.push({
                            id: babySnapshot.id,
                            ...(babySnapshot.data() as Baby),
                          });
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
                } else if (userRole === "nurse") {
                  await getDoc(doc(firestore, "nurses", result.user.uid)).then(
                    async (querySnapshot) => {
                      const nursesData = querySnapshot.data();
                      const hospitalData = (
                        await getDoc(nursesData?.hospital)
                      ).data();
                      const motherCollectionRef = collection(
                        nursesData?.hospital,
                        "mothers"
                      );
                      const motherCollection: any[] = [];
                      const mothers = (await getDocs(motherCollectionRef)).docs;
                      const fetchAllMotherAndBaby = mothers.map(
                        async (mother) => {
                          const motherSnapshot = await getDoc(
                            mother.data().motherRef
                          );
                          const motherData = {
                            id: motherSnapshot.id,
                            ...(motherSnapshot.data() as Mother),
                          } as Mother;
                          const babyCollection: any[] = [];
                          const fetchBaby = motherData.babyCollection?.map(
                            async (babyRef) => {
                              const babySnapshot = await getDoc(
                                babyRef as DocumentReference
                              );
                              const babyData = {
                                id: babySnapshot.id,
                                ...babySnapshot.data(),
                              };
                              babyCollection.push(babyData);
                            }
                          );
                          fetchBaby &&
                            (await Promise.all(fetchBaby).then(() => {
                              motherCollection.push({
                                ...motherData,
                                babyCollection,
                              });
                            }));
                        }
                      );
                      await Promise.all(fetchAllMotherAndBaby).then(() => {
                        dispatch(
                          setNurseData({
                            phoneNumber: nursesData?.phoneNumber,
                            hospital: hospitalData,
                            motherCollection,
                          })
                        );
                        dispatch(fetchAuthenticationSuccess());
                      });
                    }
                  );
                }
              } else if (!user.exists()) {
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
            }
          );
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
  (
    payload: AuthenticationState
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
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
        })
          .then(() => {
            dispatch(setUserData(payload.user));
          })
          .catch(() => {
            throw new Error();
          });

        // create all baby and add to firestore
        const babyRefCollection: DocumentReference[] = [];
        const babyCollection: Baby[] = [];
        if (payload.mother?.babyCollection && payload.mother.hospital) {
          const babyCreatedAt = new Date();
          for (const babyData of payload.mother.babyCollection) {
            // add new baby to the collection
            const babyDocument: Baby = {
              createdAt: babyCreatedAt,
              currentStatus: BabyStatus.ON_PROGRESS,
              ...babyData,
            };
            await addDoc(collection(firestore, "babies"), babyDocument)
              .then(async (querySnapshot) => {
                // ref id collection for firebase mother baby collection
                babyRefCollection.push(querySnapshot);
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
          const hospitalRef = doc(
            firestore,
            "hospitals",
            payload.mother.hospital.value
          );
          const motherData = {
            ...payload.mother,
            displayName: payload.user.displayName,
            babyCollection: babyRefCollection,
            hospital: (await getDoc(hospitalRef)).data(),
          };
          const motherRef = doc(firestore, "mothers", payload.user.uid);
          await setDoc(motherRef, motherData)
            .then(async () => {
              dispatch(setMotherData({ ...motherData, babyCollection }));
              dispatch(fetchAuthenticationSuccess());
              const motherCollection = collection(hospitalRef, "mothers");
              await addDoc(motherCollection, {
                motherRef: motherRef,
              });
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
  (
    payload: AuthenticationState
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    dispatch(fetchAuthenticationRequest());
    try {
      if (payload.user && payload.user.uid) {
        // set user docs
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

        // add hospital ref to nurse
        if (payload.nurse && payload.nurse.hospital) {
          const hospitalRef = doc(
            firestore,
            "hospitals",
            payload.nurse.hospital.value
          );
          const hospitalData = (await getDoc(hospitalRef)).data();
          setDoc(doc(firestore, "nurses", payload.user.uid), {
            phoneNumber: payload.nurse.phoneNumber,
            hospital: hospitalRef,
          }).then(async () => {
            const motherCollection: any[] = [];
            const motherCollectionRef = collection(hospitalRef, "mothers");
            const mothers = (await getDocs(motherCollectionRef)).docs;
            // if rumah sakit have mothers collection
            if (mothers.length > 0) {
              const fetchAllMotherAndBaby = mothers.map(async (mother) => {
                const motherSnapshot = await getDoc(mother.data().motherRef);
                const motherData = {
                  id: motherSnapshot.id,
                  ...(motherSnapshot.data() as Mother),
                };
                const babyCollection: any[] = [];
                const fetchBaby = motherData.babyCollection?.map(
                  async (babyRef) => {
                    const babySnapshot = await getDoc(
                      babyRef as DocumentReference
                    );
                    const babyData = {
                      id: babySnapshot.id,
                      ...babySnapshot.data(),
                    };
                    babyCollection.push(babyData);
                  }
                );
                fetchBaby &&
                  (await Promise.all(fetchBaby).then(() => {
                    motherCollection.push({
                      ...motherData,
                      babyCollection,
                    });
                  }));
              });
              await Promise.all(fetchAllMotherAndBaby).then(() => {
                dispatch(
                  setNurseData({
                    displayName: payload.user?.displayName,
                    phoneNumber: payload.nurse?.phoneNumber,
                    hospital: hospitalData,
                    motherCollection,
                  })
                );
                dispatch(fetchAuthenticationSuccess());
              });
            } else {
              dispatch(
                setNurseData({
                  displayName: payload.user?.displayName,
                  phoneNumber: payload.nurse?.phoneNumber,
                  hospital: hospitalData,
                  motherCollection: [],
                })
              );
              dispatch(fetchAuthenticationSuccess());
            }
          });
        }
      }
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
        currentStatus: BabyStatus.ON_PROGRESS,
        ...payload.babyData,
      };
      const motherRef = doc(firestore, "mothers", payload.userId);
      await addDoc(collection(firestore, "babies"), babyDocument)
        .then(async (querySnapshot) => {
          // update mother baby collections
          updateDoc(motherRef, {
            babyCollection: arrayUnion(querySnapshot),
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

export const bindAnonymousAccountToGoogle =
  (
    credential: OAuthCredential
  ): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    try {
      dispatch(fetchAuthenticationRequest());
      if (auth.currentUser) {
        linkWithCredential(auth.currentUser, credential)
          .then(() => {
            if (auth.currentUser?.uid) {
              updateDoc(doc(firestore, "users", auth.currentUser.uid), {
                isAnonymous: false,
              })
                .then(() => {
                  dispatch(setUserData({ isAnonymous: false }));
                  dispatch(fetchAuthenticationSuccess());
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

export const getNurseData = createAsyncThunk<
  unknown,
  string,
  {
    dispatch: AppDispatch;
  }
>("", async (nurseId, { dispatch }) => {
  try {
    dispatch(fetchAuthenticationRequest());
    await getDoc(doc(firestore, "nurses", nurseId)).then(
      async (querySnapshot) => {
        const nurseData = querySnapshot.data();
        const hospitalData = (await getDoc(nurseData?.hospital)).data();
        const motherCollectionRef = collection(nurseData?.hospital, "mothers");
        const motherCollection: any[] = [];
        const mothers = (await getDocs(motherCollectionRef)).docs;
        const fetchAllMotherAndBaby = mothers.map(async (mother) => {
          const motherSnapshot = await getDoc(mother.data().motherRef);
          const motherData = {
            id: motherSnapshot.id,
            ...(motherSnapshot.data() as Mother),
          };
          const babyCollection: any[] = [];
          const fetchBaby = motherData.babyCollection?.map(async (babyRef) => {
            const babySnapshot = await getDoc(babyRef as DocumentReference);
            const babyData = {
              id: babySnapshot.id,
              ...babySnapshot.data(),
            };
            babyCollection.push(babyData);
          });
          fetchBaby &&
            (await Promise.all(fetchBaby).then(() => {
              motherCollection.push({
                ...motherData,
                babyCollection,
              });
            }));
        });
        await Promise.all(fetchAllMotherAndBaby).then(() => {
          dispatch(
            setNurseData({
              phoneNumber: nurseData?.phoneNumber,
              hospital: hospitalData,
              motherCollection,
            })
          );
          dispatch(fetchAuthenticationSuccess());
        });
      }
    );
  } catch {
    dispatch(fetchAuthenticationError(""));
  }
});

export const getMotherData = createAsyncThunk<
  unknown,
  string,
  {
    dispatch: AppDispatch;
  }
>("", async (motherId, { dispatch }) => {
  try {
    dispatch(fetchAuthenticationRequest());
    await getDoc(doc(firestore, "mothers", motherId)).then(
      async (querySnapshot) => {
        const motherData = querySnapshot.data();
        const babyCollection: Baby[] = [];
        if (motherData?.babyCollection) {
          for (const babyRef of motherData.babyCollection) {
            await getDoc(babyRef).then((document) => {
              babyCollection.push({
                ...(document.data() as Baby),
                id: document.id,
              });
            });
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
  } catch (e) {
    dispatch(fetchAuthenticationError(""));
  }
});
