import { Timestamp } from "firebase/firestore";
import { Mother } from "../authentication/types";

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
  currentStatus: string
};

export type Progress = {
  createdAt: Timestamp | Date;
  week: number;
  weight: number;
  length: number;
  temperature?: number;
};

export type Session = {
  createdAt: string;
  duration: string;
};

export type PMKCareInitialState = {
  mother: Mother
  baby: Baby;
  progress: Progress[];
  sessions: Session[];
  loading: boolean;
  error: boolean;
  message: string;
};

export type SelectBabyPayload = Pick<
  PMKCareInitialState,
  "progress" | "sessions" | "baby"
>;

// Payload
export type BabyPayload = Omit<Baby, "id">;
export interface AddProgressBabyPayload extends Progress {
  userID: string;
  babyID: string;
  temperature?: number
  currentStatus: string
}

// Response
export type BabyResponse = BabyPayload;


// Enum
export enum BabyStatus {
  ON_PROGRESS = "Dalam PMK",
  FINNISH = "PMK Selesai",
  WEIGHT_DECREASE = "Berat badan turun",
  TEMP_NOT_NORMAL = "Suhu tubuh"
}