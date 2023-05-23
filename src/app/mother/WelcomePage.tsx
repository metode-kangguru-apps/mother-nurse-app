import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { updateMotherFinnishedOnboard } from "@redux/actions/authentication";
import { useAppDispatch } from "@redux/hooks";
import { useMemo } from "react";
import {
  ImageBackground,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";
import { Image, StyleSheet, View } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { color } from "src/lib/ui/color";
import { Font } from "src/lib/ui/font";
import { Spacing } from "src/lib/ui/spacing";
import { TextSize } from "src/lib/ui/textSize";
import { MotherStackParamList } from "src/router/types";

interface Props
  extends NativeStackScreenProps<MotherStackParamList, "welcome"> {}

const WelcomePage: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const style = useMemo(() => createStyle(insets), [insets]);
  return (
    <View style={style.container}>
      <ImageBackground
        source={require("../../../assets/baby-pattern.png")}
        style={style.backgroundPattern}
      />
      <View style={style.welcomeBlobWrapper}>
        <Image
          style={style.welcomeBlob}
          source={require("../../../assets/welcome-blob.png")}
        />
      </View>
      <View style={style.topContainer}>
        <Text style={style.title}>Selamat Datang</Text>
        <Text style={style.caption}>
          Rawat Bayi Anda untuk mencapai berat badan ideal dengan Perawatan
          Metode Kanguru
        </Text>
      </View>
      <View style={style.bottomContainer}>
        <Image
          style={style.welcomeMotherImage}
          source={require("../../../assets/welcome-mother.png")}
        />
        <View style={style.buttonStartContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.push("onboarding")
            }}
          >
            <View style={style.buttonStart}>
              <Text style={style.buttonStartTitle}>Mulai</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const createStyle = (insets: EdgeInsets) =>
  StyleSheet.create({
    container: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "space-between",
      ...Platform.select({
        native: {
          paddingBottom: insets.bottom + Spacing.small,
        },
        web: {
          paddingBottom: Spacing.base,
        },
      }),
    },
    backgroundPattern: {
      flex: 1,
      width: "100%",
      height: "100%",
      position: "absolute",
      opacity: 0.25,
    },
    topContainer: {
      width: "80%",
      maxWidth: 300,
      marginTop: (Spacing.xlarge * 5) / 3,
    },
    title: {
      fontSize: TextSize.h5,
      fontFamily: Font.Bold,
      color: color.lightneutral,
      marginBottom: Spacing.base,
      textAlign: "center",
    },
    caption: {
      fontSize: TextSize.title,
      fontFamily: Font.Medium,
      color: color.lightneutral,
      textAlign: "center",
    },
    bottomContainer: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingHorizontal: Spacing.base,
      alignSelf: "flex-end",
    },
    welcomeBlobWrapper: {
      width: "100%",
      height: "100%",
      position: "absolute",
    },
    welcomeBlob: {
      width: "100%",
      height: "68%",
    },
    welcomeMotherImage: {
      width: 210,
      height: 210,
    },
    buttonStartContainer: {
      width: "100%",
      marginTop: Spacing.xlarge,
    },
    buttonStart: {
      width: "100%",
      paddingVertical: Spacing.small,
      backgroundColor: color.secondary,
      borderRadius: 30,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "flex-end",
    },
    buttonStartTitle: {
      fontFamily: Font.Medium,
      color: color.lightneutral,
    },
  });

export default WelcomePage;
