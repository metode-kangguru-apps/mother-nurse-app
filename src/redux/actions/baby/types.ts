import { Timestamp } from "firebase/firestore"

export interface BabyProgressPayload extends Progress {
    babyID: string,
}

export type Progress = {
    createdAt? : Timestamp
    week: number,
    weight: number,
    length: number,
    temperature: number,
    prevWeight: number
}

export type BabyState = {
    loading: boolean,
    progress: Progress[],
    error: boolean
}

export enum BabyStatus {
    ON_PROGRESS = "Dalam PMK",
    FINNISH = "PMK Selesai",
    WEIGHT_DECREASE = "Berat badan turun",
    TEMP_NOT_NORMAL = "Suhu tubuh"
}