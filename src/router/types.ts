import { NavigatorScreenParams } from "@react-navigation/native"

export type MotherStackParamList = {
    "list-note": undefined
    "add-note": undefined
}

export type AuthStackParamList = {
    "login": undefined
    "register-user-information": undefined
    "logout": undefined
}

export type RootStackParamList = {
    "auth": NavigatorScreenParams<AuthStackParamList>
    "mother": NavigatorScreenParams<MotherStackParamList>
};

