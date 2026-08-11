import { AppDispatch, FirebaseCollection } from "@redux/types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDoc, getDocs, query, where } from "firebase/firestore";

import { firestore } from "../../../../firebaseConfig";
import { titleCase } from "src/lib/utils/string";
import { HospitalPayload } from "./types";
import { setHospitalList } from ".";

export const getHospitalList = createAsyncThunk<
  unknown,
  string,
  {
    dispatch: AppDispatch;
  }
>("getHospitalList", async (payload, { dispatch }) => {
  const hospitalCollectionRef = collection(
    firestore,
    FirebaseCollection.HOSPITAL
  );
  const getHospitalQuery = query(
    hospitalCollectionRef,
    where("name", ">=", titleCase(payload)),
    where("name", "<=", titleCase(payload) + "\uf8ff")
  );
  const hospitals = (await getDocs(getHospitalQuery)).docs;
  if (hospitals.length) {
    const hospitalTempList: HospitalPayload[] = [];
    hospitals.forEach((hospitalSnapshot) => {
      const hospitalData = hospitalSnapshot.data();
      hospitalTempList.push({
        key: `${hospitalData.name} - ${hospitalData.bangsal}`,
        value: hospitalSnapshot.id,
      });
    });
    dispatch(setHospitalList(hospitalTempList));
  }
});
