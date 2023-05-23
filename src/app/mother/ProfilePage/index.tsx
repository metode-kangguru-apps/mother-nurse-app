import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import moment from "moment";

import { useSelector } from "react-redux";
import { RootStateV2 } from "@redux/types";
import { useAppDispatch } from "@redux/hooks";
import { Baby } from "@redux/actions/pmkCare/types";
import { Mother } from "@redux/actions/authentication/types";

import {
  FIREBASE_IOS_CLIENT_ID,
  FIREBASE_WEB_CLIENT_ID,
  FIREBASE_ANDROID_CLIENT_ID,
} from "@env";

import Info from "src/common/Info";
import Header from "src/common/Header";

import { Font } from "src/lib/ui/font";
import { color } from "src/lib/ui/color";
import { Spacing } from "src/lib/ui/spacing";
import { TextSize } from "src/lib/ui/textSize";
import GoogleIcon from "src/lib/ui/icons/Google";

import { AntDesign } from "@expo/vector-icons";

import BabyCard from "./BabyCard";
import ProfileCard from "./ProfileCard";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CompositeScreenProps } from "@react-navigation/native";

import { MotherStackParamList, RootStackParamList } from "src/router/types";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

import { GoogleAuthProvider } from "firebase/auth/react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

import {
  bindAnonymousAccountToGoogle,
  logingOutUser,
} from "@redux/actions/authentication/thunks";
import { getBabyProgressAndSession } from "@redux/actions/pmkCare/thunks";

WebBrowser.maybeCompleteAuthSession();

interface Props
  extends CompositeScreenProps<
    NativeStackScreenProps<MotherStackParamList, "profile">,
    NativeStackScreenProps<RootStackParamList>
  > {}

const ProfilePage: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>();
  const user = useSelector(
    (state: RootStateV2) => state.authentication.user as Mother
  );
  const babyData = useSelector((state: RootStateV2) => state.pmkCare.baby);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    expoClientId: FIREBASE_WEB_CLIENT_ID,
    webClientId: FIREBASE_WEB_CLIENT_ID,
    iosClientId: FIREBASE_IOS_CLIENT_ID,
    androidClientId: FIREBASE_ANDROID_CLIENT_ID,
  });

  const insets = useSafeAreaInsets();
  const style = useMemo(() => createStyle(insets), [insets]);

  const handleLogOutUser = () => {
    dispatch(logingOutUser());
  };

  useEffect(() => {
    if (response?.type === "success") {
      setLoading(true);
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      dispatch(bindAnonymousAccountToGoogle(credential)).then(() => {
        setLoading(false);
      });
    }
  }, [response, dispatch]);

  function handleSelectedBabyTerapi(babyObj: Baby) {
    setLoading(true);
    dispatch(
      getBabyProgressAndSession({ userID: user.uid, baby: babyObj })
    ).then(() => {
      setLoading(false);
      navigation.navigate("home");
    });
  }

  function renderBabyItem(item: Baby, index: number) {
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
        key={index}
        handleSelectedBabyTerapi={() => handleSelectedBabyTerapi(item)}
      ></BabyCard>
    );
  }

  return (
    <View style={style.flex}>
      {loading && (
        <View style={style.loadingWrapper}>
          <ActivityIndicator
            size={"large"}
            color={color.primary}
          ></ActivityIndicator>
        </View>
      )}
      <Header
        title="Kembali"
        onBackButton={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            babyData && navigation.navigate("home");
          }
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* TODO: muhammadhafizm implement loading state */}
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
                phoneNumber={"+62 " + user.phoneNumber}
                hospitalName={user.hospital.name}
                bangsal={user.hospital.bangsal}
              />
              {user.isAnonymous && (
                <TouchableOpacity
                  disabled={!request}
                  onPress={() => promptAsync({})}
                >
                  <View style={style.buttonBindGoogle}>
                    <GoogleIcon style={style.googleIcon} />
                    <Text style={style.bindGoogleText}>
                      Sambungkan ke Google
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
            <View style={style.babyContainer}>
              <Text style={style.titleBabyProfile}>Profil Bayi</Text>
              <TouchableWithoutFeedback
                onPress={() => navigation.push("add-new-baby")}
              >
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
                {user.babyCollection.map((baby: Baby, key: number) =>
                  renderBabyItem(baby, key)
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

const createStyle = (insets: EdgeInsets) =>
  StyleSheet.create({
    flex: {
      flex: 1,
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
      marginBottom: insets.bottom,
    },
    logoutButtonTitle: {
      fontFamily: Font.Bold,
      padding: Spacing.small,
      fontSize: TextSize.title,
      color: color.apple,
    },
  });

export default ProfilePage;
