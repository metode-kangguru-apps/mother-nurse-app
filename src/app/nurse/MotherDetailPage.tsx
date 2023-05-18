import BabyCard from "@app/mother/ProfilePage/BabyCard";
import ProfileCard from "@app/mother/ProfilePage/ProfileCard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Baby } from "@redux/actions/authentication/types";
import { getProgressBaby } from "@redux/actions/baby/thunks";
import { clearGlobalState, setSelectedTerapiBaby } from "@redux/actions/global";
import { useAppDispatch } from "@redux/hooks";
import { RootState } from "@redux/types";
import { Timestamp } from "firebase/firestore";
import moment from "moment";
import { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import Header from "src/common/Header";
import { Font } from "src/lib/ui/font";
import { Spacing } from "src/lib/ui/spacing";
import { TextSize } from "src/lib/ui/textSize";
import { weekDifference } from "src/lib/utils/calculate";
import { NurseStackParamList } from "src/router/types";

interface Props
  extends NativeStackScreenProps<NurseStackParamList, "mother-detail"> {}

const MotherDetailPage: React.FC<Props> = ({ navigation }) => {
  const { selectedMotherDetail, selectedTerapiBaby } = useSelector(
    (state: RootState) => state.global
  );

  const dispatch = useAppDispatch();

  function handleSelectBaby(baby: Baby) {
    const babyCreatedAt = baby.createdAt as Timestamp;
    const formatedBabyCreatedAt = new Date(
      babyCreatedAt.seconds * 1000 + babyCreatedAt.nanoseconds / 1000000
    );
    const weekDiff = weekDifference(formatedBabyCreatedAt);
    const currentWeek = baby.gestationAge && baby.gestationAge + weekDiff;

    let selectedBabyDocument = {
      ...baby,
      currentWeek,
    };

    dispatch(setSelectedTerapiBaby(selectedBabyDocument));
    baby.id && dispatch(getProgressBaby(baby.id));
  }

  function handleBack() {
    dispatch(clearGlobalState());
    navigation.pop();
  }

  useEffect(() => {
    if (Object.keys(selectedTerapiBaby).length !== 0) {
      navigation.push("baby-detail");
    }
  }, [selectedTerapiBaby]);

  return (
    <ScrollView contentContainerStyle={style.container}>
      <Header
        title="Profil Pasien"
        titleStyle={{ fontFamily: Font.Bold }}
        onBackButton={handleBack}
      ></Header>
      <View style={style.content}>
        <ProfileCard
          type="mother"
          name={selectedMotherDetail.displayName}
          phoneNumber={selectedMotherDetail.phoneNumber}
          hospitalName={selectedMotherDetail.hospital.name}
          isAbleToCall
          bangsal={selectedMotherDetail.hospital.bangsal}
        ></ProfileCard>
        {selectedMotherDetail.babyCollection && (
          <>
            <Text style={style.titleBaby}>Bayi Terdaftar</Text>
            {selectedMotherDetail.babyCollection.map((baby: Baby) => {
              const dateBirthFormat = moment(
                baby.birthDate,
                "DD/MM/YYYY"
              ).format("DD MMMM YYYY");
              return (
                <BabyCard
                  type="nurse"
                  birthDate={dateBirthFormat}
                  gender={baby.gender}
                  name={baby.displayName}
                  weight={baby.currentWeight}
                  length={baby.currentLength}
                  key={baby.id}
                  status={baby.currentStatus}
                  handleSelectedBabyTerapi={() => handleSelectBaby(baby)}
                />
              );
            })}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const style = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: Spacing.base - Spacing.extratiny,
  },
  titleBaby: {
    marginTop: Spacing.base,
    marginBottom: Spacing.xsmall,
    fontFamily: Font.Medium,
    fontSize: TextSize.title,
  },
});

export default MotherDetailPage;
