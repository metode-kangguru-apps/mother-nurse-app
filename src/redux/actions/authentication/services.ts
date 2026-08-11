import {
  CollectionReference,
  Timestamp,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { FirebaseCollection } from "@redux/types";
import { Mother, MotherResponse, UserResponse } from "./types";
import { HospitalResponse } from "../hospital/types";
import { Baby, BabyPayload, BabyStatus } from "../pmkCare/types";
import { firestore } from "../../../../firebaseConfig";

export function addAllBabyInCollection(
  babyCollection: BabyPayload[],
  babyResultCollection: Baby[],
  motherBabyCollectionRef: CollectionReference
) {
  const babyCreatedAt = new Date();
  return babyCollection.map(async (babyData) => {
    const babySnapshot = await addDoc(motherBabyCollectionRef, babyData);
    const babyCurrentProgress = {
      createdAt: babyCreatedAt,
      week: babyData.gestationAge,
      weight: babyData.currentWeight,
      length: babyData.currentLength,
      currentStatus: BabyStatus.ON_PROGRESS
    };
    const { createdAt, ...savedBabyData } = babyData;
    babyResultCollection.push({
      id: babySnapshot.id,
      createdAt: Timestamp.fromMillis(babyCreatedAt.getTime()),
      ...savedBabyData,
    });
    const babyProgressCollectionRef = collection(
      babySnapshot,
      FirebaseCollection.PROGRESS
    );
    await addDoc(babyProgressCollectionRef, babyCurrentProgress);
  });
}

export function fetchAllMotherInHospital(
  hospitalData: HospitalResponse,
  motherCollection: Mother[]
) {
  return hospitalData.motherCollection.map(
    async (hospitalMotherDocumentRef) => {
      const babyTempCollection: Baby[] = [];
      const babyCollectionRef = collection(
        hospitalMotherDocumentRef,
        FirebaseCollection.BABIES
      );
      const motherSnapshot = await getDoc(hospitalMotherDocumentRef);
      const userDocumentRef = doc(
        firestore,
        FirebaseCollection.USER,
        motherSnapshot.id
      );
      const userData = (await getDoc(userDocumentRef)).data() as UserResponse;
      const motherData = motherSnapshot.data() as MotherResponse;
      const babyCollection = (await getDocs(babyCollectionRef)).docs;
      babyCollection.map((babySnapshot) => {
        if (babySnapshot.exists()) {
          babyTempCollection.push({
            id: babySnapshot.id,
            ...(babySnapshot.data() as BabyPayload),
          });
        }
      });
      if (motherData) {
        motherCollection.push({
          uid: motherSnapshot.id,
          ...userData,
          ...motherData,
          babyCollection: babyTempCollection,
        });
      }
    }
  );
}
