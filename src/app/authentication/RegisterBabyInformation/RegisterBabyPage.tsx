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
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { memo, useMemo, useState } from "react";
import { Baby } from "@redux/actions/authentication/types";
import { Baby as BabyV2 } from "@redux/actions/pmkCare/types";
import { isObjectContainUndefined } from "src/lib/utils/calculate";

const MEDIA_HEIGHT = Dimensions.get("window").height;

interface Props {
  title: string;
  handleBackButton: () => void;
  handleRegisterBaby: (babyData: BabyV2) => void;
}

interface FormField extends Partial<BabyV2> {}

const RegisterBabyPage: React.FC<Props> = ({
  title,
  handleBackButton,
  handleRegisterBaby,
}) => {
  const insets = useSafeAreaInsets();
  const [formField, setFormField] = useState<FormField>({});
  const [formValidationError, setFormValidationError] = useState<boolean>();
  const style = useMemo(() => createStyle(insets), [insets]);

  function handleButtonNextOnClick() {
    if (!isObjectContainUndefined(formField)) {
      handleRegisterBaby(formField as BabyV2);
    } else {
      setFormValidationError(true);
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
            <View style={{ flex: 1 }}>
              <Image
                style={style.welcomeImage}
                source={require("../../../../assets/info-baby.png")}
              />
            </View>
          </View>
          <View style={style.contentContainer}>
            <View style={style.titleContainer}>
              <Text style={style.title}>{title}</Text>
            </View>
            <View style={style.inputContainer}>
              <FloatingInput
                required
                onError={formValidationError}
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
                required
                onError={formValidationError}
                label="Usia Gestasi (minggu)"
                keyboardType="decimal-pad"
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
                required
                onError={formValidationError}
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
                required
                onError={formValidationError}
                label="Berat (gram)"
                keyboardType="decimal-pad"
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
                required
                onError={formValidationError}
                label="Tinggi Badan (cm)"
                keyboardType="decimal-pad"
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
                required
                onError={formValidationError}
                label="Jenis Kelamin"
                items={[
                  { key: "Laki-Laki", value: "laki-laki" },
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
                onPress={() => handleButtonNextOnClick()}
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
