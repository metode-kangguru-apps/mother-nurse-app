import { Dimensions, Platform, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Font } from "src/lib/ui/font";
import { Spacing } from "src/lib/ui/spacing";
import { TextSize } from "src/lib/ui/textSize";
import { color } from "src/lib/ui/color";

import { AuthStackParamList, RootStackParamList } from "src/router/types";

import { useAssets } from "expo-asset";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useMemo, useState } from "react";
import { Baby, Authentication } from "@redux/actions/authentication/types";
import { useSelector } from "react-redux";
import { RootState } from "@redux/types";
import { useAppDispatch } from "@redux/hooks";
import {
  loginUser,
  signUpMotherWithGoogle,
} from "@redux/actions/authentication/thunks";
import { CompositeScreenProps } from "@react-navigation/native";
import { clearAuthenticationDataSuccess } from "@redux/actions/authentication";
import RegisterBabyPage from "./RegisterBabyPage";

const MEDIA_HEIGHT = Dimensions.get("window").height;

interface Props
  extends CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, "register-baby-information">,
    NativeStackScreenProps<RootStackParamList>
  > {}

const RegisterBabyInformation2: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user, mother } = useSelector(
    (state: RootState) => state.authentication
  );

  useEffect(() => {
    if (mother && mother.babyCollection) {
      if (mother.babyCollection.length > 1) {
        navigation.navigate("mother", {
          screen: "select-baby",
        });
      } else {
        navigation.navigate("mother", {
          screen: "home",
        });
      }
    }
  }, [mother]);

  function handlerRegisterAccount(babyData: Baby) {
    const newUserObj = {
      user: {
        displayName: user?.displayName,
        userType: "member",
        userRole: "mother",
        isAnonymous: true,
      },
      mother: {
        phoneNumber: mother?.phoneNumber,
        hospitalCode: mother?.hospitalCode,
        babyCollection: [
          {
            displayName: babyData.displayName,
            gestationAge: babyData.gestationAge,
            birthDate: babyData.birthDate,
            weight: babyData.weight,
            length: babyData.length,
            currentWeight: babyData.weight,
            currentLength: babyData.length,
            gender: babyData.gender,
          },
        ],
      },
      nurse: undefined,
    };
    if (user?.isAnonymous) {
      dispatch(loginUser(newUserObj as Authentication));
    } else {
      const newGoogleUserObj = {
        ...newUserObj,
        user: {
          ...newUserObj.user,
          uid: user?.uid,
          isAnonymous: false,
        },
      };
      dispatch(signUpMotherWithGoogle(newGoogleUserObj as Authentication));
    }
  }

  function handleBackButton() {
    const routes = navigation.getState().routes;
    if (
      navigation.canGoBack() &&
      routes[routes.length - 2].name == "register-user-information"
    ) {
      navigation.goBack();
    } else {
      Promise.resolve(dispatch(clearAuthenticationDataSuccess())).then(() => {
        navigation.navigate("login");
      });
    }
  }

  return (
    <RegisterBabyPage
      title="Daftar Bayi"
      handleBackButton={handleBackButton}
      handleRegisterBaby={(babyData) => handlerRegisterAccount(babyData)}
    />
  );
};

export default RegisterBabyInformation2;
