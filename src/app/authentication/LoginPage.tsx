import {
  FIREBASE_IOS_CLIENT_ID,
  FIREBASE_WEB_CLIENT_ID,
  FIREBASE_ANDROID_CLIENT_ID,
} from "@env";
import { useEffect, useRef, useState } from "react";
import { GoogleAuthProvider } from "firebase/auth/react-native";
import { AuthStackParamList, RootStackParamList } from "src/router/types";

import { Font } from "src/lib/ui/font";
import { Spacing } from "src/lib/ui/spacing";
import { TextSize } from "src/lib/ui/textSize";

import { useAppDispatch } from "@redux/hooks";
import * as WebBrowser from "expo-web-browser";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { loginWithGoogle } from "@redux/actions/authentication/thunks";
import {
  Animated,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import * as Google from "expo-auth-session/providers/google";
import { color } from "src/lib/ui/color";
import { Mother, User } from "@redux/actions/authentication/types";
import { setMotherData, setUserData } from "@redux/actions/authentication";
import { useSelector } from "react-redux";
import { RootState } from "@redux/types";
import { CompositeScreenProps } from "@react-navigation/native";
import GoogleIcon from "src/lib/ui/icons/google";
import FloatingInput from "src/common/FloatingInput";
import PhoneNumberInput from "src/common/PhoneNumberInput";
import { getHospitalList } from "@redux/actions/hospital/thunks";
import PickerFiled from "src/common/PickerField";
import { Hostpital } from "@redux/actions/global/type";

WebBrowser.maybeCompleteAuthSession();

interface Props
  extends CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, "login">,
    NativeStackScreenProps<RootStackParamList>
  > {}

interface FormField {
  name?: string;
  phoneNumber?: string;
  hospital?: Hostpital;
}

const LoginPage: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  const [selectedRegisterRole, setSelectedRegisterRole] = useState<
    "mother" | "nurse"
  >("mother");
  const [motherFormField, setMotherFormField] = useState<FormField>({});
  const [searchHospital, setSearchHospital] = useState<string>("");

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    expoClientId: FIREBASE_WEB_CLIENT_ID,
    webClientId: FIREBASE_WEB_CLIENT_ID,
    iosClientId: FIREBASE_IOS_CLIENT_ID,
    androidClientId: FIREBASE_ANDROID_CLIENT_ID,
  });

  const { user, loading, error, errorMessage } = useSelector(
    (state: RootState) => state.authentication
  );

  const { hospitalList, loading: loadingHospital } = useSelector(
    (state: RootState) => state.global
  );

  const selectedRoleAnimation = useRef(new Animated.Value(0)).current;

  // handle if user login with oAuth google
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      dispatch(loginWithGoogle(credential, selectedRegisterRole));
    }
  }, [response, dispatch]);

  useEffect(() => {
    if (loading || error) {
      // still loading
      return;
    }

    if (user?.userType !== "guest") {
      // login mother
      if (user?.userRole === "mother") {
        navigation.replace("mother", {
          screen: "select-baby",
        });
      }
      return;
    }

    if (user?.userRole === "nurse") {
      // google nurse
      navigation.replace("register-nurse-information");
      return;
    }

    if (user?.isAnonymous) {
      // anonymous mother
      navigation.replace("register-baby-information");
    } else {
      // google mother
      navigation.replace("register-user-information");
    }
  }, [user, loading]);

  useEffect(() => {
    Animated.timing(selectedRoleAnimation, {
      toValue: selectedRegisterRole === "mother" ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [selectedRegisterRole]);

  useEffect(() => {
    dispatch(getHospitalList(searchHospital));
  }, [searchHospital]);

  // handle if user sign-up anonymous
  const handleLoginMotherAnonymously = async () => {
    try {
      if (
        !motherFormField.phoneNumber ||
        !motherFormField.hospital ||
        !motherFormField.name
      ) {
        throw new Error();
      }
      const userAnonymousInitialData: User = {
        displayName: motherFormField.name,
        isAnonymous: true,
        userType: "guest",
        userRole: "mother",
      };
      const motherAnonymousInitialData: Mother = {
        phoneNumber: motherFormField.phoneNumber,
        hospital: motherFormField.hospital as Hostpital,
      };
      dispatch(setUserData(userAnonymousInitialData));
      dispatch(setMotherData(motherAnonymousInitialData));
    } catch {
      return;
    }
  };

  const handleSwitchRoleOnSelect = selectedRoleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Spacing.base * 4.8],
  });

  const handleChangeColorOnSelect = selectedRoleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [color.primary, color.secondary],
  });

  const handleShowMotherRoleOnSelect = selectedRoleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 150],
  });

  const handleOpacityMotherOnSelect = selectedRoleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const handleShowNurseOnSelect = selectedRoleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [150, Spacing.xlarge * 1.5],
  });

  const handleOpacityNurseOnSelect = selectedRoleAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <KeyboardAvoidingView style={style.flex}>
      <ScrollView
        style={style.flex}
        scrollEnabled={selectedRegisterRole === "mother"}
      >
        <Animated.View
          style={[
            style.container,
            { backgroundColor: handleChangeColorOnSelect },
          ]}
        >
          <ImageBackground
            style={style.backgroundPattern}
            source={require("../../../assets/baby-pattern.png")}
          />
          <View style={style.topContent}></View>
          <View style={style.bottomContent}>
            {/* Tab Role Switcher */}
            <View style={style.roleSwitcher}>
              <TouchableOpacity
                onPress={() => setSelectedRegisterRole("mother")}
              >
                <Text style={[style.roleItem, style.mother]}>Ibu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectedRegisterRole("nurse")}
              >
                <Text style={[style.roleItem, style.nurse]}>Perawat</Text>
              </TouchableOpacity>
              <Animated.View
                style={[
                  style.roleItem,
                  style.currentRole,
                  {
                    transform: [{ translateX: handleSwitchRoleOnSelect }],
                    backgroundColor: handleChangeColorOnSelect,
                  },
                ]}
              >
                <Text style={[style.currentRoleTitle]}>
                  {selectedRegisterRole === "mother" ? "Ibu" : "Perawat"}
                </Text>
              </Animated.View>
            </View>
            {/* Tab Title */}
            <Animated.Text style={style.title}>
              {selectedRegisterRole === "mother" ? "Daftar" : "Masuk"}
            </Animated.Text>
            {/* Mother Form Field */}
            <Animated.View
              pointerEvents={
                selectedRegisterRole === "mother" ? "auto" : "none"
              }
              style={[
                style.motherField,
                {
                  transform: [{ translateY: handleShowMotherRoleOnSelect }],
                  opacity: handleOpacityMotherOnSelect,
                },
              ]}
            >
              <View style={style.formFieldWrapper}>
                <View style={style.formField}>
                  <FloatingInput
                    label="Nama"
                    onChange={(value) => {
                      setMotherFormField((prev) => ({
                        ...prev,
                        name: value,
                      }));
                    }}
                  />
                </View>
                <View style={style.formField}>
                  <PhoneNumberInput
                    onChange={(value) => {
                      setMotherFormField((prev) => ({
                        ...prev,
                        phoneNumber: value,
                      }));
                    }}
                  />
                </View>
                <View style={style.formField}>
                  <PickerFiled
                    label="Rumah Sakit"
                    searchable={true}
                    items={hospitalList}
                    onFocus={() => {
                      setSearchHospital("");
                    }}
                    onChange={(value) => {
                      setMotherFormField((prev) => ({
                        ...prev,
                        hospital: value,
                      }));
                    }}
                    onSearch={(value) => {
                      setSearchHospital(value);
                    }}
                  />
                </View>
                <TouchableOpacity
                  style={style.nextButtonContainer}
                  onPress={handleLoginMotherAnonymously}
                >
                  <Text style={style.nextButton}>Selanjutnya</Text>
                </TouchableOpacity>
              </View>
              <View style={style.deviderGoogle}>
                <View style={style.deviderLine}></View>
                <View>
                  <Text style={style.deviderGoogleInfo}>atau masuk dengan</Text>
                </View>
                <View style={style.deviderLine}></View>
              </View>
              <TouchableOpacity
                style={style.loginMotherWithGoogle}
                disabled={!request}
                onPress={() => promptAsync({})}
              >
                <View style={style.googleMotherSectionIcon}>
                  <GoogleIcon width={20} height={20} viewBox="2.5 2.5 20 20" />
                </View>
                <Text style={style.googleMotherSectionButtonTitle}>Google</Text>
              </TouchableOpacity>
            </Animated.View>
            {/* Nurse Form Field */}
            <Animated.View
              pointerEvents={selectedRegisterRole === "nurse" ? "auto" : "none"}
              style={[
                style.nurseField,
                {
                  transform: [{ translateY: handleShowNurseOnSelect }],
                  opacity: handleOpacityNurseOnSelect,
                },
              ]}
            >
              <Text style={style.nurseLoginInfo}>
                Akun perawat akan terhubung dengan akun Google. Masuk dengan
                akun Google Anda untuk mendaftar.{" "}
              </Text>
              <TouchableOpacity
                style={style.loginNurseWithGoogle}
                disabled={!request}
                onPress={() => promptAsync({})}
              >
                <View style={style.googleNurseSectionIcon}>
                  <GoogleIcon width={20} height={20} viewBox="2.5 2.5 20 20" />
                </View>
                <Text style={style.googleNurseSectionButtonTitle}>Google</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Animated.View>
        {/* TODO: @muhammadhafizm implement error */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const style = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    minHeight: Dimensions.get("window").height,
    backgroundColor: color.primary,
  },
  backgroundPattern: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
    opacity: 0.25,
  },
  topContent: {
    width: "100%",
    height: (Dimensions.get("window").height * 30) / 100,
  },
  roleSwitcher: {
    borderWidth: 4,
    borderColor: color.surface,
    backgroundColor: color.surface,
    display: "flex",
    alignSelf: "center",
    flexDirection: "row",
    position: "relative",
    top: -20,
    borderRadius: 50,
  },
  roleItem: {
    paddingVertical: Spacing.tiny,
    paddingHorizontal: Spacing.base * 2,
    fontSize: TextSize.body,
  },
  mother: {
    color: color.secondary,
  },
  nurse: {
    color: color.primary,
  },
  currentRole: {
    backgroundColor: color.primary,
    position: "absolute",
    borderRadius: 30,
  },
  currentRoleTitle: {
    fontSize: TextSize.body,
    color: color.lightneutral,
  },
  bottomContent: {
    flex: 1,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    backgroundColor: color.lightneutral,
    alignItems: "center",
    position: "relative",
    paddingBottom: Spacing.xlarge,
  },
  title: {
    fontFamily: Font.Bold,
    fontSize: TextSize.h6,
    paddingBottom: Spacing.base,
  },
  // mother field
  motherField: {
    flex: 1,
    width: "100%",
  },
  formFieldWrapper: {
    width: "100%",
    paddingHorizontal: Spacing.base,
  },
  formField: {
    paddingVertical: Spacing.extratiny,
  },
  nextButtonContainer: {
    display: "flex",
    alignItems: "center",
    paddingVertical: Spacing.small,
    backgroundColor: color.primary,
    borderRadius: 30,
    marginTop: Spacing.xsmall,
  },
  nextButton: {
    fontFamily: Font.Medium,
    fontSize: TextSize.body,
    color: color.lightneutral,
  },
  deviderGoogle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.base,
    marginBottom: Spacing.tiny,
  },
  deviderLine: {
    width: 100,
    height: 1,
    backgroundColor: color.neutral,
    opacity: 0.4,
    borderRadius: 1,
    marginHorizontal: Spacing.tiny,
  },
  deviderGoogleInfo: {
    fontFamily: Font.Regular,
    fontSize: TextSize.caption,
    color: color.neutral,
    opacity: 0.4,
  },
  loginMotherWithGoogle: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "center",
  },
  googleMotherSectionIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 48,
    height: 48,
    backgroundColor: color.surface,
    borderRadius: Spacing.large,
    marginBottom: Spacing.tiny,
  },
  googleMotherSectionButtonTitle: {
    fontFamily: Font.Medium,
    fontSize: TextSize.title,
    textAlign: "center",
  },
  // nurse field
  nurseField: {
    flex: 1,
    width: "80%",
    position: "absolute",
  },
  nurseLoginInfo: {
    textAlign: "center",
    color: color.neutral,
  },
  loginNurseWithGoogle: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Spacing.large,
    backgroundColor: color.surface,
    paddingVertical: Spacing.small,
    marginTop: Spacing.base,
  },
  googleNurseSectionIcon: {
    marginRight: Spacing.tiny,
  },
  googleNurseSectionButtonTitle: {
    fontFamily: Font.Medium,
    fontSize: TextSize.title,
    color: color.neutral,
  },
});

export default LoginPage;
