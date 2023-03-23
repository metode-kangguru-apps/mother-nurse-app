import linking from "./path";
import AuthRouter from "./auth";
import MotherRouter from "./mother";

import { NavigationContainer } from "@react-navigation/native";

import { color } from "src/lib/ui/color";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/router/types";
import { useSelector } from "react-redux";
import { RootState } from "@redux/types";

const Stack = createNativeStackNavigator<RootStackParamList>();

interface Props {
  onLayoutRootView: () => void;
}

const RootRouter: React.FC<Props> = ({ onLayoutRootView }) => {
  const { user } = useSelector((state: RootState) => state.authentication);
  return (
    <NavigationContainer linking={linking} onReady={onLayoutRootView}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: color.surface, flex: 1 },
          animation: "none",
        }}
      >
        {(!user || user.userType === "guest") && (
          <Stack.Screen name="auth" component={AuthRouter} />
        )}
        {user && user.userType === "member" && user.userRole == "mother" && (
          <Stack.Screen name="mother" component={MotherRouter} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootRouter;
