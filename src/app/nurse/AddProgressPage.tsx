import { useSelector } from "react-redux";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { RootStateV2 } from "@redux/types";
import { useAppDispatch } from "@redux/hooks";
import { addBabyProgress } from "@redux/actions/pmkCare/thunks";

import AddProgressForm, {
  FormField,
} from "@app/mother/AddProgressPage/AddProgressForm";

import { NurseStackParamList } from "src/router/types";
import { updateNurseBabyDataAtCollection } from "@redux/actions/authentication";
import { selectBabyCurrentStatus } from "@redux/actions/pmkCare/helper";

interface Props
  extends NativeStackScreenProps<NurseStackParamList, "add-progress"> {}

const AddProgressPage: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { baby } = useSelector((state: RootStateV2) => state.pmkCare);
  const userID = useSelector((state: RootStateV2) => state.pmkCare.mother.uid);

  function handleProgressSubmit(value: FormField) {
    const currentStatus = selectBabyCurrentStatus(
      value.weight,
      baby.weight,
      value.temperature,
    );
    const updateProgressData = {
      userID: userID,
      babyID: baby.id,
      createdAt: new Date(),
      week: baby.currentWeek,
      weight: value.weight,
      length: value.length,
      currentStatus: currentStatus,
      ...(value.temperature ? { temperature: value.temperature } : undefined),
    };
    dispatch(addBabyProgress(updateProgressData)).then(() => {
      dispatch(updateNurseBabyDataAtCollection(updateProgressData));
      navigation.pop();
    });
  }
  return (
    <AddProgressForm
      handleProgressSubmit={(value) => handleProgressSubmit(value)}
      handleBackForm={() => navigation.pop()}
    />
  );
};
export default AddProgressPage;
