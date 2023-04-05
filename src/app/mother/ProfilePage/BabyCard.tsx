import { StyleSheet, Text, View } from "react-native";
import { color } from "src/lib/ui/color";
import BabyIcon from "src/lib/ui/icons/baby";
import { EvilIcons } from "@expo/vector-icons";
import { Spacing } from "src/lib/ui/spacing";
import { TextSize } from "src/lib/ui/textSize";
import { Baby } from "@redux/actions/authentication/types";

export enum Gender {
  "laki-laki" = "Laki-laki",
  "perempuan" = "Perempuan",
}

interface Props {
  birthDate?: string;
  gender?: Baby["gender"];
  name?: string;
  weight?: number;
  length?: number;
  isSelectedBaby?: boolean;
}

const BabyCard: React.FC<Props> = ({
  birthDate,
  gender,
  name,
  weight,
  length,
  isSelectedBaby,
}) => {
  return (
    <View style={style.container}>
      <View style={style.header}>
        <View>
          <BabyIcon
            color={gender === "laki-laki" ? color.primary : color.secondary}
          />
        </View>
        <View style={style.babyInformation}>
          <Text style={style.babyBirthDate}>{birthDate}</Text>
          <Text style={style.babyGender}>{gender && Gender[gender]}</Text>
          <Text style={style.babyName}>{name}</Text>
        </View>
      </View>
      <View style={style.info}>
        <Text style={style.babyInfoText}>Berat {weight} gr</Text>
        <View style={style.devider}></View>
        <Text style={style.babyInfoText}>Panjang {length} cm</Text>
      </View>
      {!isSelectedBaby && (
        <View style={style.buttonStartTerapi}>
          <Text
            style={[
              style.buttonTitle,
              {
                color: gender === "laki-laki" ? color.primary : color.secondary,
              },
            ]}
          >
            Lakukan Terapi
          </Text>
          <View>
            <EvilIcons
              name="arrow-right"
              size={24}
              color={gender === "laki-laki" ? color.primary : color.secondary}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: color.lightneutral,
    borderRadius: 20,
    padding: Spacing.small,
    marginBottom: Spacing.tiny,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 7,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  babyInformation: {
    marginLeft: Spacing.small,
  },
  babyBirthDate: {
    fontSize: TextSize.caption,
    color: color.neutral,
  },
  babyGender: {
    fontSize: TextSize.caption,
    color: color.accent2,
    marginVertical: Spacing.extratiny / 2,
  },
  babyName: {
    fontSize: TextSize.title,
  },
  info: {
    display: "flex",
    flexDirection: "row",
    marginTop: Spacing.extratiny,
    alignItems: "center",
  },
  babyInfoText: {
    fontSize: TextSize.caption,
    color: color.accent2,
  },
  devider: {
    width: 1,
    height: "80%",
    backgroundColor: color.accent2,
    marginHorizontal: Spacing.tiny,
  },
  buttonStartTerapi: {
    marginTop: Spacing.small,
    padding: Spacing.tiny,
    display: "flex",
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "center",
  },
  buttonTitle: {
    marginRight: Spacing.extratiny,
    fontSize: TextSize.caption,
  },
});
export default BabyCard;
