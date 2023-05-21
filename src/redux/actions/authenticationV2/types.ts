import { DocumentReference } from "firebase/firestore";
import {
  Hospital,
  HospitalPayload,
  HospitalWithMother,
} from "../hospital/types";
import { Baby } from "../pmkCare/types";

export type User = {
  uid: string;
  isAnonymous: boolean;
  userType: "guest" | "member";
  userRole: "mother" | "nurse";
  displayName: string;
  phoneNumber: string;
};

export interface Mother extends User {
  hospital: Hospital;
  babyCollection: Baby[];
}

export interface Nurse extends User {
  hospital: HospitalWithMother;
}

export type UserInitialState = {
  user: Mother | Nurse | undefined;
  loading: boolean;
  error: boolean;
  message: string;
};

// Payload
export interface MotherPayload extends Omit<User, "uid"> {
  babyCollection: Omit<Baby, "id">[];
  hospital: HospitalPayload;
}

export interface NursePayload extends Omit<Nurse, "hospital"> {
  hospital: HospitalPayload;
}

// Response

export interface UserResponse extends Omit<User, "uid"> {}

export interface MotherResponse {
  hospital: Hospital;
}
export interface NurseResponse {
  hospital: DocumentReference;
}
