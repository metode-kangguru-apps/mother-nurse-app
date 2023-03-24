import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Spacing } from "src/lib/ui/spacing";

const createStyle = (spacing: number, color: string) => {
  return StyleSheet.create({
    separator: {
      padding: spacing,
      marginVertical: Spacing.tiny,
      backgroundColor: color,
    },
  });
};

type Props = {
  spacing: number;
  color: string;
};

const Separator: React.FC<Props> = ({ spacing, color }) => {
  const style = useMemo(() => createStyle(spacing, color), [spacing, color]);
  return <View style={style.separator}></View>;
};

export default Separator;
