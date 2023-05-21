import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { color } from "src/lib/ui/color";
import BabyIcon from "src/lib/ui/icons/baby";
import { EvilIcons } from "@expo/vector-icons";
import { Spacing } from "src/lib/ui/spacing";
import { TextSize } from "src/lib/ui/textSize";
import { Baby } from "@redux/actions/authentication/types";
import { Font } from "src/lib/ui/font";
import { BabyStatus } from "@redux/actions/baby/types";
import { AntDesign } from "@expo/vector-icons";
import { useMemo } from "react";

export enum Gender {
  "laki-laki" = "Laki-laki",
  "perempuan" = "Perempuan",
}

interface Props {
  type?: "mother" | "nurse";
  birthDate?: string;
  gender?: Baby["gender"];
  name?: string;
  weight?: number;
  length?: number;
  status?: string;
  showSelectBaby?: boolean;
  handleSelectedBabyTerapi?: () => void;
}

const BabyCard: React.FC<Props> = ({
  type = "mother",
  birthDate,
  gender,
  name,
  weight,
  length,
  status,
  showSelectBaby = true,
  handleSelectedBabyTerapi,
}) => {
  const style = useMemo(() => createStyle(type), [type]);
  return (
    <View style={style.container}>
      {status &&
        status !== BabyStatus.FINNISH &&
        status !== BabyStatus.ON_PROGRESS && (
          <View style={style.statusWarn}>
            <AntDesign name="warning" size={16} color={color.apple} />
            <Text style={style.statusWarnText}>{status}</Text>
          </View>
        )}
      <View style={style.header}>
        <View>
          <BabyIcon
            width={type === "mother" ? 34 : 40}
            height={type === "mother" ? 36 : 42}
            viewBox="0 0 32 34"
            color={gender === "laki-laki" ? color.primary : color.secondary}
          />
        </View>
        <View style={style.babyInformation}>
          <Text style={style.babyBirthDate}>Lahir: {birthDate}</Text>
          <Text style={style.babyGender}>{gender && Gender[gender]}</Text>
          <Text style={style.babyName}>{name}</Text>
          {type === "nurse" && (
            <View style={style.info}>
              <Text style={style.babyInfoText}>Berat {weight} gr</Text>
              <View style={style.devider}></View>
              <Text style={style.babyInfoText}>Panjang {length} cm</Text>
            </View>
          )}
        </View>
      </View>
      {type === "mother" && (
        <View style={style.info}>
          <Text style={style.babyInfoText}>Berat {weight} gr</Text>
          <View style={style.devider}></View>
          <Text style={style.babyInfoText}>Panjang {length} cm</Text>
        </View>
      )}
      {showSelectBaby && (
        <TouchableOpacity onPress={handleSelectedBabyTerapi}>
          <View style={style.buttonStartTerapi}>
            <Text
              style={[
                style.buttonTitle,
                {
                  color:
                    gender === "laki-laki" ? color.primary : color.secondary,
                },
              ]}
            >
              {type === "mother" ? "Lakukan Terapi" : "Lihat Riwayat"}
            </Text>
            <View>
              <EvilIcons
                name="arrow-right"
                size={24}
                color={gender === "laki-laki" ? color.primary : color.secondary}
              />
            </View>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const createStyle = (type: "mother" | "nurse") =>
  StyleSheet.create({
    container: {
      width: "100%",
      backgroundColor: color.lightneutral,
      borderRadius: 20,
      padding: type === "mother" ? Spacing.small : Spacing.base,
      marginBottom: Spacing.tiny,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 7,
    },
    statusWarnText: {
      fontFamily: Font.Regular,
      fontSize: TextSize.title,
      paddingLeft: Spacing.tiny,
      color: color.apple,
    },
    statusWarn: {
      paddingBottom: Spacing.xsmall,
      marginBottom: Spacing.xsmall,
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      borderBottomWidth: 1,
      borderColor: color.surface,
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
      fontSize: TextSize.body,
      color: color.accent2,
      marginVertical: Spacing.extratiny / 2,
    },
    babyName: {
      fontFamily: Font.Medium,
      fontSize: TextSize.h4 / 2,
    },
    info: {
      display: "flex",
      flexDirection: "row",
      marginTop: Spacing.extratiny,
      alignItems: "center",
    },
    babyInfoText: {
      fontSize: TextSize.body,
      color: color.accent2,
    },
    devider: {
      width: 1,
      height: Spacing.small,
      backgroundColor: color.accent2,
      marginHorizontal: Spacing.tiny,
    },
    buttonStartTerapi: {
      marginTop: Spacing.small,
      marginBottom: Spacing.extratiny,
      paddingRight: Spacing.tiny,
      display: "flex",
      flexDirection: "row",
      alignSelf: "flex-end",
      alignItems: "center",
    },
    buttonTitle: {
      fontSize: TextSize.body,
      fontFamily: Font.Regular,
      marginRight: Spacing.extratiny,
    },
  });
export default BabyCard;
