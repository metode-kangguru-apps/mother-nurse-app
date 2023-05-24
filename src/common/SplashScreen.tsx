import React, { useEffect } from "react";
import { Animated, Platform, StyleSheet, View } from "react-native";
import { color } from "src/lib/ui/color";
import HugABabyIcon from "src/lib/ui/icons/HugABaby";
import { DefaultWidthSize } from "./types";

const SplashScreen: React.FC<{}> = () => {
  return (
    <View style={style.container}>
      <View style={style.splashscreen}>
        <HugABabyIcon />
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  splashscreen: {
    flex: 1,
    backgroundColor: color.primary,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      web: {
        width: "100%",
        maxWidth: DefaultWidthSize.mobile,
      },
      native: {
        width: "100%",
        height: "100%",
      },
    }),
  },
});

export default SplashScreen;
