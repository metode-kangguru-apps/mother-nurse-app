import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Header from "src/common/Header";
import FloatingInput from "src/common/FloatingInput";
import { Font } from "src/lib/ui/font";
import { Spacing } from "src/lib/ui/spacing";
import { TextSize } from "src/lib/ui/textSize";
import { Platform } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { useMemo, useState } from "react";
import { color } from "src/lib/ui/color";
import { isObjectContainUndefined } from "src/lib/utils/calculate";

export type FormField = {
  weight: number;
  length: number;
  temperature: number;
};

interface Props {
  handleProgressSubmit: (formField: FormField) => void;
  handleBackForm: () => void;
}

const AddProgressForm: React.FC<Props> = ({
  handleProgressSubmit,
  handleBackForm,
}) => {
  const insets = useSafeAreaInsets();
  const [validationFormError, setValidationFormError] = useState<boolean>();
  const [formField, setFormField] = useState<Partial<FormField>>({
    weight: undefined,
    length: undefined,
  });

  const style = useMemo(() => createStyle(insets), [insets]);

  function handleSubmitOnClick() {
    if (!isObjectContainUndefined(formField)) {
      const progressFormField = formField as FormField;
      handleProgressSubmit(progressFormField);
    } else {
      setValidationFormError(true);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={style.container}>
        <View style={style.container}>
          <Header
            title="Pencatatan"
            titleStyle={{ fontFamily: Font.Bold }}
            onBackButton={handleBackForm}
          />
          <View style={style.content}>
            <View style={style.babyReportImage}>
              <Image
                style={style.babyReportImage}
                source={require("../../../../assets/baby-report.png")}
              />
            </View>
            <View style={style.formContainer}>
              <View>
                <Text style={style.formTitle}>Pertumbuhan Bayi</Text>
                <View style={style.formField}>
                  <FloatingInput
                    required
                    onError={validationFormError}
                    label="Berat Badan (gram)*"
                    keyboardType="decimal-pad"
                    onChange={(value) => {
                      setFormField({
                        ...formField,
                        weight: parseFloat(value),
                      });
                    }}
                  ></FloatingInput>
                </View>
                <View style={style.formField}>
                  <FloatingInput
                    required
                    onError={validationFormError}
                    label="Panjang Badan (cm)*"
                    keyboardType="decimal-pad"
                    onChange={(value) => {
                      setFormField({
                        ...formField,
                        length: parseFloat(value),
                      });
                    }}
                  ></FloatingInput>
                </View>
                <View style={style.formField}>
                  <FloatingInput
                    label="Suhu Tubuh (°C)"
                    keyboardType="decimal-pad"
                    onChange={(value) => {
                      setFormField({
                        ...formField,
                        temperature: parseFloat(value),
                      });
                    }}
                  ></FloatingInput>
                </View>
              </View>
              <TouchableOpacity onPress={handleSubmitOnClick}>
                <View style={style.buttonContainer}>
                  <Text style={style.buttonTitle}>Catat Pertumbuhan</Text>
                </View>
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
      flexGrow: 1,
    },
    content: {
      display: "flex",
      flexGrow: 1,
      alignItems: "center",
    },
    babyReportImage: {
      width: 193,
      height: 193,
      marginBottom: Spacing.base,
    },
    formContainer: {
      flexGrow: 1,
      width: "100%",
      paddingHorizontal: Spacing.base,
      paddingTop: Spacing.base,
      justifyContent: "space-between",
      backgroundColor: color.lightneutral,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      ...Platform.select({
        web: {
          paddingBottom: Spacing.base,
        },
        native: {
          paddingBottom: Spacing.small + insets.bottom,
        },
      }),
    },
    formTitle: {
      marginBottom: Spacing.base,
      fontFamily: Font.Bold,
      fontSize: TextSize.h5,
    },
    formWrapper: {},
    formField: {
      marginBottom: Spacing.tiny,
    },
    buttonContainer: {
      width: "100%",
      marginTop: Spacing.xlarge,
      paddingVertical: Spacing.small,
      backgroundColor: color.secondary,
      borderRadius: 30,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "flex-end",
    },
    buttonTitle: {
      fontFamily: Font.Medium,
      color: color.lightneutral,
    },
  });

export default AddProgressForm;
