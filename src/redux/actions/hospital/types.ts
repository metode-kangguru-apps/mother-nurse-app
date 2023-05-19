import { Mother } from "../authenticationV2/types";

export type Hospital = {
  name: string;
  bangsal: string;
};

export interface HospitalWithMother extends Hospital {
  motherCollection: Mother[];
}

export type InitialState = {
    loading: boolean,
    selectedHospital: HospitalPayload | undefined,
    hospitalList: HospitalPayload[]
    error: boolean,
    message: string
}

export type HospitalPayload = {
  key: string;
  value: string;
};
