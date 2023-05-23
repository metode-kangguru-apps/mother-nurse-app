import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Font } from "src/lib/ui/font";
import { Spacing } from "src/lib/ui/spacing";
import { TextSize } from "src/lib/ui/textSize";
import { MotherStackParamList } from "src/router/types";
import { color } from "src/lib/ui/color";
import LengthBaby from "src/lib/ui/icons/LengthBaby";
import BabyIcon from "src/lib/ui/icons/Baby";
import { useSelector } from "react-redux";
import { RootState, RootStateV2 } from "@redux/types";
import ProfileIcon from "src/lib/ui/icons/Profile";
import HistoryIcon from "src/lib/ui/icons/History";
import AddNoteIcon from "src/lib/ui/icons/AddNote";
import ModuleIcon from "src/lib/ui/icons/Module";
import { Dimensions } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { useMemo } from "react";
import Milestone from "./Milestone";
import { MenuItem } from "./type";
import { helperMilstoneSelectionWeek } from "./helpers";

interface Props extends NativeStackScreenProps<MotherStackParamList, "home"> {}

const HOME_MENU: MenuItem[] = [
  {
    icon: <ProfileIcon />,
    title: "Profile",
    navigationIdentifier: "profile",
  },
  {
    icon: <HistoryIcon />,
    title: "Riwayat",
    navigationIdentifier: "history",
  },
  {
    icon: <AddNoteIcon />,
    title: "Pencatatan",
    navigationIdentifier: "add-progress",
  },
  {
    icon: <ModuleIcon />,
    title: "Modul",
    navigationIdentifier: "module",
  },
];

const HomePage: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const babyData = useSelector((state: RootStateV2) => state.pmkCare.baby);
  const selectedStones = useMemo(
    () => helperMilstoneSelectionWeek(babyData.gender, babyData.currentWeek),
    [babyData.gender, babyData.currentWeek]
  );
  const style = useMemo(() => createStyle(insets), [insets]);
  return (
    <View style={style.container}>
      <View style={style.header}>
        <View style={style.ellipsHead}></View>
        <View style={style.ellipsContent}>
          <View style={style.babyNameWrapper}>
            <Text style={style.babyName}>{babyData.displayName}</Text>
            <View style={style.babyNameBottomLine} />
          </View>
          {/* TODO: @muhammadhafizm baby milestone */}
          <View style={style.babyMilestone}>
            <Milestone
              currentWeight={babyData.currentWeight}
              stones={selectedStones}
            />
          </View>
          <View style={style.babyWeightWrapper}>
            <Text style={style.babyWeight}>{babyData.currentWeight}</Text>
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
              <Text style={style.babyInformationContent}>
                {babyData.currentWeek} Minggu
              </Text>
            </View>
          </View>
          <View style={style.devider}></View>
          <View style={style.lengthBabyContainer}>
            <View style={style.babyInformatonIcon}>
              <LengthBaby
                width={30}
                height={40}
                viewBox={Platform.select({
                  web: "0 10 24 10",
                  native: "0 2.5 24 10",
                })}
              />
            </View>
            <View>
              <Text style={style.babyInformationTitle}>Panjang</Text>
              <Text style={style.babyInformationContent}>
                {babyData.currentLength} cm
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={style.menuWrapper}>
        <View style={style.menuList}>
          {HOME_MENU.map((menuItem, idx) => (
            <TouchableOpacity
              onPress={() => navigation.navigate(menuItem.navigationIdentifier)}
              key={idx}
            >
              <View style={style.menuItemsWrapper}>
                <View style={style.menuIcon}>{menuItem.icon}</View>
                <Text style={style.menuTitle}>{menuItem.title}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={style.buttonStartContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("monitoring")}>
          <View style={style.buttonStart}>
            <Text style={style.buttonStartTitle}>Mulai Sesi PMK</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyle = (insets: EdgeInsets) =>
  StyleSheet.create({
    container: {
      flex: 1,
      overflow: "hidden",
      height: Dimensions.get("window").height,
      position: "relative",
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
      transform: [{ scaleX: 2 }],
      borderBottomStartRadius: 245,
      borderBottomEndRadius: 245,
      position: "absolute",
    },
    ellipsContent: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: Spacing.xlarge / 2,
    },
    babyNameWrapper: {
      alignSelf: "center",
      justifyContent: "center",
      alignItems: "center",
      ...Platform.select({
        web: {
          marginTop: Spacing.base,
        },
        native: {
          marginTop: insets.top,
        },
      }),
    },
    babyNameBottomLine: {
      width: Spacing.xlarge * 1.5,
      height: 2,
      backgroundColor: color.lightneutral,
      opacity: 0.5,
    },
    babyName: {
      color: color.lightneutral,
      fontFamily: Font.Bold,
      fontSize: TextSize.h6,
      paddingBottom: Spacing.xsmall,
      marginTop: Spacing.small,
    },
    babyMilestone: {
      width: "100%",
      paddingVertical: Spacing.xlarge / 2,
    },
    babyWeightWrapper: {
      marginTop: Spacing.small,
      display: "flex",
      alignItems: "center",
    },
    babyWeight: {
      fontFamily: Font.Bold,
      fontSize: TextSize.h3,
      color: color.lightneutral,
    },
    babyWeightMesurement: {
      position: "relative",
      top: -10,
      fontFamily: Font.Medium,
      fontSize: TextSize.title,
      color: color.lightneutral,
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
      paddingHorizontal: Spacing.small,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      position: "relative",
    },
    weekOldBabyContainer: {
      flex: 0.5,
      flexDirection: "row",
      justifyContent: "flex-end",
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
      flex: 0.5,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    babyInformationContent: {
      color: color.neutral,
      fontFamily: Font.Bold,
      fontSize: TextSize.title,
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
      marginTop: Spacing.extratiny,
    },
    buttonStartContainer: {
      position: "absolute",
      width: "100%",
      paddingHorizontal: Spacing.xlarge / 2,
      ...Platform.select({
        web: {
          bottom: Spacing.base,
        },
        native: {
          bottom: Spacing.small + insets.bottom,
        },
      }),
    },
    buttonStart: {
      width: "100%",
      paddingVertical: Spacing.small,
      backgroundColor: color.secondary,
      borderRadius: 30,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "flex-end",
    },
    buttonStartTitle: {
      fontFamily: Font.Medium,
      color: color.lightneutral,
    },
  });

export default HomePage;
