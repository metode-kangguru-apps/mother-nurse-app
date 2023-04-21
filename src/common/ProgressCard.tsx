import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { color } from "src/lib/ui/color";
import { Font } from "src/lib/ui/font";
import { Spacing } from "src/lib/ui/spacing";
import { TextSize } from "src/lib/ui/textSize";

interface Props {
  date: string;
  time: string;
  week: number;
  weight: number;
  length: number;
  temperature: number;
}

const ProgressCard: React.FC<Props> = ({
  time,
  date,
  week,
  weight,
  length,
  temperature,
}) => {
  const style = useMemo(() => createStyle(), []);
  return (
    <View style={style.container}>
      <View style={style.leftContent}>
        <Text style={style.weekOld}>Usia {week} Minggu</Text>
        <View style={style.datetimeWrapper}>
          <Text style={style.time}>{time}</Text>
          <Text style={style.date}>{date}</Text>
        </View>
      </View>
      <View style={style.divider}></View>
      <View style={style.rightContent}>
        <View style={style.informationWrapper}>
          <Text style={style.title}>Berat</Text>
          <Text style={style.information}>{weight} gram</Text>
        </View>
        <View
          style={[style.informationWrapper, { paddingVertical: Spacing.tiny }]}
        >
          <Text style={style.title}>Panjang</Text>
          <Text style={style.information}>{length} cm</Text>
        </View>
        <View style={style.informationWrapper}>
          <Text style={style.title}>Suhu</Text>
          <Text style={style.information}>{temperature}°C</Text>
        </View>
      </View>
    </View>
  );
};

const createStyle = () => {
  return StyleSheet.create({
    container: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: color.lightneutral,
      paddingRight: Spacing.small,
      paddingLeft: Spacing.small - Spacing.extratiny,
      paddingVertical: Spacing.xsmall,
      borderLeftWidth: Spacing.extratiny,
      borderColor: color.primary,
      borderBottomRightRadius: 10,
      borderTopRightRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      marginBottom: Spacing.small
    },
    leftContent: {
      flex: 0.45,
      display: "flex",
      justifyContent: "space-between",
    },
    weekOld: {
      fontFamily: Font.Medium,
      fontSize: TextSize.body,
      color: color.accent2,
    },
    datetimeWrapper: {},
    time: {
      fontFamily: Font.Light,
      fontSize: TextSize.body,
    },
    date: {
      fontFamily: Font.Bold,
      fontSize: TextSize.title,
    },
    divider: {
      width: 1.5,
      height: "100%",
      opacity: 0.3,
      backgroundColor: color.accent2,
      marginHorizontal: Spacing.small
    },
    rightContent: {
      flex: 0.53,
    },
    informationWrapper: {
      display: "flex",
      flexDirection: "row",
    },
    title: {
      flex: 0.4,
      fontFamily: Font.Light,
      fontSize: TextSize.body,
      color: color.neutral,
    },
    information: {
      fontFamily: Font.Medium,
      fontSize: TextSize.body,
      flex: 0.6,
    },
  });
};

export default ProgressCard;
