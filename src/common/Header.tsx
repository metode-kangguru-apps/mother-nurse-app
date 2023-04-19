import {
  Platform,
  StyleSheet,
  Text,
  TextStyle,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { useMemo } from "react";
import { Spacing } from "src/lib/ui/spacing";
import { Font } from "src/lib/ui/font";
import { TextSize } from "src/lib/ui/textSize";
import { color } from "src/lib/ui/color";

interface Props {
  title: string;
  titleStyle?: TextStyle;
  onBackButton: () => void;
}

const Header: React.FC<Props> = ({ title, onBackButton, titleStyle = {} }) => {
  const insets = useSafeAreaInsets();
  const style = useMemo(
    () => createStyle(insets, titleStyle),
    [insets, titleStyle]
  );
  return (
    <View style={style.container}>
      <TouchableWithoutFeedback onPress={onBackButton}>
        <Ionicons name="chevron-back" size={40} color={color.secondary} />
      </TouchableWithoutFeedback>
      <Text style={style.title}>{title}</Text>
    </View>
  );
};

const createStyle = (insets: EdgeInsets, titleStyle: TextStyle) => {
  return StyleSheet.create({
    container: {
      paddingHorizontal: Spacing.xsmall - Spacing.extratiny / 2,
      paddingBottom: Spacing.xsmall - Spacing.extratiny / 2,
      flexDirection: "row",
      alignItems: "center",
      ...Platform.select({
        native: {
          paddingTop: insets.top,
        },
        web: {
          paddingTop: Spacing.small,
        },
      }),
    },
    title: {
      fontFamily: Font.Regular,
      fontSize: TextSize.title,
      marginLeft: Spacing.base,
      ...titleStyle
    },
  });
};

export default Header;
