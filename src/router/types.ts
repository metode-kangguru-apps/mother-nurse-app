import { NavigatorScreenParams } from "@react-navigation/native";

export type MotherStackParamList = {
  home: undefined
  "select-baby": undefined;
  profile: undefined
};

export type AuthStackParamList = {
  login: undefined;
  "register-user-information": undefined;
  "register-baby-information": undefined;
};

export type RootStackParamList = {
  auth: NavigatorScreenParams<AuthStackParamList>;
  mother: NavigatorScreenParams<MotherStackParamList>;
};
