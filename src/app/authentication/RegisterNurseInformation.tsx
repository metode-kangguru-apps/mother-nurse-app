import { useSelector } from "react-redux";

import { RootState } from "@redux/types";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Font } from "src/lib/ui/font";
import { color } from "src/lib/ui/color";
import { Spacing } from "src/lib/ui/spacing";
import { TextSize } from "src/lib/ui/textSize";

import { AuthStackParamList, RootStackParamList } from "src/router/types";
import FloatingInput from "src/common/FloatingInput";
import PhoneNumberInput from "src/common/PhoneNumberInput";

import { AntDesign } from "@expo/vector-icons";
import { useAssets } from "expo-asset";

import { useSafeAreaInsets, EdgeInsets } from "react-native-safe-area-context";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "@redux/hooks";
import {
  clearAuthenticationDataSuccess,
  setMotherData,
  setNurseData,
  setUserData,
} from "@redux/actions/authentication";
import {
  Authentication,
  Mother,
  Nurse,
} from "@redux/actions/authentication/types";
import PickerFiled from "src/common/PickerField";
import { getHospitalList } from "@redux/actions/global/thunks";
import { Hostpital } from "@redux/actions/global/type";
import { signUpNurseWithGoogle } from "@redux/actions/authentication/thunks";
import { CompositeScreenProps } from "@react-navigation/native";

interface Props
  extends CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, "register-nurse-information">,
    NativeStackScreenProps<RootStackParamList>
  > {}

interface NursePayload {
  displayName: string;
  phoneNumber: string;
  hospitalCode: Hostpital;
}

const MEDIA_HEIGHT = Dimensions.get("window").height;

const RegisterNurseInformation: React.FC<Props> = ({ navigation }) => {
  const [assets, _] = useAssets([require("../../../assets/nurse-icon.png")]);
  const dispatch = useAppDispatch();

  const insets = useSafeAreaInsets();
  const style = useMemo(() => createStyle(insets), [insets]);

  const { user, nurse } = useSelector(
    (state: RootState) => state.authentication
  );
  const { hospitalList, loading: loadingHospital } = useSelector(
    (state: RootState) => state.global
  );

  const [searchHospital, setSearchHospital] = useState<string>("");
  const [formField, setFormField] = useState({} as NursePayload);

  function registerNurse() {
    const newUserObj = {
      user: {
        displayName: formField.displayName,
        userType: "member",
        userRole: "nurse",
        isAnonymous: false,
        uid: user?.uid,
      },
      mother: undefined,
      nurse: {
        phoneNumber: formField.phoneNumber,
        hospitalCode: formField.hospitalCode,
      },
    };
    dispatch(signUpNurseWithGoogle(newUserObj as Authentication));
  }

  // redierect to new page if field mother already filled
  useEffect(() => {
    if (nurse) {
      navigation.navigate("nurse", {
        screen: "profile",
      });
    }
  }, [nurse]);

  useEffect(() => {
    dispatch(getHospitalList(searchHospital));
  }, [searchHospital]);

  function handlerGoBackToLogin() {
    Promise.resolve(dispatch(clearAuthenticationDataSuccess())).then(() => {
      navigation.navigate("login");
    });
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, paddingTop: insets.top }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.container}>
          <View style={style.welcomeImageContainer}>
            <View style={style.welcomeImage}>
              {assets && (
                <Image
                  style={{ flex: 1 }}
                  source={{
                    uri: assets[0].localUri as string,
                  }}
                />
              )}
            </View>
          </View>
          <View style={style.contentContainer}>
            <View style={style.formRegistration}>
              <View style={style.titleContainer}>
                <Text style={style.title}>Daftar Sebagai Perawat</Text>
              </View>
              <View style={style.inputContainer}>
                <FloatingInput
                  label="Nama Lengkap"
                  onChange={(value) =>
                    setFormField({
                      ...formField,
                      displayName: value,
                    })
                  }
                />
              </View>
              <View style={style.inputContainer}>
                <PhoneNumberInput
                  onChange={(value) => {
                    setFormField({
                      ...formField,
                      phoneNumber: value,
                    });
                  }}
                />
              </View>
              <View style={style.inputContainer}>
                <PickerFiled
                  label="Rumah Sakit"
                  searchable={true}
                  items={hospitalList}
                  onFocus={() => {
                    setSearchHospital("");
                  }}
                  onChange={(value) => {
                    setFormField((prev) => ({
                      ...prev,
                      hospitalCode: value,
                    }));
                  }}
                  onSearch={(value) => {
                    setSearchHospital(value);
                  }}
                />
              </View>
            </View>
            <View style={style.buttonContainer}>
              <TouchableOpacity
                style={style.prevButton}
                onPress={handlerGoBackToLogin}
              >
                <AntDesign
                  name="arrowleft"
                  size={TextSize.h6}
                  color={color.accent2}
                />
                <Text style={style.prevButtonTitle}>Kembali</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={style.nextButton}
                onPress={registerNurse}
              >
                <Text style={style.buttonTitle}>Daftar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const createStyle = (insets: EdgeInsets) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
    },
    welcomeImageContainer: {
      display: "flex",
      alignItems: "center",
      marginVertical: Spacing.xlarge / 2,
      padding: Spacing.small,
    },
    welcomeImage: {
      width: MEDIA_HEIGHT / 4,
      height: MEDIA_HEIGHT / 4,
    },
    contentContainer: {
      width: "100%",
      height:
        (MEDIA_HEIGHT * 3) / 4 -
        Spacing.xlarge -
        2 * Spacing.small -
        insets.top,
      backgroundColor: color.lightneutral,
      padding: Spacing.base - Spacing.extratiny,
      borderTopLeftRadius: Spacing.xlarge / 2,
      borderTopRightRadius: Spacing.xlarge / 2,
      justifyContent: "space-between",
      ...Platform.select({
        native: {
          paddingBottom: insets.top,
        },
        web: {
          paddingBottom: Spacing.base,
        },
      }),
    },
    formRegistration: {
      width: "100%",
    },
    titleContainer: {
      width: "100%",
      alignItems: "center",
    },
    title: {
      fontFamily: Font.Bold,
      fontSize: TextSize.h5,
      marginBottom: Spacing.small,
    },
    inputContainer: {
      position: "relative",
      marginBottom: Spacing.tiny,
      zIndex: 1,
    },
    buttonContainer: {
      display: "flex",
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    nextButton: {
      paddingVertical: Spacing.xsmall,
      paddingHorizontal: Spacing.large,
      backgroundColor: color.secondary,
      borderRadius: Spacing.xlarge,
    },
    buttonTitle: {
      fontFamily: Font.Bold,
      fontSize: TextSize.body,
      color: color.lightneutral,
    },
    prevButton: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    prevButtonTitle: {
      color: color.accent2,
      fontSize: TextSize.body,
      fontFamily: Font.Bold,
      paddingLeft: Spacing.small,
    },
  });

export default RegisterNurseInformation;
