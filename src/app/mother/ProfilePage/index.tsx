import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootState } from "@redux/types";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import moment from "moment";
import { useSelector } from "react-redux";
import Header from "src/common/Header";
import Info from "src/common/Info";
import { color } from "src/lib/ui/color";
import { Font } from "src/lib/ui/font";
import GoogleIcon from "src/lib/ui/icons/google";
import { Spacing } from "src/lib/ui/spacing";
import { TextSize } from "src/lib/ui/textSize";
import { MotherStackParamList, RootStackParamList } from "src/router/types";
import { AntDesign } from "@expo/vector-icons";

import ProfileCard from "./ProfileCard";
import BabyCard from "./BabyCard";

import { useAppDispatch } from "@redux/hooks";
import { logOutUser } from "@redux/actions/authentication/thunks";
import { useEffect } from "react";
import { CompositeScreenProps } from "@react-navigation/native";
import { Baby } from "@redux/actions/authentication/types";
import { setSelectedTerapiBaby } from "@redux/actions/global";
interface Props
  extends CompositeScreenProps<
    NativeStackScreenProps<MotherStackParamList, "profile">,
    NativeStackScreenProps<RootStackParamList>
  > {}

const ProfilePage: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { selectedTerapiBaby } = useSelector(
    (state: RootState) => state.global
  );
  const { user, mother, loading } = useSelector(
    (state: RootState) => state.authentication
  );

  const handleLogOutUser = () => {
    dispatch(logOutUser());
  };

  function handleSelectedBabyTerapi(babyObj: Baby) {
    dispatch(setSelectedTerapiBaby(babyObj))
    navigation.navigate("home")
  }

  function renderBabyItem(item: Baby) {
    const dateBirthFormat = moment(item.birthDate, "DD/MM/YYYY").format(
      "DD MMMM YYYY"
    );
    return (
      <BabyCard
        birthDate={dateBirthFormat}
        gender={item.gender}
        name={item.displayName}
        weight={item.currentWeight}
        length={item.currentLength}
        key={item.id}
        handleSelectedBabyTerapi={() => handleSelectedBabyTerapi(item)}
      ></BabyCard>
    );
  }

  useEffect(() => {
    if (!loading && !user) {
      navigation.navigate("auth", {
        screen: "login",
      });
    }
  }, [loading, user]);

  return (
    <View style={style.flex}>
      <Header
        title="Kembali"
        onBackButton={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            selectedTerapiBaby && navigation.navigate("home");
          }
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          {user.isAnonymous && (
            <Info
              type="warning"
              title="Hubungkan akun dengan Google"
              message="Akun Anda tidak terhubung dengan Google sehingga data tidak akan
                tersimpan"
            ></Info>
          )}
          <View style={style.content}>
            {/* TODO: muhammadhafizm integrate with data nurse name and hospital name */}
            <View style={style.profileWrapper}>
              <ProfileCard
                type="mother"
                name={user.displayName}
                phoneNumber={"+62 " + mother.phoneNumber}
                nurseName="Riska Larasati"
                hospitalName="RS Sehati"
              />
              {user.isAnonymous && (
                <View style={style.buttonBindGoogle}>
                  <GoogleIcon style={style.googleIcon} />
                  <Text style={style.bindGoogleText}>Sambungkan ke Google</Text>
                </View>
              )}
            </View>
            <View style={style.babyContainer}>
              <Text style={style.titleBabyProfile}>Profil Bayi</Text>
              <TouchableWithoutFeedback onPress={() => navigation.navigate("add-new-baby")}>
                <View style={style.header} pointerEvents="box-only">
                  <Text style={style.headerTitle}>Tambah Bayi</Text>
                  <View>
                    <AntDesign
                      name="pluscircleo"
                      size={20}
                      color={color.secondary}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
              <View>
                {mother.babyCollection.map((baby: Baby, _: any) =>
                  renderBabyItem(baby)
                )}
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
    </View>
  );
};

const style = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    padding: Spacing.base,
    width: "100%",
  },
  profileWrapper: {
    marginBottom: Spacing.xlarge / 2,
  },
  buttonBindGoogle: {
    width: "100%",
    marginTop: Spacing.small,
    paddingHorizontal: Spacing.xlarge / 2,
    paddingVertical: Spacing.small,
    borderRadius: 50,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color.lightneutral,
  },
  googleIcon: {
    marginRight: Spacing.small,
  },
  bindGoogleText: {
    fontSize: TextSize.title,
    color: color.neutral,
    fontFamily: Font.Bold,
  },
  babyContainer: {
    width: "100%",
  },
  titleBabyProfile: {
    fontFamily: Font.Bold,
    fontSize: TextSize.h5,
  },
  header: {
    marginVertical: Spacing.small,
    alignSelf: "flex-end",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: TextSize.title,
    color: color.secondary,
    marginRight: Spacing.tiny,
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
