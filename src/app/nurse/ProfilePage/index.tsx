import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootState } from "@redux/types";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useSelector } from "react-redux";

import { NurseStackParamList, RootStackParamList } from "src/router/types";

import { useAppDispatch } from "@redux/hooks";
import { useEffect, useMemo } from "react";
import { CompositeScreenProps } from "@react-navigation/native";
import NurseIcon from "src/lib/ui/icons/nurse";
import { color } from "src/lib/ui/color";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { Spacing } from "src/lib/ui/spacing";
import { Font } from "src/lib/ui/font";
import { TextSize } from "src/lib/ui/textSize";
import { Mother } from "@redux/actions/authentication/types";
import MotherBabyCard from "./MotherBabyCard";
import { logOutUser } from "@redux/actions/authentication/thunks";
import { persistor } from "@redux/store";

interface Props
  extends CompositeScreenProps<
    NativeStackScreenProps<NurseStackParamList, "profile">,
    NativeStackScreenProps<RootStackParamList>
  > {}

const ProfilePage: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user, nurse, loading } = useSelector(
    (state: RootState) => state.authentication
  );
  const insets = useSafeAreaInsets();
  const style = useMemo(() => createStyle(insets), [insets]);

  const handleLogOutUser = () => {
    console.log("mantap")
    dispatch(logOutUser());
    persistor.purge()
  };

  return (
    <ScrollView contentContainerStyle={style.flex}>
      <View style={style.wrapper}>
        <View style={style.nurseProfileCard}>
          <View style={style.nurseIconContainer}>
            <NurseIcon />
          </View>
          <View style={style.informationContainer}>
            <View>
              <Text style={style.caption}>Selamat bertugas,</Text>
              <Text style={style.nurseName}>{user.displayName}</Text>
            </View>
            <View style={style.hospitalWrapper}>
              <View style={style.hospitalInformationWrapper}>
                <Text style={style.label}>Bangsal</Text>
                <Text style={style.hospitalInformation}>
                  {nurse.hospital.bangsal}
                </Text>
              </View>
              <View style={style.hospitalInformationWrapper}>
                <Text style={style.label}>Rumah Sakit</Text>
                <Text style={style.hospitalInformation}>
                  {nurse.hospital.name}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={style.motherBabyContainer}>
          <View>
            <Text style={style.titleMotherBaby}>Daftar Ibu dan Bayi</Text>
            <View>
              {nurse.motherCollection &&
                nurse.motherCollection.map((mother: Mother, key: number) => (
                  <MotherBabyCard key={key} motherData={mother} />
                ))}
            </View>
          </View>
          <TouchableOpacity
            style={style.logoutButton}
            onPress={handleLogOutUser}
          >
            <Text style={style.logoutButtonTitle}>Keluar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const createStyle = (insets: EdgeInsets) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    wrapper: {
      flexGrow: 1,
      display: "flex",
    },
    nurseProfileCard: {
      paddingTop: insets.top + Spacing.xlarge / 2,
      paddingHorizontal: Spacing.base,
      paddingBottom: Spacing.xlarge / 2,
      backgroundColor: color.primary,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      width: "100%",
      display: "flex",
      flexDirection: "row",
    },
    nurseIconContainer: {
      flexGrow: 0.05,
    },
    informationContainer: {
      flex: 1,
    },
    caption: {
      fontFamily: Font.Medium,
      fontSize: TextSize.body,
      color: color.accent2,
    },
    nurseName: {
      fontFamily: Font.Bold,
      fontSize: TextSize.h6,
      color: color.lightneutral,
    },
    hospitalWrapper: {
      marginTop: Spacing.small,
    },
    hospitalInformationWrapper: {
      display: "flex",
      flexDirection: "row",
      marginTop: Spacing.extratiny,
    },
    label: {
      flex: 0.3,
      fontFamily: Font.Light,
      color: color.lightneutral,
      fontSize: TextSize.caption,
    },
    hospitalInformation: {
      flex: 0.7,
      fontFamily: Font.Medium,
      color: color.lightneutral,
      fontSize: TextSize.body,
    },
    motherBabyContainer: {
      flex: 1,
      justifyContent: "space-between",
      padding: Spacing.large / 2,
    },
    titleMotherBaby: {
      fontSize: TextSize.title,
      fontFamily: Font.Medium,
    },
    logoutButton: {
      width: "100%",
      backgroundColor: color.lightneutral,
      marginTop: Spacing.large,
      borderWidth: 2,
      borderColor: color.apple,
      borderRadius: 50,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    logoutButtonTitle: {
      fontFamily: Font.Bold,
      padding: Spacing.small,
      fontSize: TextSize.title,
      color: color.apple,
    },
  });

export default ProfilePage;
