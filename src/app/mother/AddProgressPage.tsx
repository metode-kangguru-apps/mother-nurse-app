import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { MotherStackParamList } from "src/router/types";
import Header from "src/common/Header";
import { Font } from "src/lib/ui/font";
import { useAssets } from "expo-asset";
import FloatingInput from "src/common/FloatingInput";
import { Spacing } from "src/lib/ui/spacing";
import { TextSize } from "src/lib/ui/textSize";
import { Platform } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { useMemo } from "react";
import { color } from "src/lib/ui/color";

interface Props
  extends NativeStackScreenProps<MotherStackParamList, "add-progress"> {}

const AddProgressPage: React.FC<Props> = ({ navigation }) => {
  const [assets, _] = useAssets([require("../../../assets/baby-report.png")]);
  const insets = useSafeAreaInsets();
  const style = useMemo(() => createStyle(insets), [insets]);
  return (
    <View style={style.container}>
      <Header
        title="Pencatatan"
        titleStyle={{ fontFamily: Font.Bold }}
        onBackButton={() => navigation.replace("home")}
      />
      <View style={style.content}>
        <View style={style.babyReportImage}>
          {assets && (
            <Image
              style={{ flex: 1 }}
              source={{
                uri: assets[0].localUri as string,
              }}
            />
          )}
        </View>
        <View style={style.formContainer}>
          <Text style={style.formTitle}>Pertumbuhan Bayi</Text>
          <View style={style.formWrapper}>
            <View style={style.formField}>
              <FloatingInput
                label="Berat Badan (gram)"
                keyboardType="numeric"
              ></FloatingInput>
            </View>
            <View style={style.formField}>
              <FloatingInput
                label="Panjang Badan (cm)"
                keyboardType="numeric"
              ></FloatingInput>
            </View>
            <View style={style.formField}>
              <FloatingInput
                label="Suhu Tubuh (°C)"
                keyboardType="numeric"
              ></FloatingInput>
            </View>
          </View>
        </View>
      </View>
      <View style={style.buttonWrapper}>
        <TouchableOpacity onPress={() => navigation.replace("pmk-care")}>
          <View style={style.buttonContainer}>
            <Text style={style.buttonTitle}>Catat Pertumbuhan</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyle = (insets: EdgeInsets) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      display: "flex",
      alignItems: "center",
    },
    babyReportImage: {
      width: 193,
      height: 193,
    },
    formContainer: {
      width: "100%",
      paddingHorizontal: Spacing.base,
      paddingTop: Spacing.base,
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
    buttonWrapper: {
      position: "absolute",
      width: "100%",
      paddingHorizontal: Spacing.xlarge / 2,
      ...Platform.select({
        web: {
          bottom: Spacing.base,
        },
        native: {
          bottom: Spacing.small + insets.bottom,
        },
      }),
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
