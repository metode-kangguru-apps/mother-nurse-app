import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList, RootStackParamList } from "src/router/types";

import { BabyStatus, Baby as BabyV2 } from "@redux/actions/pmkCare/types";
import { useSelector } from "react-redux";
import { RootStateV2 } from "@redux/types";
import { useAppDispatch } from "@redux/hooks";
import { CompositeScreenProps } from "@react-navigation/native";
import RegisterBabyPage from "./RegisterBabyPage";
import {
  logingOutUser,
  signUpMotherAccount,
} from "@redux/actions/authentication/thunks";
import { MotherPayload } from "@redux/actions/authentication/types";
import { useState } from "react";

interface Props
  extends CompositeScreenProps<
    NativeStackScreenProps<AuthStackParamList, "register-baby-information">,
    NativeStackScreenProps<RootStackParamList>
  > {}

const RegisterBabyInformation2: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: RootStateV2) => state.authentication);
  const [loading, setLoading] = useState<boolean>();
  const { selectedHospital } = useSelector(
    (state: RootStateV2) => state.hospital
  );

  function handlerRegisterAccount(babyData: BabyV2) {
    if (user && selectedHospital) {
      setLoading(true);
      const motherData: MotherPayload = {
        userRole: user.userRole,
        isAnonymous: user.isAnonymous,
        displayName: user.displayName,
        phoneNumber: user.phoneNumber,
        messagingToken: user.messagingToken,
        userType: "member",
        hospital: selectedHospital,
        isFinnishedOnboarding: false,
        babyCollection: [
          {
            createdAt: new Date(),
            weight: babyData.weight,
            length: babyData.length,
            gender: babyData.gender,
            birthDate: babyData.birthDate,
            currentWeight: babyData.weight,
            currentLength: babyData.length,
            displayName: babyData.displayName,
            currentWeek: babyData.gestationAge,
            gestationAge: babyData.gestationAge,
            currentStatus: BabyStatus.ON_PROGRESS,
          },
        ],
      };
      dispatch(
        signUpMotherAccount({ uid: user.uid, payload: motherData })
      ).then(() => {
        setLoading(false);
      });
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
    <RegisterBabyPage
      title="Daftar Bayi"
      loading={loading}
      handleBackButton={handleBackButton}
      handleRegisterBaby={(babyData) => handlerRegisterAccount(babyData)}
    />
  );
};

export default RegisterBabyInformation2;
