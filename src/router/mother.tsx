import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MotherStackParamList } from "./types";

import SelectBabyPage from "@app/mother/SelectedBabyPage";
import HomePage from "@app/mother/HomePage";

const MotherStack = createNativeStackNavigator<MotherStackParamList>();

const MotherRouter: React.FC<{}> = () => {
  return (
    <MotherStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "white", flex: 1 },
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
    </MotherStack.Navigator>
  );
};

export default MotherRouter;
