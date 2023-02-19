type TokenManager = {
    refreshToken: string
    accessToken: string
    expiredTime: number
}

export type User = {
    displayName: string
    email: string
    uid: string
    stsTokenManager: TokenManager
    isAnonymous: boolean
    userType?: string
}

export type UserRequest = {
    user: User | undefined;
    loading: boolean;
    error: boolean;
}
