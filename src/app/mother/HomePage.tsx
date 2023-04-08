import { StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Font } from "src/lib/ui/font";
import { Spacing } from "src/lib/ui/spacing";
import { TextSize } from "src/lib/ui/textSize";
import { MotherStackParamList } from "src/router/types";
import { color } from "src/lib/ui/color";
import LengthBaby from "src/lib/ui/icons/lengthBaby";
import BabyIcon from "src/lib/ui/icons/baby";
import { useSelector } from "react-redux";
import { RootState } from "@redux/types";
import ProfileIcon from "src/lib/ui/icons/profile";
import HistoryIcon from "src/lib/ui/icons/history";
import AddNoteIcon from "src/lib/ui/icons/addNote";
import ModuleIcon from "src/lib/ui/icons/module";
import { Dimension } from "src/lib/ui/unit";
import { Dimensions } from "react-native";

interface Props extends NativeStackScreenProps<MotherStackParamList, "home"> {}

const HomePage: React.FC<Props> = ({ navigation }) => {
  const { babyObj: baby } = useSelector(
    (state: RootState) => state.global.selectedTerapiBaby
  );
  return (
    <View style={style.container}>
      <View style={style.header}>
        <View style={style.ellipsHead}></View>
        <View style={style.ellipsContent}>
            <View style={style.babyNameWrapper}>
              <Text style={style.babyName}>Nadia Nurotul Fuadah</Text>
              <View style={style.babyNameBottomLine}/>
            </View>
            <View style={style.babyMilestone}>
              <Text>Hello World</Text>
            </View>
            <View style={style.babyWeightWrapper}>
              <Text style={style.babyWeight}>{baby.weight}</Text>
              <Text style={style.babyWeightMesurement}>gram</Text>
            </View>
        </View>
      </View>
      <View style={style.babyInformation}>
        <View style={style.babyInformationWrapper}>
          <View style={style.weekOldBabyContainer}>
            <View style={style.babyInformatonIcon}>
              <BabyIcon
                color={color.primary}
                width={37}
                height={37}
                viewBox="0 0 33 33"
              />
            </View>
            <View>
              <Text style={style.babyInformationTitle}>Usia</Text>
              <Text style={style.babyInformationContent}>{baby.gestationAge} Minggu</Text>
            </View>
          </View>
          <View style={style.devider}></View>
          <View style={style.lengthBabyContainer}>
            <View style={style.babyInformatonIcon}>
              <LengthBaby width={30} height={40} viewBox="0 10 24 10" />
            </View>
            <View>
              <Text style={style.babyInformationTitle}>Panjang</Text>
              <Text style={style.babyInformationContent}>{baby.length} cm</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={style.menuWrapper}>
        <View style={style.menuList}>
          <View style={style.menuItemsWrapper}>
            <View style={style.menuIcon}>
              <ProfileIcon/>
            </View>
            <Text style={style.menuTitle}>Profil</Text>
          </View>
          <View style={style.menuItemsWrapper}>
            <View style={style.menuIcon}>
              <HistoryIcon/>
            </View>
            <Text style={style.menuTitle}>Riwayat</Text>
          </View>
          <View style={style.menuItemsWrapper}>
            <View style={style.menuIcon}>
              <AddNoteIcon/>
            </View>
            <Text style={style.menuTitle}>Pencatatan</Text>
          </View>
          <View style={style.menuItemsWrapper}>
            <View style={style.menuIcon}>
              <ModuleIcon/>
            </View>
            <Text style={style.menuTitle}>Modul</Text>
          </View>
        </View>
      </View>
      <View style={style.buttonStartContainer}>
        <View style={style.buttonStart}>
          <Text style={style.buttonStartTitle}>Mulai Sesi PMK</Text>
        </View>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
    height: Dimensions.get("screen").height,
    position: "relative"
  },
  header: {
    minHeight: 240,
    zIndex: 1,
  },
  ellipsHead: {
    height: "100%",
    width: "100%",
    padding: Spacing.base,
    backgroundColor: color.primary,
    transform: [{ scaleX: 1.5 }],
    borderBottomStartRadius: 245,
    borderBottomEndRadius: 245,
    position: "absolute"
  },
  ellipsContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.xlarge / 2
  },
  babyNameWrapper: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.large
  },
  babyNameBottomLine: {
    width: "70%",
    height: 2,
    backgroundColor: color.lightneutral,
    opacity: .5
  },
  babyName: {
    color: color.lightneutral,
    fontFamily: Font.Bold,
    fontSize: TextSize.h6,
    paddingBottom: Spacing.xsmall
  },
  babyMilestone: {
    paddingVertical: Spacing.xlarge / 2
  },
  babyWeightWrapper: {
    marginTop: Spacing.small,
    display: "flex",
    alignItems: "center"
  },
  babyWeight: {
    fontFamily: Font.Bold,
    fontSize: TextSize.h4,
    color: color.lightneutral
  },
  babyWeightMesurement: {
    fontFamily: Font.Medium,
    fontSize: TextSize.title,
    color: color.lightneutral
  },
  babyInformation: {
    width: "100%",
    height: 230,
    paddingTop: 110,
    backgroundColor: color.lightneutral,
    borderBottomEndRadius: 30,
    borderBottomStartRadius: 30,
    marginTop: -80,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  babyInformationWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    position: "relative",
    left: -20,
  },
  weekOldBabyContainer: {
    display: "flex",
    flexDirection: "row",
  },
  babyInformatonIcon: {
    marginRight: Spacing.small,
  },
  babyInformationTitle: {
    fontSize: TextSize.body,
    color: color.primary,
  },
  devider: {
    width: 1,
    height: 80,
    backgroundColor: color.primary,
    marginHorizontal: 30,
    opacity: 0.3,
  },
  lengthBabyContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  babyInformationContent: {
    color: color.neutral,
    fontFamily: Font.Bold,
    fontSize: TextSize.h6,
  },
  menuWrapper: {
    padding: Spacing.xlarge / 2,
    paddingTop: Spacing.base,
  },
  menuList: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  menuItemsWrapper: {
    display: "flex",
    alignItems: "center",
  },
  menuIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 52,
    height: 52,
    backgroundColor: "rgba(244, 139, 136, .2)",
    borderRadius: 8,
  },
  menuTitle: {
    fontFamily: Font.Medium,
    fontSize: TextSize.overline,
    marginTop: Spacing.extratiny
  },
  buttonStartContainer: {
    position: "absolute",
    bottom: Spacing.base,
    width: "100%",
    paddingHorizontal: Spacing.xlarge / 2,
  },
  buttonStart: {
    width: "100%",
    paddingVertical: Spacing.base,
    backgroundColor: color.secondary,
    borderRadius: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end"
  },
  buttonStartTitle: {
    fontFamily: Font.Medium,
    color: color.lightneutral
  }
});

export default HomePage;
