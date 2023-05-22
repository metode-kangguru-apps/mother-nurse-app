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

interface Props
  extends NativeStackScreenProps<NurseStackParamList, "add-progress"> {}

const AddProgressPage: React.FC<Props> = ({ navigation }) => {
  const userID = useSelector((state: RootStateV2) => state.pmkCare.mother.uid);
  const { baby } = useSelector((state: RootStateV2) => state.pmkCare);

  const dispatch = useAppDispatch();
  function handleProgressSubmit(value: FormField) {
    const updateProgressData = {
      userID: userID,
      babyID: baby.id,
      createdAt: new Date(),
      week: baby.currentWeek,
      weight: value.weight,
      length: value.length,
      temperature: value.temperature,
      previousWeight: baby.weight,
    };
    dispatch(addBabyProgress(updateProgressData)).then(() => {
      dispatch(updateNurseBabyDataAtCollection(updateProgressData));
      navigation.push("history-progress");
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
