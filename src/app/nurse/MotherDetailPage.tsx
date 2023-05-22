import moment from "moment";
import { useEffect, useState } from "react";

import BabyCard from "@app/mother/ProfilePage/BabyCard";
import ProfileCard from "@app/mother/ProfilePage/ProfileCard";

import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStateV2 } from "@redux/types";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@redux/hooks";
import { Timestamp } from "firebase/firestore";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Font } from "src/lib/ui/font";
import { Spacing } from "src/lib/ui/spacing";
import { TextSize } from "src/lib/ui/textSize";
import { weekDifference } from "src/lib/utils/calculate";

import Header from "src/common/Header";
import { NurseStackParamList } from "src/router/types";
import { getBabyProgressAndSession } from "@redux/actions/pmkCare/thunks";
import { Baby } from "@redux/actions/pmkCare/types";
import { clearPMKCareState } from "@redux/actions/pmkCare";
import { color } from "src/lib/ui/color";

interface Props
  extends NativeStackScreenProps<NurseStackParamList, "mother-detail"> {}

const MotherDetailPage: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { mother, baby } = useSelector((state: RootStateV2) => state.pmkCare);
  const [loading, setLoading] = useState<boolean>();

  function handleSelectBaby(baby: Baby) {
    setLoading(true);
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
    dispatch(
      getBabyProgressAndSession({
        userID: mother.uid,
        baby: selectedBabyDocument,
      })
    ).then(() => {
      navigation.push("baby-detail");
      setLoading(false);
    });
  }

  function handleBack() {
    dispatch(clearPMKCareState());
  }

  return (
    <>
      {loading && (
        <View style={style.loadingWrapper}>
          <ActivityIndicator
            size={"large"}
            color={color.primary}
          ></ActivityIndicator>
        </View>
      )}
      <ScrollView contentContainerStyle={style.container}>
        <Header
          title="Profil Pasien"
          titleStyle={{ fontFamily: Font.Bold }}
          onBackButton={handleBack}
        ></Header>
        <View style={style.content}>
          <ProfileCard
            type="mother"
            name={mother.displayName}
            phoneNumber={mother.phoneNumber}
            hospitalName={mother.hospital.name}
            isAbleToCall
            bangsal={mother.hospital.bangsal}
          ></ProfileCard>
          {mother.babyCollection && (
            <>
              <Text style={style.titleBaby}>Bayi Terdaftar</Text>
              {mother.babyCollection.map((baby: Baby) => {
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
    </>
  );
};

const style = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  loadingWrapper: {
    flex: 1,
    zIndex: 2,
    width: "100%",
    height: "100%",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
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
