import React, { useMemo } from "react";

import { DefaultWidthSize } from "./types";

import { useAppDispatch } from "@redux/hooks";

import { View, StyleSheet, Platform } from "react-native";

import { color } from "src/lib/ui/color";
import { SafeAreaProvider } from "react-native-safe-area-context";

const createStyle = () => {
  return StyleSheet.create({
    main: {
      flex: 1,
      alignItems: "center",
      backgroundColor: color.surface,
    },
    container: {
      flex: 1,
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
};

export type Props = {
  children?: React.ReactNode;
};

const BaseContainer: React.FC<Props> = ({ children }) => {
  // create default style
  const style = useMemo(() => createStyle(), []);
  const dispatch = useAppDispatch();

  return (
    <SafeAreaProvider style={[style.main]}>
      <View style={style.container}>{children}</View>
    </SafeAreaProvider>
  );
};

export default BaseContainer;
