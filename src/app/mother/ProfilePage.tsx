import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootState } from "@redux/types";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import Header from "src/common/Header";
import Info from "src/common/Info";
import { MotherStackParamList } from "src/router/types";

interface Props
  extends NativeStackScreenProps<MotherStackParamList, "profile"> {}

const ProfilePage: React.FC<Props> = ({ navigation }) => {
  const { selectedTerapiBaby } = useSelector(
    (state: RootState) => state.global
  );
  return (
    <View>
      <Header
        title="Kembali"
        onBackButton={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            selectedTerapiBaby &&
              navigation.navigate("home", { "baby-id": selectedTerapiBaby });
          }
        }}
      />
      <Info
        type="warning"
        title="Hubungkan akun dengan Google"
        message="Akun Anda tidak terhubung dengan Google sehingga data tidak akan
                tersimpan"
      ></Info>
    </View>
  );
};

export default ProfilePage;
