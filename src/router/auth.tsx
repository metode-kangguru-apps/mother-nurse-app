import LoginScreen from "@app/authentication/Login";
import RegisterBabyInformationScreen from "@app/authentication/RegisterBabyInformation";
import RegisterUserInformationScreen from "@app/authentication/RegisterUserInformation";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootState } from "@redux/types";
import { useSelector } from "react-redux";
import { color } from "src/lib/ui/color";
import { AuthStackParamList } from "./types";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthRouter: React.FC<{}> = () => {
  const { user } = useSelector((state: RootState) => state.authentication);
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: color.surface,
          flex: 1,
        },
        animation: "slide_from_right",
      }}
    >
      <AuthStack.Screen
        name="login"
        component={LoginScreen}
        options={{
          title: "Login",
        }}
      />
      {user && user.userType === "guest" && (
        <>
          <AuthStack.Screen
            name="register-user-information"
            component={RegisterUserInformationScreen}
            options={{
              title: "Register User Information",
            }}
          />
          <AuthStack.Screen
            name="register-baby-information"
            component={RegisterBabyInformationScreen}
            options={{
              title: "Register Baby Information",
            }}
          />
        </>
      )}
    </AuthStack.Navigator>
  );
};

export default AuthRouter;
