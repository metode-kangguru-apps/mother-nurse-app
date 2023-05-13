import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NurseStackParamList } from "./types";

import { color } from "src/lib/ui/color";
import ProfilePage from "@app/nurse/ProfilePage";
import { useSelector } from "react-redux";
import { RootState } from "@redux/types";
import MotherDetailPage from "@app/nurse/MotherDetailPage";

const NurseStack = createNativeStackNavigator<NurseStackParamList>();

const NurseRouter: React.FC<{}> = () => {
  const { selectedMotherDetail } = useSelector(
    (state: RootState) => state.global
  );
  return (
    <NurseStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: color.surface, flex: 1 },
        animation: "none",
      }}
    >
      <NurseStack.Screen
        name="profile"
        component={ProfilePage}
        options={{
          title: "Perawatan Metode Kangguru",
          animation: "slide_from_right",
        }}
      />
      {Object.keys(selectedMotherDetail).length > 0 && (
        <NurseStack.Screen
          name="mother-detail"
          component={MotherDetailPage}
          options={{
            title: "Profil Pasien",
            animation: "slide_from_right",
          }}
        />
      )}
    </NurseStack.Navigator>
  );
};

export default NurseRouter;
