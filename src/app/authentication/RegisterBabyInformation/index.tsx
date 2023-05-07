import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList, RootStackParamList } from "src/router/types";

import { useEffect} from "react";
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
      console.log("mantap")
      navigation.goBack();
    } else {
      Promise.resolve(dispatch(clearAuthenticationDataSuccess())).then(() => {
        navigation.navigate("login");
      });
    }
  }

  return (
    // TODO: Implement loading state
    <RegisterBabyPage
      title="Daftar Bayi"
      handleBackButton={handleBackButton}
      handleRegisterBaby={(babyData) => handlerRegisterAccount(babyData)}
    />
  );
};

export default RegisterBabyInformation2;
