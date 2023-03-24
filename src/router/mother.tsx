import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MotherStackParamList } from "./types";

import SelectBabyPage from "@app/mother/SelectedBabyPage";
import HomePage from "@app/mother/HomePage";
import LogOut from "@app/authentication/Logout";
import { color } from "src/lib/ui/color";

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
        name="select-baby"
        component={SelectBabyPage}
        options={{
          title: "Pilih Bayi",
        }}
      />
      <MotherStack.Screen
        name="home"
        component={HomePage}
        options={{
          title: "PMK Apps",
        }}
      />
      <MotherStack.Screen
        name="logout"
        component={LogOut}
        options={{
          title: "Mother Logout"
        }}
      />
    </MotherStack.Navigator>
  );
};

export default MotherRouter;
