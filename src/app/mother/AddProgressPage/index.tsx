import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { MotherStackParamList } from "src/router/types";
import { useAppDispatch } from "@redux/hooks";
import { useSelector } from "react-redux";
import { RootStateV2 } from "@redux/types";
import AddProgressForm, { FormField } from "./AddProgressForm";
import { addBabyProgress } from "@redux/actions/pmkCare/thunks";
import { Mother } from "@redux/actions/authentication/types";
import { updateMotherBabyDataAtCollection } from "@redux/actions/authentication";
import { selectBabyCurrentStatus } from "@redux/actions/pmkCare/helper";

interface Props
  extends NativeStackScreenProps<MotherStackParamList, "add-progress"> {}

const AddProgressPage: React.FC<Props> = ({ navigation }) => {
  const babyData = useSelector((state: RootStateV2) => state.pmkCare.baby);
  const userID = useSelector(
    (state: RootStateV2) => (state.authentication.user as Mother).uid
  );

  const dispatch = useAppDispatch();
  function handleProgressSubmit(value: FormField) {
    const currentStatus = selectBabyCurrentStatus(
      value.weight,
      babyData.weight,
      value.temperature,
    );
    const savedProgressData = {
      userID: userID,
      babyID: babyData.id,
      createdAt: new Date(),
      week: babyData.currentWeek,
      weight: value.weight,
      length: value.length,
      currentStatus: currentStatus,
      ...(value.temperature ? { temperature: value.temperature } : undefined),
    };
    dispatch(addBabyProgress(savedProgressData)).then(() => {
      dispatch(updateMotherBabyDataAtCollection(savedProgressData));
      navigation.navigate("pmk-care");
    });
  }
  return (
    <AddProgressForm
      handleProgressSubmit={(value) => handleProgressSubmit(value)}
      handleBackForm={() => navigation.navigate("home")}
    />
  );
};
export default AddProgressPage;
