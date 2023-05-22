import { DocumentReference } from "firebase/firestore";
import { Mother } from "../authentication/types";

export type Hospital = {
  name: string;
  bangsal: string;
};

export interface HospitalWithMother extends Hospital {
  motherCollection: Mother[];
}

export type HospitalInitialState = {
    loading: boolean,
    selectedHospital: HospitalPayload | undefined,
    hospitalList: HospitalPayload[]
    error: boolean,
    message: string
}

// Payload
export type HospitalPayload = {
  key: string;
  value: string;
};

// Response
export interface HospitalResponse extends Hospital {
  motherCollection: DocumentReference[]
}