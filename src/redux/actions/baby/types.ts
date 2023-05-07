import { Timestamp } from "firebase/firestore"

export interface BabyProgressPayload extends Progress {
    babyID: string,
}

export type Progress = {
    createdAt? : Timestamp
    week: number,
    weight: number,
    length: number,
    temperature: number
}

export type BabyState = {
    loading: boolean,
    progress: Progress[],
    error: boolean
}