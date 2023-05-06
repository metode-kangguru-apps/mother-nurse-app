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

import { Font } from "src/lib/ui/font";
import { Spacing } from "src/lib/ui/spacing";
import { TextSize } from "src/lib/ui/textSize";
import { color } from "src/lib/ui/color";

import FloatingInput from "src/common/FloatingInput";

import { AntDesign } from "@expo/vector-icons";
import DateTimePicker from "src/common/DateTimePicker";
import PickerField from "src/common/PickerField";
import { useAssets } from "expo-asset";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { memo, useMemo, useState } from "react";
import { Baby } from "@redux/actions/authentication/types";


const MEDIA_HEIGHT = Dimensions.get("window").height;

interface Props {
  title: string,
  handleBackButton: () => void;
  handleRegisterBaby: (babyData: Baby) => void;
}

const RegisterBabyPage: React.FC<Props> = ({
  title,
  handleBackButton,
  handleRegisterBaby,
}) => {
  const insets = useSafeAreaInsets();
  const [formField, setFormField] = useState<Baby>({});
  const style = useMemo(() => createStyle(insets), [insets]);
  const [assets, _] = useAssets([require("../../../../assets/info-baby.png")]);

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
            <View style={style.titleContainer}>
              <Text style={style.title}>{title}</Text>
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
                onPress={handleBackButton}
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
                onPress={() => handleRegisterBaby(formField)}
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

export default memo(RegisterBabyPage);
