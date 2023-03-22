import { NavigatorScreenParams } from "@react-navigation/native"

export type MotherStackParamList = {
    "home": {
        "baby-id": string | undefined
    },
    "select-baby": undefined
}

export type AuthStackParamList = {
    "login": undefined
    "register-user-information": undefined
    "register-baby-information": undefined
    "logout": undefined
}

export type RootStackParamList = {
    "auth": NavigatorScreenParams<AuthStackParamList>
    "mother": NavigatorScreenParams<MotherStackParamList>
};

