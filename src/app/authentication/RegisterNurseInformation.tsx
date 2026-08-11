import { useSelector } from "react-redux";

import { RootStateV2 } from "@redux/types";
import {
  ActivityIndicator,
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

import { useSafeAreaInsets, EdgeInsets } from "react-native-safe-area-context";
import { useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "@redux/hooks";
import PickerFiled from "src/common/PickerField";
import { CompositeScreenProps } from "@react-navigation/native";
import { isObjectContainUndefined } from "src/lib/utils/calculate";
import { NursePayload } from "@redux/actions/authentication/types";
import { getHospitalList } from "@redux/actions/hospital/thunks";
import {
  logingOutUser,
  signUpNurseAccount,
} from "@redux/actions/authentication/thunks";
import { HospitalPayload } from "@redux/actions/hospital/types";

interface Props
  extends CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, "register-nurse-information">,
    NativeStackScreenProps<RootStackParamList>
  > {}

interface FormField {
  name: string;
  phoneNumber: string;
  hospital: HospitalPayload;
}

const RegisterNurseInformation: React.FC<Props> = () => {
  const dispatch = useAppDispatch();

  const insets = useSafeAreaInsets();
  const style = useMemo(() => createStyle(insets), [insets]);

  const { user } = useSelector((state: RootStateV2) => state.authentication);
  const { hospitalList } = useSelector((state: RootStateV2) => state.hospital);

  const [searchHospital, setSearchHospital] = useState<string>("");
  const [formField, setFormField] = useState<Partial<FormField>>({
    name: undefined,
    phoneNumber: undefined,
    hospital: undefined,
  });
  const [formValidationError, setFormValidationError] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>();

  function registerNurse() {
    if (!isObjectContainUndefined(formField) && user) {
      const nurseFormField = formField as FormField;
      if (
        nurseFormField.phoneNumber.length < 8 ||
        nurseFormField.phoneNumber.length > 13
      ) {
        setFormValidationError(true);
        return;
      }
      setLoading(true);
      const nurseData: NursePayload = {
        uid: user.uid,
        displayName: nurseFormField.name,
        isAnonymous: user.isAnonymous,
        userRole: user.userRole,
        userType: "member",
        phoneNumber: nurseFormField.phoneNumber,
        hospital: nurseFormField.hospital,
      };
      dispatch(signUpNurseAccount(nurseData)).then(() => {
        setLoading(false);
      });
    } else {
      setFormValidationError(true);
    }
  }

  useEffect(() => {
    dispatch(getHospitalList(searchHospital));
  }, [searchHospital]);

  function handlerGoBackToLogin() {
    dispatch(logingOutUser());
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={style.wrapper}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.container}
      >
        <View style={style.welcomeImageContainer}>
          <Image
            style={style.welcomeImage}
            source={require("../../../assets/nurse-icon.png")}
          />
        </View>
        <View style={style.contentContainer}>
          <View style={style.formRegistration}>
            <View style={style.titleContainer}>
              <Text style={style.title}>Daftar Sebagai Perawat</Text>
            </View>
            <View style={style.inputContainer}>
              <FloatingInput
                required
                onError={formValidationError}
                label="Nama Lengkap"
                onChange={(value) =>
                  setFormField({
                    ...formField,
                    name: value,
                  })
                }
              />
            </View>
            <View style={style.inputContainer}>
              <PhoneNumberInput
                required
                onError={formValidationError}
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
                required
                onError={formValidationError}
                searchable={true}
                items={hospitalList}
                onFocus={() => {
                  setSearchHospital("");
                }}
                onChange={(value) => {
                  setFormField((prev) => ({
                    ...prev,
                    hospital: value,
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
            <TouchableOpacity style={style.nextButton} onPress={registerNurse}>
              {!loading ? (
                <Text style={style.buttonTitle}>Daftar</Text>
              ) : (
                <ActivityIndicator size={TextSize.h5} color={color.rose} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const createStyle = (insets: EdgeInsets) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      paddingTop: insets.top,
    },
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
      width: 200,
      height: 200,
    },
    contentContainer: {
      flexGrow: 1,
      width: "100%",
      backgroundColor: color.lightneutral,
      padding: Spacing.base - Spacing.extratiny,
      borderTopLeftRadius: Spacing.xlarge / 2,
      borderTopRightRadius: Spacing.xlarge / 2,
      justifyContent: "space-between",
      ...Platform.select({
        native: {
          paddingBottom: insets.bottom,
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
