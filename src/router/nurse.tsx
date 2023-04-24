import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NurseStackParamList } from "./types";

import { color } from "src/lib/ui/color";
import ProfilePage from "@app/nurse/ProfilePage";

const NurseStack = createNativeStackNavigator<NurseStackParamList>();

const NurseRouter: React.FC<{}> = () => {
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
          title: "Profil Perawat",
          animation: "slide_from_right",
        }}
      />
    </NurseStack.Navigator>
  );
};

export default NurseRouter;
