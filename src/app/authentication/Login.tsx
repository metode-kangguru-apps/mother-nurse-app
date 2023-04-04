import { FIREBASE_WEB_CLIENT_ID } from "@env";
import { useEffect } from "react";
import { GoogleAuthProvider } from "firebase/auth/react-native";
import { AuthStackParamList, RootStackParamList } from "src/router/types";

import { Font } from "src/lib/ui/font";
import { Spacing } from "src/lib/ui/spacing";
import { TextSize } from "src/lib/ui/textSize";

import { useAssets } from "expo-asset";
import { useAppDispatch } from "@redux/hooks";
import * as WebBrowser from "expo-web-browser";

import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { loginWithGoogle } from "@redux/actions/authentication/thunks";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import * as Google from "expo-auth-session/providers/google";
import { color } from "src/lib/ui/color";
import { User } from "@redux/actions/authentication/types";
import { setUserData } from "@redux/actions/authentication";
import { useSelector } from "react-redux";
import { RootState } from "@redux/types";
import { CompositeScreenProps } from "@react-navigation/native";
import GoogleIcon from "src/lib/ui/icons/google";

WebBrowser.maybeCompleteAuthSession();

interface Props
  extends CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, "login">,
    NativeStackScreenProps<RootStackParamList>
  > {}

const Login: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: FIREBASE_WEB_CLIENT_ID,
  });

  const { user, loading } = useSelector(
    (state: RootState) => state.authentication
  );

  // handle if user login with oAuth google
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      dispatch(loginWithGoogle(credential));
    }
  }, [response, dispatch]);

  useEffect(() => {
    if (!loading) {
      if (user?.userType === "guest") {
        navigation.navigate("register-user-information");
      } else {
        if (user?.userRole === "mother") {
          navigation.navigate("mother", {
            screen: "select-baby",
          });
        }
      }
    }
  }, [user, loading]);

  // handle if user sign-up anonymous
  const handleLoginUserAnonymously = async () => {
    try {
      const userAnonymousInitialData: User = {
        isAnonymous: true,
        userType: "guest",
      };
      await Promise.resolve(
        dispatch(setUserData(userAnonymousInitialData))
      ).then(() => navigation.navigate("register-user-information"));
    } catch {
      return;
    }
  };

  return (
    <View style={style.container}>
      <TouchableOpacity
        style={style.anonymousContainer}
        onPress={handleLoginUserAnonymously}
      >
        <Text style={style.title}>Daftar</Text>
      </TouchableOpacity>
      <View style={style.otherMethod}>
        <Text style={style.other}>Atau masuk dengan</Text>
      </View>
      <TouchableOpacity
        style={style.loginWithGoogle}
        disabled={!request}
        onPress={() => promptAsync({})}
      >
        <View style={style.googleIcon}>
          {/* {assets && (
            <Image
              style={style.image}
              source={{
                uri: assets[0].localUri as string,
              }}
            />
          )} */}
          <GoogleIcon width={20} height={20} viewBox="2.5 2.5 20 20" />
        </View>
        <Text style={style.googleButtonTitle}>Google</Text>
      </TouchableOpacity>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  googleButtonTitle: {
    fontFamily: Font.Bold,
    fontSize: TextSize.title,
    textAlign: "center",
  },
  loginWithGoogle: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.lightneutral,
    borderRadius: Spacing.large,
    paddingVertical: Spacing.xsmall,
    paddingHorizontal: Spacing.xlarge / 2,
  },
  googleIcon: {
    width: Spacing.small + Spacing.extratiny,
    height: Spacing.small + Spacing.extratiny,
    marginRight: Spacing.tiny,
  },
  anonymousContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: color.primary,
    marginBottom: Spacing.xlarge,
  },
  title: {
    fontFamily: Font.Black,
    fontSize: TextSize.h4,
    textAlign: "center",
    color: "white",
  },
  otherMethod: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.tiny,
  },
  other: {
    color: color.neutral,
    fontSize: TextSize.title,
    fontFamily: Font.Regular,
  },
});

export default Login;
