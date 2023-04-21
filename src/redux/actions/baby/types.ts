export interface BabyProgressPayload extends Progress {
    babyID: string,
}

export type Progress = {
    weight: number,
    length: number,
    temperature: number
}

export type BabyState = {
    loading: boolean,
    progress: Progress[],
    error: boolean
}