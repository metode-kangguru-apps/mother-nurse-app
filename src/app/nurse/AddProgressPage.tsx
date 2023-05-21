import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { MotherStackParamList, NurseStackParamList } from "src/router/types";
import { useAppDispatch } from "@redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@redux/types";
import { addProgressBaby } from "@redux/actions/baby/thunks";
import AddProgressForm, { FormField } from "@app/mother/AddProgressPage/AddProgressForm";

interface Props
  extends NativeStackScreenProps<NurseStackParamList, "add-progress"> {}

const AddProgressPage: React.FC<Props> = ({ navigation }) => {
  const { selectedTerapiBaby } = useSelector(
    (state: RootState) => state.global
  );

  const dispatch = useAppDispatch();
  function handleProgressSubmit(value: FormField) {
    dispatch(
      addProgressBaby({
        babyID: selectedTerapiBaby.id,
        week: selectedTerapiBaby.currentWeek,
        weight: value.weight,
        length: value.length,
        temperature: value.temperature,
        prevWeight: selectedTerapiBaby.weight,
      })
    );
    navigation.pop();
  }
  return (
    <AddProgressForm
      handleProgressSubmit={(value) => handleProgressSubmit(value)}
      handleBackForm={() => navigation.pop()}
    />
  );
};
export default AddProgressPage;
