import BabyCard from "@app/mother/ProfilePage/BabyCard";
import ProfileCard from "@app/mother/ProfilePage/ProfileCard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Baby } from "@redux/actions/authentication/types";
import { RootState } from "@redux/types";
import moment from "moment";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import Header from "src/common/Header";
import { Font } from "src/lib/ui/font";
import { Spacing } from "src/lib/ui/spacing";
import { TextSize } from "src/lib/ui/textSize";
import { NurseStackParamList } from "src/router/types";

interface Props
  extends NativeStackScreenProps<NurseStackParamList, "mother-detail"> {}

const MotherDetailPage: React.FC<Props> = ({ navigation }) => {
  const { selectedMotherDetail } = useSelector(
    (state: RootState) => state.global
  );
  return (
    <ScrollView contentContainerStyle={style.container}>
      <Header
        title="Profil Pasien"
        titleStyle={{ fontFamily: Font.Bold }}
        onBackButton={() => navigation.pop()}
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
