import { collection, getDocs } from 'firebase/firestore';
import { AnyAction } from 'redux';
import { fetchDataError, fetchDataRequest, fetchDataSuccess } from '.';
import { firestore } from '../../../../firebaseConfig';

import { RootState } from '../../types'
import { ThunkAction } from 'redux-thunk'

export const getNotes = (): ThunkAction<
    void,
    RootState,
    unknown,
    AnyAction
> =>
    async dispatch => {
        const data: any[] = []
        try {
            dispatch(fetchDataRequest())
            const querySnapshot = await getDocs(collection(firestore, 'notes'))
            querySnapshot.forEach((note) => {
                data.push(note.data())
            })
            dispatch(fetchDataSuccess(data));
        } catch {
            dispatch(fetchDataError());
        }
    };






