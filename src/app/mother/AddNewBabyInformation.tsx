import { useState } from "react";
import { useSelector } from "react-redux";
import { RootStateV2 } from "@redux/types";
import { useAppDispatch } from "@redux/hooks";
import { MotherStackParamList } from "src/router/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { AddBaby } from "@redux/actions/authentication/thunks";
import { AddBabyPayload } from "@redux/actions/authentication/types";
import { BabyPayload, BabyStatus } from "@redux/actions/pmkCare/types";
import RegisterBabyPage from "@app/authentication/RegisterBabyInformation/RegisterBabyPage";

interface Props
  extends NativeStackScreenProps<MotherStackParamList, "add-new-baby"> {}

const AddNewBabyInformation: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootStateV2) => state.authentication.user);
  const [loading, setLoading] = useState<boolean>();

  function handlerRegisterBaby(babyData: BabyPayload) {
    if (user) {
      setLoading(true);
      const babyPayload: AddBabyPayload = {
        uid: user.uid,
        baby: {
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
          currentStatus: BabyStatus.ON_PROGRESS,
        },
      };
      dispatch(AddBaby(babyPayload)).then(() => {
        const routes = navigation.getState().routes;
        setLoading(false);
        if (routes.length > 2) {
          if (routes[routes.length - 2].name === "select-baby") {
            navigation.replace("select-baby");
          } else {
            navigation.replace("profile");
          }
        } else {
          navigation.replace("select-baby");
        }
      });
    }
  }

  function handleBackButton() {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("select-baby");
    }
  }

  return (
    <RegisterBabyPage
      title="Tambah Bayi"
      loading={loading}
      handleBackButton={handleBackButton}
      handleRegisterBaby={handlerRegisterBaby}
    />
  );
};

export default AddNewBabyInformation;
