import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Spacing } from "src/lib/ui/spacing";
import { color } from "src/lib/ui/color";
import { Font } from "src/lib/ui/font";
import { TextSize } from "src/lib/ui/textSize";

const createStyle = (type: string) => {
  let typeBasedStyle = {
    container: {},
    contentHeader: {},
    contentMessage: {},
  };
  switch (type) {
    case "warning":
      typeBasedStyle = {
        container: {
          backgroundColor: color.rose,
        },
        contentHeader: {
          color: color.apple,
        },
        contentMessage: {
          color: color.apple,
        },
      };
      break;

    default:
      break;
  }
  return StyleSheet.create({
    container: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      padding: Spacing.small,
      ...typeBasedStyle.container,
    },
    content: {
      flex: 1,
      paddingHorizontal: Spacing.small,
      width: "100%",
      position: "relative",
      top: -Spacing.extratiny / 2,
    },
    contentHeader: {
      fontFamily: Font.Bold,
      marginBottom: Spacing.extratiny,
      ...typeBasedStyle.contentHeader,
    },
    contentMessage: {
        fontFamily: Font.Regular,
      ...typeBasedStyle.contentMessage,
    },
  });
};

interface Props {
  type: "warning";
  title: string;
  message: string;
  showCloseButton?: boolean;
}

const Info: React.FC<Props> = ({
  type,
  title,
  message,
  showCloseButton = false,
}) => {
  const style = useMemo(() => createStyle(type), [type]);
  return (
    <View style={style.container}>
      <View>
        {type === "warning" && (
          <FontAwesome name="warning" size={20} color={color.apple} />
        )}
      </View>
      <View style={style.content}>
        <Text style={style.contentHeader}>{title}</Text>
        <Text style={style.contentMessage}>{message}</Text>
      </View>
      {showCloseButton && (
        <View>
          <AntDesign name="close" size={20} color={color.apple} />
        </View>
      )}
    </View>
  );
};

export default Info;
