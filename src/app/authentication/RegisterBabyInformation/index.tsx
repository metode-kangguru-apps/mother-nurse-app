import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList, RootStackParamList } from "src/router/types";

import { Baby as BabyV2 } from "@redux/actions/pmkCare/types";
import { useSelector } from "react-redux";
import { RootStateV2 } from "@redux/types";
import { useAppDispatch } from "@redux/hooks";
import { CompositeScreenProps } from "@react-navigation/native";
import RegisterBabyPage from "./RegisterBabyPage";
import {
  logingOutUser,
  signUpMotherAccount,
} from "@redux/actions/authenticationV2/thunks";
import { MotherPayload } from "@redux/actions/authenticationV2/types";

interface Props
  extends CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, "register-baby-information">,
    NativeStackScreenProps<RootStackParamList>
  > {}

const RegisterBabyInformation2: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootStateV2) => state.authentication);
  const { selectedHospital } = useSelector(
    (state: RootStateV2) => state.hospital
  );

  function handlerRegisterAccount(babyData: BabyV2) {
    if (user && selectedHospital) {
      const motherData: MotherPayload = {
        displayName: user.displayName,
        userRole: user.userRole,
        phoneNumber: user.phoneNumber,
        hospital: selectedHospital,
        userType: "member",
        isAnonymous: user.isAnonymous,
        babyCollection: [
          {
            displayName: babyData.displayName,
            gender: babyData.gender,
            gestationAge: babyData.gestationAge,
            weight: babyData.weight,
            length: babyData.length,
            currentWeek: babyData.gestationAge,
            currentWeight: babyData.weight,
            currentLength: babyData.length,
            birthDate: babyData.birthDate,
            createdAt: new Date(),
          },
        ],
      };
      dispatch(signUpMotherAccount({ uid: user.uid, payload: motherData }));
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
      dispatch(logingOutUser());
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
