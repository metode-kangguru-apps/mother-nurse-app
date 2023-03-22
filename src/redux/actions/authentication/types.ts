type TokenManager = {
    refreshToken: string
    accessToken: string
    expiredTime: number
}

export type User = {
    displayName?: string,
    email?: string
    uid?: string
    stsTokenManager?: TokenManager
    isAnonymous: boolean
    userType: "guest" | "member"
    userRole?: "mother" | "nurse"
}

export type Mother = {
    phoneNumber?: string
    babyRoomCode?: string
    babyCollection?: Baby[]
}

export type Baby = {
    displayName?: string
    gestationAge?: string
    birthDate?: string
    weight?: number
    length?: number
    gender?: "laki-laki" | "perempuan"
}

export type Nurse = {

}

export type Authetication = {
    user: User | undefined
    mother: Mother | undefined
    nurse: Nurse | undefined
    loading: boolean
    error: boolean
}