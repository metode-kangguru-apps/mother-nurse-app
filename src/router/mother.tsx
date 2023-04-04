import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MotherStackParamList } from "./types";

import SelectBabyPage from "@app/mother/SelectedBabyPage";
import HomePage from "@app/mother/HomePage";
import { color } from "src/lib/ui/color";
import ProfilePage from "@app/mother/ProfilePage";

const MotherStack = createNativeStackNavigator<MotherStackParamList>();

const MotherRouter: React.FC<{}> = () => {
  return (
    <MotherStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: color.surface, flex: 1 },
        animation: "none",
      }}
    >
      <MotherStack.Screen
        name="home"
        component={HomePage}
        options={{
          title: "Perawatan Metode Kangguru",
        }}
      />
      <MotherStack.Screen
        name="select-baby"
        component={SelectBabyPage}
        options={{
          title: "Pilih Bayi",
        }}
      />
      <MotherStack.Screen
        name="profile"
        component={ProfilePage}
        options={{
          title: "Profil",
        }}
      />
    </MotherStack.Navigator>
  );
};

export default MotherRouter;
