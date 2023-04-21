import { AnyAction } from "redux";
import {
  fetchAuthenticationRequest,
  setUserData,
  setMotherData,
  fetchAuthenticationError,
  fetchAuthenticationSuccess,
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
  Timestamp,
} from "firebase/firestore";
import { Authentication, Baby, Mother, User } from "./types";

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
                  .catch(() => {
                    throw new Error();
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
                      .then((querySnapshot) => {
                        babyRefID.push(querySnapshot.id);
                        babyCollection.push({
                          ...babyDocument,
                          id: querySnapshot.id,
                          createdAt: Timestamp.fromMillis(
                            babyCreatedAt.getTime()
                          ),
                        });
                      })
                      .catch(() => {
                        throw new Error();
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
                      dispatch(fetchAuthenticationSuccess());
                    })
                    .catch(() => {
                      throw new Error();
                    });
                }
              }
            }
          );
        })
        .catch(() => {
          throw new Error();
        });
    } catch {
      dispatch(fetchAuthenticationError());
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
      dispatch(fetchAuthenticationError());
    }
  };

export const loginWithGoogle =
  (
    credential: OAuthCredential
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
              // save user data to local storage
              dispatch(
                setUserData({
                  uid: result.user.uid,
                  ...userRef.data(),
                })
              );

              // fetch user based on userRole
              const userRole = userRef.get("userRole");
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
                      dispatch(fetchAuthenticationSuccess());
                    }
                  }
                );
              }
            } else {
              const userGoogleInitialData: User = {
                isAnonymous: false,
                userType: "guest",
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
        .catch(() => {
          // if error save error message
          throw new Error();
        });
    } catch {
      dispatch(fetchAuthenticationError());
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
        })
          .then(() => {
            dispatch(setUserData(payload.user));
          })
          .catch(() => {
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
      dispatch(fetchAuthenticationError());
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
      dispatch(fetchAuthenticationError());
    }
  };
