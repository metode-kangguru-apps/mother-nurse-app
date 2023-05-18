import { NavigatorScreenParams } from "@react-navigation/native";

export type MotherStackParamList = {
  home: undefined;
  "select-baby": undefined;
  profile: undefined;
  monitoring: undefined;
  "add-progress": undefined;
  "pmk-care": undefined;
  history: undefined;
  module: undefined;
  "add-new-baby": undefined
};

export type NurseStackParamList = {
  profile: undefined;
  "mother-detail": undefined
  "baby-detail": undefined
  "history-progress": undefined
  "add-progress": undefined
};

export type AuthStackParamList = {
  login: undefined;
  "register-user-information": undefined;
  "register-baby-information": undefined;
  "register-nurse-information": undefined;
};

export type RootStackParamList = {
  auth: NavigatorScreenParams<AuthStackParamList>;
  mother: NavigatorScreenParams<MotherStackParamList>;
  nurse: NavigatorScreenParams<NurseStackParamList>
  NotFound: undefined;
};
