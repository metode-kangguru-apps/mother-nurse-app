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
import { Spacing } from "src/lib/ui/spacing";
import { TextSize } from "src/lib/ui/textSize";
import { color } from "src/lib/ui/color";

import { AuthStackParamList, RootStackParamList } from "src/router/types";
import FloatingInput from "src/common/FloatingInput";

import { AntDesign } from "@expo/vector-icons";
import DateTimePicker from "src/common/DateTimePicker";
import PickerField from "src/common/PickerField";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useMemo, useState } from "react";
import { Baby, Authentication } from "@redux/actions/authentication/types";
import { useSelector } from "react-redux";
import { RootState } from "@redux/types";
import { useAppDispatch } from "@redux/hooks";
import {
  loginUser,
  signUpMotherWithGoogle,
} from "@redux/actions/authentication/thunks";
import { CompositeScreenProps } from "@react-navigation/native";
import { clearAuthenticationDataSuccess } from "@redux/actions/authentication";

const MEDIA_HEIGHT = Dimensions.get("window").height;

interface Props
  extends CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, "register-baby-information">,
    NativeStackScreenProps<RootStackParamList>
  > {}

const RegisterBabyInformation: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const [formField, setFormField] = useState<Baby>({});
  const style = useMemo(() => createStyle(insets), [insets]);
  const { user, mother } = useSelector(
    (state: RootState) => state.authentication
  );

  useEffect(() => {
    if (mother && mother.babyCollection) {
      if (mother.babyCollection.length > 1) {
        navigation.navigate("mother", {
          screen: "select-baby",
        });
      } else {
        navigation.navigate("mother", {
          screen: "home",
        });
      }
    }
  }, [mother]);

  function handlerRegisterAccount() {
    const newUserObj = {
      user: {
        displayName: user?.displayName,
        userType: "member",
        userRole: "mother",
        isAnonymous: true,
      },
      mother: {
        phoneNumber: mother?.phoneNumber,
        hospitalCode: mother?.hospitalCode,
        babyCollection: [
          {
            displayName: formField.displayName,
            gestationAge: formField.gestationAge,
            birthDate: formField.birthDate,
            weight: formField.weight,
            length: formField.length,
            currentWeight: formField.weight,
            currentLength: formField.length,
            gender: formField.gender,
          },
        ],
      },
      nurse: undefined,
    };
    if (user?.isAnonymous) {
      dispatch(loginUser(newUserObj as Authentication));
    } else {
      const newGoogleUserObj = {
        ...newUserObj,
        user: {
          ...newUserObj.user,
          uid: user?.uid,
          isAnonymous: false,
        },
      };
      dispatch(signUpMotherWithGoogle(newGoogleUserObj as Authentication));
    }
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
              <Image
                style={{ flex: 1 }}
                source={require("../../../assets/info-baby.png")}
              />
            </View>
          </View>
          <View style={style.contentContainer}>
            <View style={style.titleContainer}>
              <Text style={style.title}>Daftar Bayi</Text>
            </View>
            <View style={style.inputContainer}>
              <FloatingInput
                label="Nama"
                onChange={(value) => {
                  setFormField({
                    ...formField,
                    displayName: value,
                  });
                }}
              />
            </View>
            <View style={style.inputContainer}>
              <FloatingInput
                label="Usia Gestasi (minggu)"
                keyboardType={Platform.select({
                  ios: "numbers-and-punctuation",
                  android: "decimal-pad",
                })}
                onChange={(value) => {
                  setFormField({
                    ...formField,
                    gestationAge: parseInt(value),
                  });
                }}
              />
            </View>
            <View style={[style.inputContainer, { zIndex: 10 }]}>
              <DateTimePicker
                label="Tanggal Lahir"
                onChange={(value) => {
                  setFormField({
                    ...formField,
                    birthDate: value,
                  });
                }}
              />
            </View>
            <View style={style.inputContainer}>
              <FloatingInput
                label="Berat (gram)"
                keyboardType={Platform.select({
                  ios: "numbers-and-punctuation",
                  android: "decimal-pad",
                })}
                onChange={(value) => {
                  setFormField({
                    ...formField,
                    weight: parseInt(value),
                  });
                }}
              />
            </View>
            <View style={style.inputContainer}>
              <FloatingInput
                label="Tinggi Badan (cm)"
                keyboardType={Platform.select({
                  ios: "numbers-and-punctuation",
                  android: "decimal-pad",
                })}
                onChange={(value) => {
                  setFormField({
                    ...formField,
                    length: parseInt(value),
                  });
                }}
              />
            </View>
            <View style={[style.inputContainer, { zIndex: 10 }]}>
              <PickerField
                label="Jenis Kelamin"
                items={[
                  { key: "Laki-laki", value: "laki-laki" },
                  { key: "Perempuan", value: "perempuan" },
                ]}
                onChange={(item) => {
                  setFormField({
                    ...formField,
                    gender: item.value as Baby["gender"],
                  });
                }}
              />
            </View>
            <View style={style.buttonContainer}>
              <TouchableOpacity
                style={style.prevButton}
                onPress={() => {
                  const routes = navigation.getState().routes;
                  if (
                    navigation.canGoBack() &&
                    routes[routes.length - 2].name ==
                      "register-user-information"
                  ) {
                    navigation.goBack();
                  } else {
                    Promise.resolve(
                      dispatch(clearAuthenticationDataSuccess())
                    ).then(() => {
                      navigation.navigate("login");
                    });
                  }
                }}
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
                onPress={handlerRegisterAccount}
              >
                <Text style={style.buttonTitle}>Selanjutnya</Text>
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
    contentContainer: {
      width: "100%",
      backgroundColor: color.lightneutral,
      padding: Spacing.base - Spacing.extratiny,
      borderTopLeftRadius: Spacing.xlarge / 2,
      borderTopRightRadius: Spacing.xlarge / 2,
      justifyContent: "space-between",
      minHeight:
        (MEDIA_HEIGHT * 3) / 4 -
        (Spacing.base - Spacing.extratiny) -
        Spacing.xlarge -
        insets.top,
      ...Platform.select({
        native: {
          paddingBottom: insets.top,
        },
        web: {
          paddingBottom: Spacing.base,
        },
      }),
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
    titleContainer: {
      display: "flex",
      alignItems: "center",
    },
    title: {
      fontFamily: Font.Bold,
      fontSize: TextSize.h5,
      marginBottom: Spacing.small,
    },
    inputContainer: {
      marginBottom: Spacing.tiny,
    },
    buttonContainer: {
      display: "flex",
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignSelf: "flex-end",
      marginTop: Spacing.base,
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

export default RegisterBabyInformation;
