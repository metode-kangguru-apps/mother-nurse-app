import { Hospital, HospitalPayload, HospitalWithMother } from "../hospital/types";
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

export type InitialState = {
  user: Mother | Nurse | undefined;
  loading: boolean;
  error: boolean;
  message: string;
};

// payload

export interface MotherPayload extends Omit<User, "uid"> {
  babyCollection: Omit<Baby, "id">[];
  hospital: HospitalPayload;
}
