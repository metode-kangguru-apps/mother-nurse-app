import { Timestamp } from "firebase/firestore";

export type Baby = {
  id: string;
  displayName: string;
  gender: "laki-laki" | "perempuan";
  gestationAge: number;
  birthDate: string;
  weight: number;
  length: number;
  currentWeight: number;
  currentLength: number;
  currentWeek: number;
  createdAt: Date | Timestamp;
};

export type Progress = {
  createdAt: Timestamp;
  week: number;
  weight: number;
  length: number;
  temperature: number;
};

export type Session = {
  createdAt: string;
  duration: string;
};

export type PMKCareInitialState = {
  baby: Baby;
  progress: Progress;
  session: Session;
  loading: boolean;
  error: boolean;
  message: string;
};

// Payload
export type BabyPayload = Omit<Baby, "id">

// Response
export type BabyResponse = BabyPayload