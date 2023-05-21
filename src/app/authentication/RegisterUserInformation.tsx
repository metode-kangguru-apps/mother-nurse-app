import { useSelector } from "react-redux";

import { useEffect, useMemo, useState } from "react";
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
import { useSafeAreaInsets, EdgeInsets } from "react-native-safe-area-context";

import { RootStateV2 } from "@redux/types";
import { useAppDispatch } from "@redux/hooks";

import { Font } from "src/lib/ui/font";
import { color } from "src/lib/ui/color";
import { Spacing } from "src/lib/ui/spacing";
import { TextSize } from "src/lib/ui/textSize";

import PickerFiled from "src/common/PickerField";
import FloatingInput from "src/common/FloatingInput";
import PhoneNumberInput from "src/common/PhoneNumberInput";

import { AuthStackParamList } from "src/router/types";

import { isObjectContainUndefined } from "src/lib/utils/calculate";

import { AntDesign } from "@expo/vector-icons";

import { setUserData } from "@redux/actions/authenticationV2";
import { MotherPayload } from "@redux/actions/authenticationV2/types";
import { logingOutUser } from "@redux/actions/authenticationV2/thunks";
import { setSelectedHospital } from "@redux/actions/hospital";
import { getHospitalList } from "@redux/actions/hospital/thunks";

interface Props
  extends NativeStackScreenProps<
    AuthStackParamList,
    "register-user-information"
  > {}

const RegisterUserInformation: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  const insets = useSafeAreaInsets();
  const style = useMemo(() => createStyle(insets), [insets]);

  const { hospitalList } = useSelector((state: RootStateV2) => state.hospital);

  const [searchHospital, setSearchHospital] = useState<string>("");
  const [formValidationError, setFormValidationError] = useState<boolean>();
  const [formField, setFormField] = useState<MotherPayload>(
    {} as MotherPayload
  );

  function handlerGoToRegisterBaby() {
    if (!isObjectContainUndefined(formField)) {
      if (
        formField.phoneNumber.length < 8 ||
        formField.phoneNumber.length > 13
      ) {
        setFormValidationError(true);
        return;
      }
      const savedUserData: Partial<MotherPayload> = {
        displayName: formField.displayName,
        phoneNumber: formField.phoneNumber,
      };
      dispatch(setUserData(savedUserData));
      dispatch(setSelectedHospital(formField.hospital));
      navigation.navigate("register-baby-information");
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
            source={require("../../../assets/info-mother.png")}
          />
        </View>
        <View style={style.contentContainer}>
          <View style={style.formRegistration}>
            <View style={style.titleContainer}>
              <Text style={style.title}>Daftar</Text>
            </View>
            <View style={style.inputContainer}>
              <FloatingInput
                required
                onError={formValidationError}
                label="Nama Ibu"
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
                required
                onError={formValidationError}
                label="Rumah Sakit"
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
            <TouchableOpacity
              style={style.nextButton}
              onPress={handlerGoToRegisterBaby}
            >
              <Text style={style.buttonTitle}>Selanjutnya</Text>
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
      flexGrow: 1,
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
      width: "100%",
      flex: 1,
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
      marginBottom: insets.bottom
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

export default RegisterUserInformation;
