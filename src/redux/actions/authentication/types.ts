import { Timestamp } from "firebase/firestore";

export type User = {
  displayName?: string;
  uid?: string;
  isAnonymous: boolean;
  userType: "guest" | "member";
  userRole?: "mother" | "nurse";
};

export type Mother = {
  id?: string;
  phoneNumber?: string;
  babyRoomCode?: string;
  babyCollection: Baby[] | undefined;
};

export type Baby = {
  id?: string;
  displayName?: string;
  gestationAge?: number;
  birthDate?: string;
  weight?: number;
  length?: number;
  currentWeight?: number;
  currentLength?: number;
  currentWeek?: number;
  createdAt?: Date | Timestamp;
  gender?: "laki-laki" | "perempuan";
};

export type Nurse = {};

export type Authentication = {
  user: User | undefined;
  mother: Mother | undefined;
  nurse: Nurse | undefined;
  loading?: boolean;
  error?: boolean;
};

export interface MotherAnonymSignInPayload extends User {
  phoneNumber: number;
  hospitalCode: string;
}
