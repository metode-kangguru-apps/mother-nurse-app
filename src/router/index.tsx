import linking from "./path";
import AuthRouter from "./auth";
import MotherRouter from "./mother";
import NurseRouter from "./nurse";

import { NavigationContainer } from "@react-navigation/native";

import { color } from "src/lib/ui/color";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/router/types";
import { useSelector } from "react-redux";
import { RootState } from "@redux/types";
import NotFoundPage from "src/common/NotFoundPage";

const Stack = createNativeStackNavigator<RootStackParamList>();

interface Props {}

const RootRouter: React.FC<Props> = () => {
  const { user } = useSelector((state: RootState) => state.authentication);
  return (
    <NavigationContainer linking={linking}>
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
        {user && user.userType === "member" && user.userRole == "nurse" && (
          <Stack.Screen name="nurse" component={NurseRouter} />
        )}
        <Stack.Screen name="NotFound" component={NotFoundPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootRouter;
