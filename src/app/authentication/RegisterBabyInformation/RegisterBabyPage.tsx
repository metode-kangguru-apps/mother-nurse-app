import { memo, useMemo, useState } from "react";
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
import { AntDesign } from "@expo/vector-icons";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

import { Font } from "src/lib/ui/font";
import { Spacing } from "src/lib/ui/spacing";
import { TextSize } from "src/lib/ui/textSize";
import { color } from "src/lib/ui/color";

import { Baby } from "@redux/actions/pmkCare/types";

import PickerField from "src/common/PickerField";
import FloatingInput from "src/common/FloatingInput";
import DateTimePicker from "src/common/DateTimePicker";
import { isObjectContainUndefined } from "src/lib/utils/calculate";



interface Props {
  title: string;
  loading?: boolean;
  handleBackButton: () => void;
  handleRegisterBaby: (babyData: Baby) => void;
}

interface FormField extends Partial<Baby> {}

const RegisterBabyPage: React.FC<Props> = ({
  title,
  loading,
  handleBackButton,
  handleRegisterBaby,
}) => {
  const insets = useSafeAreaInsets();
  const [formField, setFormField] = useState<FormField>({
    displayName: undefined,
    gender: undefined,
    gestationAge: undefined,
    birthDate: undefined,
    weight: undefined,
    length: undefined,
  });
  const [formValidationError, setFormValidationError] = useState<boolean>();
  const style = useMemo(() => createStyle(insets), [insets]);

  function handleButtonNextOnClick() {
    if (!isObjectContainUndefined(formField)) {
      handleRegisterBaby(formField as Baby);
    } else {
      setFormValidationError(true);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={style.wrapper}
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
                {!loading ? (
                  <Text style={style.buttonTitle}>Selanjutnya</Text>
                ) : (
                  <ActivityIndicator size={TextSize.h5} color={color.rose} />
                )}
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
    wrapper: {
      flex: 1,
      paddingTop: insets.top,
    },
    container: {
      flex: 1,
      justifyContent: "space-between",
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
      width: 200,
      height: 200,
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
      marginTop: (Spacing.large * 2) / 3,
    },
    nextButton: {
      width: 170,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
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
