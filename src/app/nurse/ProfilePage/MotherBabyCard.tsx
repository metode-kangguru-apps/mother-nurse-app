import { Baby, Mother } from "@redux/actions/authentication/types";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { color } from "src/lib/ui/color";
import { Spacing } from "src/lib/ui/spacing";
import { AntDesign } from "@expo/vector-icons";
import { TextSize } from "src/lib/ui/textSize";
import { Font } from "src/lib/ui/font";
import { weekDifference } from "src/lib/utils/calculate";
import { BabyStatus } from "@redux/actions/baby/types";

interface Props {
  motherData: Mother;
}

const babyStatusStyle = (babyStatus: string) => {
  let colorStyle;
  switch (babyStatus) {
    case BabyStatus.FINNISH:
      colorStyle = color.primary;
      break;
    case BabyStatus.ON_PROGRESS:
      colorStyle = color.accent2;
      break;
    default:
      colorStyle = color.apple;
      break;
  }
  return colorStyle;
};

const MotherBabyCard: React.FC<Props> = ({ motherData }) => {
  return (
    <View style={style.container}>
      <View style={style.babyMotherWrapper}>
        <Text style={style.motherName}>{motherData.displayName}</Text>
        <AntDesign name="arrowright" size={20} color="black" />
      </View>
      {motherData.babyCollection &&
        motherData.babyCollection.map((baby) => {
          let babyCreatedAt: any = baby.createdAt;
          babyCreatedAt = new Date(
            babyCreatedAt.seconds * 1000 + babyCreatedAt.nanoseconds / 1000000
          );
          const weekDiff = weekDifference(babyCreatedAt);
          const currentWeek = baby.gestationAge && baby.gestationAge + weekDiff;
          return (
            <View key={baby.id}>
              <View style={style.deviderGap}></View>
              <View
                style={[
                  style.babyContainer,
                  {
                    borderColor: baby.currentStatus
                      ? babyStatusStyle(baby.currentStatus)
                      : color.accent2,
                  },
                ]}
              >
                <Text style={style.babyName}>{baby.displayName}</Text>
                <View style={style.babyWrapperInformation}>
                  <Text style={style.babyInformation}>{baby.weight} gram</Text>
                  <View style={style.babyInformationDevider}></View>
                  <Text style={style.babyInformation}>
                    {currentWeek} Minggu
                  </Text>
                </View>
                <Text
                  style={[
                    style.babyStatus,
                    {
                      color: baby.currentStatus
                        ? babyStatusStyle(baby.currentStatus)
                        : color.accent2,
                    },
                  ]}
                >
                  {baby.currentStatus || "Status tidak terdaftar"}
                </Text>
              </View>
            </View>
          );
        })}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    marginTop: Spacing.small,
    padding: Spacing.small,
    backgroundColor: color.lightneutral,
    borderRadius: 16,
    width: "100%",
  },
  babyMotherWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  motherName: {
    fontFamily: Font.Regular,
    fontSize: TextSize.title,
  },
  deviderGap: {
    height: 1,
    width: "100%",
    marginVertical: Spacing.tiny,
    backgroundColor: color.surface,
  },
  babyContainer: {
    paddingLeft: Spacing.xsmall,
    borderLeftWidth: 3,
  },
  babyName: {
    fontFamily: Font.Bold,
    fontSize: TextSize.title,
  },
  babyWrapperInformation: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  babyInformation: {
    fontSize: TextSize.body,
    fontFamily: Font.Medium,
    color: color.accent2,
  },
  babyInformationDevider: {
    width: 1,
    height: "100%",
    backgroundColor: color.accent2,
    marginHorizontal: Spacing.tiny,
  },
  babyStatus: {
    fontFamily: Font.Medium,
    marginTop: Spacing.small,
    fontSize: TextSize.body,
  },
});

export default MotherBabyCard;
