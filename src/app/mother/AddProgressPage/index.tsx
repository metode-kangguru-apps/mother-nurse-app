import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { MotherStackParamList } from "src/router/types";
import { useAppDispatch } from "@redux/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@redux/types";
import { addProgressBaby } from "@redux/actions/baby/thunks";
import AddProgressForm, { FormField } from "./AddProgressForm";

interface Props
  extends NativeStackScreenProps<MotherStackParamList, "add-progress"> {}

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
    navigation.navigate("pmk-care");
  }
  return (
    <AddProgressForm
      handleProgressSubmit={(value) => handleProgressSubmit(value)}
      handleBackForm={() => navigation.navigate("home")}
    />
  );
};
export default AddProgressPage;
