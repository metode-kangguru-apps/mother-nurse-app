import LoginPage from "@app/authentication/LoginPage";
import RegisterUserInformationPage from "@app/authentication/RegisterUserInformation";
import RegisterNurseInformationPage from "@app/authentication/RegisterNurseInformation";

import { color } from "src/lib/ui/color";
import { RootState } from "@redux/types";
import { useSelector } from "react-redux";
import { AuthStackParamList } from "./types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform } from "react-native";
import RegisterBabyInformation from "@app/authentication/RegisterBabyInformation";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthRouter: React.FC<{}> = () => {
  const { user, mother, nurse } = useSelector(
    (state: RootState) => state.authentication
  );
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
        component={LoginPage}
        options={{
          title: "Login",
          animationTypeForReplace: "pop",
          animation: Platform.select({
            ios: "slide_from_left",
            android: "simple_push",
          }),
        }}
      />
      {((user && user.userType === "guest" && user.userRole === "mother") ||
        (mother && !mother.babyCollection)) && (
        <>
          <AuthStack.Screen
            name="register-user-information"
            component={RegisterUserInformationPage}
            options={{
              title: "Register User Information",
            }}
          />
          <AuthStack.Screen
            name="register-baby-information"
            component={RegisterBabyInformation}
            options={{
              title: "Register Baby Information",
            }}
          />
        </>
      )}
      {((user && user.userType === "guest" && user.userRole === "nurse") ||
        !nurse) && (
        <>
          <AuthStack.Screen
            name="register-nurse-information"
            component={RegisterNurseInformationPage}
            options={{
              title: "Register User Information",
            }}
          />
        </>
      )}
    </AuthStack.Navigator>
  );
};

export default AuthRouter;
