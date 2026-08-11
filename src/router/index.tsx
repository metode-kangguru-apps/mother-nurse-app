import linking from "./path";
import AuthRouter from "./auth";
import MotherRouter from "./mother";
import NurseRouter from "./nurse";

import { NavigationContainer } from "@react-navigation/native";

import { color } from "src/lib/ui/color";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "src/router/types";
import { useSelector } from "react-redux";
import { RootStateV2 } from "@redux/types";
import NotFoundPage from "src/common/NotFoundPage";
import { useCallback } from "react";

const Stack = createNativeStackNavigator<RootStackParamList>();

interface Props {}

const RootRouter: React.FC<Props> = () => {
  const { user } = useSelector((state: RootStateV2) => state.authentication);
  const renderStackNavigator = useCallback(() => {
    if (!user || user.userType === "guest") {
      return <Stack.Screen name="auth" component={AuthRouter} />;
    } else {
      if (user.userRole === "mother") {
        return <Stack.Screen name="mother" component={MotherRouter} />;
      } else {
        return <Stack.Screen name="nurse" component={NurseRouter} />;
      }
    }
  }, [user]);
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: color.surface, flex: 1 },
          animation: "none",
        }}
      >
        {renderStackNavigator()}
        <Stack.Screen name="NotFound" component={NotFoundPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootRouter;
