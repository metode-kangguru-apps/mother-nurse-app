import BabyCard from "@app/mother/ProfilePage/BabyCard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAppDispatch } from "@redux/hooks";
import { RootState } from "@redux/types";
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

interface Props
  extends NativeStackScreenProps<NurseStackParamList, "baby-detail"> {}

const DetailBabyPage: React.FC<Props> = ({ navigation }) => {
  const { selectedTerapiBaby } = useSelector(
    (state: RootState) => state.global
  );
  const dispatch = useAppDispatch();
  const dateBirthFormat = moment(
    selectedTerapiBaby.birthDate,
    "DD/MM/YYYY"
  ).format("DD MMMM YYYY");

  function handleBack() {
    navigation.pop();
  }

  function handleSelectedBaby() {
    console.log("Progress", selectedTerapiBaby);
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
          gender={selectedTerapiBaby.gender}
          name={selectedTerapiBaby.displayName}
          weight={selectedTerapiBaby.currentWeight}
          length={selectedTerapiBaby.currentLength}
          status={selectedTerapiBaby.currentStatus}
          showSelectBaby={false}
        />
        <>
          <TouchableOpacity onPress={handleSelectedBaby}>
            <View style={style.buttonProgress}>
              <Text style={style.progressText}>
                Catat <Text style={style.bold}>Pertumbuhan</Text>
              </Text>
              <AntDesign
                name="pluscircleo"
                size={20}
                color={color.lightneutral}
              />
            </View>
          </TouchableOpacity>
        </>
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
  buttonProgress: {
    width: "100%",
    borderRadius: Spacing.xlarge,
    backgroundColor: color.secondary,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.small + Spacing.extratiny / 2,
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    marginVertical: Spacing.xsmall,
  },
  bold: {
    fontFamily: Font.Bold,
  },
  progressText: {
    color: color.lightneutral,
    marginRight: Spacing.xsmall,
  },
});

export default DetailBabyPage;
