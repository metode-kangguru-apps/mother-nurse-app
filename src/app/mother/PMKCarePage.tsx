import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { MotherStackParamList } from "src/router/types";

import { color } from "src/lib/ui/color";
import { useMemo, useState } from "react";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { Spacing } from "src/lib/ui/spacing";
import { Font } from "src/lib/ui/font";
import { TextSize } from "src/lib/ui/textSize";

interface Props
  extends NativeStackScreenProps<MotherStackParamList, "pmk-care"> {}

const PMKCarePage: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const style = useMemo(() => createStyle(insets), [insets]);
  return (
    <ScrollView>
      <View style={style.container}>
        <View style={style.content}>
          <View style={{flex: 1}}>
            <Image
              style={style.pmkCareImage}
              source={require("../../../assets/example-pmk-care.png")}
            />
          </View>
          <View style={style.pmkCareInformationContainer}>
            <Text style={style.pmkCareInformationTitle}>Tahukah kamu?</Text>
            <Text style={style.pmkCareInformationContent}>
              Periode emas atau golden age adalah tahapan pertumbuhan dan
              perkembangan yang paling penting pada masa awal kehidupan anak.
              {"\n"}
              {"\n"}
              Golden age meliputi 1000 hari pertama kehidupan anak yang dihitung
              dari masa dalam kandungan sampai dengan usia anak mencapai dua
              tahun.
            </Text>
          </View>
        </View>
        <View style={style.buttonWrapper}>
          <TouchableOpacity onPress={() => navigation.replace("home")}>
            <View style={style.buttonContainer}>
              <Text style={style.buttonTitle}>Tutup</Text>
            </View>
          </TouchableOpacity>
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
      backgroundColor: color.primary,
      paddingTop: insets.top + Spacing.base,
    },
    content: {
      display: "flex",
      alignItems: "center",
    },
    pmkCareImage: {
      width: 193,
      height: 193,
    },
    pmkCareInformationContainer: {
      marginTop: Spacing.xlarge,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
    },
    pmkCareInformationTitle: {
      paddingHorizontal: Spacing.tiny,
      paddingVertical: Spacing.extratiny,
      backgroundColor: color.accent1,
      color: color.lightneutral,
      fontFamily: Font.Bold,
      fontSize: TextSize.h5,
      marginBottom: Spacing.xlarge / 2,
    },
    pmkCareInformationContent: {
      width: "70%",
      textAlign: "center",
      fontFamily: Font.Medium,
      fontSize: TextSize.title,
      color: color.lightneutral,
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
          bottom: Spacing.base + insets.bottom / 2,
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

export default PMKCarePage;
