import { AnyAction } from "redux";
import { firestore } from "../../../../firebaseConfig";

import { RootState } from "../../types";
import { ThunkAction } from "redux-thunk";

import {
  doc,
  addDoc,
  collection,
  getDocs,
  updateDoc,
  getDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { fetchGlobalError, fetchGlobalRequest, fetchGlobalSuccess, setHospitalList } from ".";
import { Hostpital } from "./type";

export const getHospitalList =
  (payload: string): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    dispatch(fetchGlobalRequest());
    try {
      const hospitalsRef = collection(firestore, "hospitals", payload);
      const hospitalList: Hostpital[] = [];
      await getDocs(hospitalsRef)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            hospitalList.push({
              key: doc.data().name,
              value: doc.id,
            });
          });
          dispatch(setHospitalList(hospitalList))
          dispatch(fetchGlobalSuccess());
        })
        .catch(() => {
          throw new Error();
        });
    } catch {
      dispatch(fetchGlobalError());
    }
  };
