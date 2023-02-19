import { AnyAction } from 'redux';
import { fetchUserRequest, fetchUserSuccess, fetchUserError, clearDataUserSuccess } from '.';
import { auth, firestore } from '../../../../firebaseConfig';

import { RootState } from '../../types'
import { ThunkAction } from 'redux-thunk'
import { signInAnonymously, signOut } from 'firebase/auth/react-native';

import { signInWithCredential } from "firebase/auth";
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

export const loginUser = (
): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> =>
    async dispatch => {
        dispatch(fetchUserRequest())
        signInAnonymously(auth)
            .then((credential) => {
                let userInformation: any
                // get user data from firestore cloud
                onSnapshot(doc(firestore, 'users', credential.user.uid), async (user) => {
                    // check if user exist
                    if (!user.exists()) {
                        // if not exist create new user
                        await setDoc(doc(firestore, 'users', credential.user.uid), {
                            userType: "mother",
                        })
                    } else {
                        // if exist save user information
                        userInformation = user.data()
                    }
                })
                // set user data
                dispatch(fetchUserSuccess({ ...credential.user, ...userInformation }));
            })
            .catch((error) => {
                // save error message
                dispatch(fetchUserError())
                throw error
            })
    };

export const logOutUser = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> =>
    async dispatch => {
        const data: any[] = []
        try {
            // set loading for request
            dispatch(fetchUserRequest())
            // sign out account
            signOut(auth)
                .then(() => {
                    // clear data from local storage
                    dispatch(clearDataUserSuccess())
                })
                .catch((error) => {
                    throw error
                })
        } catch (error) {
            // save error message
            dispatch(fetchUserError());
        }
    };

export const loginWithGoogle = (
    credential: any
): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> =>
    async dispatch => {
        // save fetch request loading
        dispatch(fetchUserRequest())
        await signInWithCredential(auth, credential)
            .then((result) => {
                let userInformation: any
                // get user based on user uid
                onSnapshot(doc(firestore, 'users', result.user.uid), async (user) => {
                    // check is user exist
                    if (!user.exists()) {
                        // if not create new user
                        await setDoc(doc(firestore, 'users', result.user.uid), {
                            displayName: result.user.displayName,
                            email: result.user.email,
                            userType: "mother",
                        })
                    } else {
                        // save userInformation data from cloud firestore
                        userInformation = user.data()
                    }
                })
                // save user data to local storage
                dispatch(fetchUserSuccess({ ...result.user, ...userInformation }))
            })
            .catch((error) => {
                // if error save error message
                dispatch(fetchUserError(error))
            })
    }






