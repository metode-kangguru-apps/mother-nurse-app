import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { MotherStackParamList } from "src/router/types";
import Header from "src/common/Header";
import { Font } from "src/lib/ui/font";
import FloatingInput from "src/common/FloatingInput";
import { Spacing } from "src/lib/ui/spacing";
import { TextSize } from "src/lib/ui/textSize";
import { Platform } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { useMemo, useState } from "react";
import { color } from "src/lib/ui/color";
import { useAppDispatch } from "@redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@redux/types";
import { addProgressBaby } from "@redux/actions/baby/thunks";

interface Props
  extends NativeStackScreenProps<MotherStackParamList, "add-progress"> {}

type FormField = {
  weight: number;
  length: number;
  temperature: number;
};

const AddProgressPage: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [formField, setFormField] = useState<FormField>({
    weight: 0,
    length: 0,
    temperature: 0,
  });
  const { selectedTerapiBaby } = useSelector(
    (state: RootState) => state.global
  );
  const style = useMemo(() => createStyle(insets), [insets]);

  const dispatch = useAppDispatch();
  function handleProgressSubmit() {
    dispatch(
      addProgressBaby({
        babyID: selectedTerapiBaby.id,
        week: selectedTerapiBaby.currentWeek,
        weight: formField.weight,
        length: formField.length,
        temperature: formField.temperature,
      })
    );
    navigation.replace("pmk-care");
  }
  return (
    <ScrollView>
      <View style={style.container}>
        <Header
          title="Pencatatan"
          titleStyle={{ fontFamily: Font.Bold }}
          onBackButton={() => navigation.replace("home")}
        />
        <View style={style.content}>
          <View style={style.babyReportImage}>
            <Image
              style={style.babyReportImage}
              source={require("../../../assets/baby-report.png")}
            />
          </View>
          <View style={style.formContainer}>
            <View>
              <Text style={style.formTitle}>Pertumbuhan Bayi</Text>
              <View style={style.formField}>
                <FloatingInput
                  label="Berat Badan (gram)"
                  keyboardType="number-pad"
                  onChange={(value) => {
                    setFormField({
                      ...formField,
                      weight: parseInt(value),
                    });
                  }}
                ></FloatingInput>
              </View>
              <View style={style.formField}>
                <FloatingInput
                  label="Panjang Badan (cm)"
                  keyboardType="number-pad"
                  onChange={(value) => {
                    setFormField({
                      ...formField,
                      length: parseInt(value),
                    });
                  }}
                ></FloatingInput>
              </View>
              <View style={style.formField}>
                <FloatingInput
                  label="Suhu Tubuh (°C)"
                  keyboardType="number-pad"
                  onChange={(value) => {
                    setFormField({
                      ...formField,
                      temperature: parseInt(value),
                    });
                  }}
                ></FloatingInput>
              </View>
            </View>
            <TouchableOpacity onPress={handleProgressSubmit}>
              <View style={style.buttonContainer}>
                <Text style={style.buttonTitle}>Catat Pertumbuhan</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const createStyle = (insets: EdgeInsets) =>
  StyleSheet.create({
    container: {
      flex: 1,
      minHeight: Dimensions.get("window").height,
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
      flex: 1,
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

export default AddProgressPage;
