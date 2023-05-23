import BabyCard from "@app/mother/ProfilePage/BabyCard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAppDispatch } from "@redux/hooks";
import { RootState, RootStateV2 } from "@redux/types";
import moment from "moment";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { AntDesign } from "@expo/vector-icons";

import Header from "src/common/Header";
import { color } from "src/lib/ui/color";
import { Font } from "src/lib/ui/font";
import { Spacing } from "src/lib/ui/spacing";
import { NurseStackParamList } from "src/router/types";
import { TextSize } from "src/lib/ui/textSize";

import { FontAwesome5 } from "@expo/vector-icons";
import MotherIcons from "src/lib/ui/icons/mother";

interface Props
  extends NativeStackScreenProps<NurseStackParamList, "baby-detail"> {}

const DetailBabyPage: React.FC<Props> = ({ navigation }) => {
  const { baby } = useSelector((state: RootStateV2) => state.pmkCare);
  const dateBirthFormat = moment(baby.birthDate, "DD/MM/YYYY").format(
    "DD MMMM YYYY"
  );

  function handleBack() {
    navigation.pop()
  }

  return (
    <ScrollView
      contentContainerStyle={style.container}
      showsVerticalScrollIndicator={false}
    >
      <Header
        title="Profil Bayi"
        titleStyle={{ fontFamily: Font.Bold }}
        onBackButton={handleBack}
      />
      <View style={style.content}>
        <BabyCard
          type="nurse"
          birthDate={dateBirthFormat}
          gender={baby.gender}
          name={baby.displayName}
          weight={baby.currentWeight}
          length={baby.currentLength}
          status={baby.currentStatus}
          showSelectBaby={false}
        />
        <View style={style.buttonNavigationContainer}>
          <TouchableOpacity onPress={() => navigation.push("history-progress")}>
            <View style={style.moduleMenu}>
              <View style={style.moduleContent}>
                <View style={style.moduleIcon}>
                  <FontAwesome5
                    name="thermometer-three-quarters"
                    size={24}
                    color={color.primary}
                  />
                </View>
                <Text style={style.moduleTitle}>Riwayat Pertumbuhan</Text>
              </View>
              <View style={style.moduleGoToButton}>
                <AntDesign name="arrowright" size={20} color={color.primary} />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.push("session")}>
            <View style={style.moduleMenu}>
              <View style={style.moduleContent}>
                <View style={style.moduleIcon}>
                  <MotherIcons
                    width={24}
                    height={28}
                    viewBox="0 0 30 34"
                    color={color.primary}
                  />
                </View>
                <Text style={style.moduleTitle}>Riwayat Sesi PMK</Text>
              </View>
              <View style={style.moduleGoToButton}>
                <AntDesign name="arrowright" size={20} color={color.primary} />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const style = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  content: {
    padding: Spacing.base - Spacing.extratiny,
  },
  buttonNavigationContainer: {
    marginTop: Spacing.base,
  },
  moduleMenu: {
    flex: 1,
    padding: Spacing.base,
    backgroundColor: color.lightneutral,
    borderRadius: 10,
    marginBottom: Spacing.tiny,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
  },
  moduleContent: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  moduleIcon: {
    flex: 0.07,
    marginRight: Spacing.base,
    justifyContent: "center",
    alignItems: "center",
  },
  moduleTitle: {
    flex: 0.85,
    fontFamily: Font.Medium,
    fontSize: TextSize.title,
  },
  moduleGoToButton: {
    display: "flex",
    justifyContent: "center",
  },
});

export default DetailBabyPage;
