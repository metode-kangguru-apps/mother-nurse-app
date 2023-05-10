import { Mother } from "@redux/actions/authentication/types";
import { StyleSheet, Text, View } from "react-native";
import { color } from "src/lib/ui/color";
import { Spacing } from "src/lib/ui/spacing";
import { AntDesign } from "@expo/vector-icons";
import { TextSize } from "src/lib/ui/textSize";
import { Font } from "src/lib/ui/font";
import { weekDifference } from "src/lib/utils/calculate";

interface Props {
  motherData: Mother;
}

const MotherBabyCard: React.FC<Props> = ({ motherData }) => {
  return (
    <View style={style.container}>
      <View style={style.babyMotherWrapper}>
        <Text style={style.motherName}>{motherData.displayName}</Text>
        <AntDesign name="arrowright" size={20} color="black" />
      </View>
      {motherData.babyCollection &&
        motherData.babyCollection.map((baby, key) => {
          let babyCreatedAt: any = baby.createdAt;
          babyCreatedAt = new Date(
            babyCreatedAt.seconds * 1000 + babyCreatedAt.nanoseconds / 1000000
          );
          const weekDiff = weekDifference(babyCreatedAt);
          const currentWeek = baby.gestationAge && baby.gestationAge + weekDiff;
          return (
            <View key={key}>
              <View style={style.deviderGap}></View>
              <View style={style.babyContainer}>
                <Text style={style.babyName}>{baby.displayName}</Text>
                <View style={style.babyWrapperInformation}>
                  <Text style={style.babyInformation}>{baby.weight} gram</Text>
                  <View style={style.babyInformationDevider}></View>
                  <Text style={style.babyInformation}>
                    {currentWeek} Minggu
                  </Text>
                </View>
                <Text style={style.babyStatus}>PMK Selesai</Text>
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
    borderLeftWidth: Spacing.extratiny,
    borderColor: color.primary,
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
    color: color.neutral,
  },
  babyInformationDevider: {
    width: 1,
    height: "100%",
    backgroundColor: color.neutral,
    marginHorizontal: Spacing.extratiny,
  },
  babyStatus: {
    fontFamily: Font.Bold,
    marginTop: Spacing.small,
    color: color.primary,
    fontSize: TextSize.body,
  },
});

export default MotherBabyCard;
