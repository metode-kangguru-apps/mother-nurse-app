import { StyleSheet, Text, View } from "react-native";
import { color } from "src/lib/ui/color";
import { Font } from "src/lib/ui/font";
import MotherIcons from "src/lib/ui/icons/mother";
import { Spacing } from "src/lib/ui/spacing";
import { TextSize } from "src/lib/ui/textSize";

interface Props {
  type: "mother" | "nurse";
  name: string;
  phoneNumber: string;
  hospitalName: string;
  bangsal: string;
}

const ProfileCard: React.FC<Props> = ({
  type,
  name,
  phoneNumber,
  hospitalName,
  bangsal,
}) => {
  return (
    <View style={style.container}>
      <View style={style.header}>
        <View style={style.icons}>
          {type === "mother" && <MotherIcons></MotherIcons>}
        </View>
        <View style={style.userInformation}>
          <Text style={style.userName}>{name}</Text>
          <Text style={style.userPhoneNumber}>{phoneNumber}</Text>
        </View>
      </View>
      <View style={style.content}>
        <View style={style.smallInformation}>
          <Text style={style.labelForm}>Rumah Sakit</Text>
          <Text style={style.valueForm}>{hospitalName}</Text>
        </View>
        <View style={style.smallInformation}>
          <Text style={style.labelForm}>Bangsal</Text>
          <Text style={style.valueForm}>{bangsal}</Text>
        </View>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: color.primary,
    borderRadius: 10,
    padding: Spacing.base - Spacing.extratiny,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  icons: {
    marginRight: Spacing.base,
  },
  userInformation: {},
  userName: {
    fontFamily: Font.Bold,
    fontSize: TextSize.h6,
    color: color.lightneutral,
  },
  userPhoneNumber: {
    color: color.lightneutral,
    opacity: 0.6,
  },
  content: {
    marginTop: Spacing.small,
  },
  smallInformation: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.extratiny,
  },
  labelForm: {
    color: color.lightneutral,
    marginRight: Spacing.tiny,
    fontSize: TextSize.overline,
    width: 70,
  },
  valueForm: {
    color: color.lightneutral,
    fontSize: TextSize.body,
  },
});

export default ProfileCard;
