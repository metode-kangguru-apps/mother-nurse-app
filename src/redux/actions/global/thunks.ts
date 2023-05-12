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
  where,
} from "firebase/firestore";
import {
  fetchGlobalError,
  fetchGlobalRequest,
  fetchGlobalSuccess,
  setHospitalList,
} from ".";
import { Hostpital } from "./type";
import { titleCase } from "src/lib/utils/string";

export const getHospitalList =
  (payload: string): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    dispatch(fetchGlobalRequest());
    try {
      const hospitalsRef = collection(firestore, "hospitals");
      const getHospitalQuery = query(
        hospitalsRef,
        where("name", ">=", titleCase(payload)),
        where("name", "<=", titleCase(payload) + "\uf8ff")
      );
      const hospitalList: Hostpital[] = [];
      await getDocs(getHospitalQuery)
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const hospitalData = doc.data()
            hospitalList.push({
              key: `${hospitalData.name} - ${hospitalData.bangsal}` ,
              value: doc.id,
            });
          });
          dispatch(setHospitalList(hospitalList));
          dispatch(fetchGlobalSuccess());
        })
        .catch((error) => {
          throw new Error(error);
        });
    } catch (error) {
      dispatch(fetchGlobalError());
    }
  };
