import { AnyAction } from 'redux';
import {
    fetchAuthenticationRequest,
    fetchUserSuccess,
    fetchMotherSuccess,
    fetchNurseSuccess,
    clearAuthenticationDataSuccess,
    fetchAutheticationError
} from '.';
import { auth, firestore } from '../../../../firebaseConfig';

import { RootState } from '../../types'
import { ThunkAction } from 'redux-thunk'
import { signInAnonymously, signOut } from 'firebase/auth/react-native';

import { signInWithCredential } from "firebase/auth";
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { User } from './types';

export const loginUser = (
): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> =>
    async dispatch => {
        dispatch(fetchAuthenticationRequest())
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
                dispatch(fetchAutheticationError())
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
            dispatch(fetchAuthenticationRequest())
            // sign out account
            signOut(auth)
                .then(() => {
                    // clear data from local storage
                    dispatch(clearAuthenticationDataSuccess())
                })
                .catch((error) => {
                    throw error
                })
        } catch (error) {
            // save error message
            dispatch(fetchAutheticationError());
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
        dispatch(fetchAuthenticationRequest())
        await signInWithCredential(auth, credential)
            .then((result) => {
                let userInformation: User = {
                    displayName: result.user.displayName as string,
                    email: result.user.email as string,
                    userType: "guest",
                    isAnonymous: false,
                    userRole: "mother"
                }
                // get user based on user uid
                onSnapshot(doc(firestore, 'users', result.user.uid), async (user) => {
                    // check is user exist
                    if (!user.exists()) {
                        // if not create new user
                        await setDoc(doc(firestore, 'users', result.user.uid), {
                            userInformation
                        })
                    } else {
                        // save userInformation data from cloud firestore
                        userInformation = { ...userInformation, ...user.data() }
                    }
                })
                // save user data to local storage
                dispatch(fetchUserSuccess({ ...result.user, ...userInformation } as User))
            })
            .catch((error) => {
                // if error save error message
                dispatch(fetchAutheticationError(error))
            })
    }






