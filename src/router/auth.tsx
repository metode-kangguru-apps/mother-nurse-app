import LoginPage from "@app/authentication/LoginPage";
import RegisterUserInformationPage from "@app/authentication/RegisterUserInformation";
import RegisterNurseInformationPage from "@app/authentication/RegisterNurseInformation";

import { color } from "src/lib/ui/color";
import { RootStateV2 } from "@redux/types";
import { useSelector } from "react-redux";
import { AuthStackParamList } from "./types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform } from "react-native";
import RegisterBabyInformation from "@app/authentication/RegisterBabyInformation";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();

const AuthRouter: React.FC<{}> = () => {
  const { user } = useSelector(
    (state: RootStateV2) => state.authentication
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
      {!user && (
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
      )}
      {user &&
        user.userType === "guest" &&
        user.userRole === "mother" && (
          <>
            {!user.isAnonymous && (
              <AuthStack.Screen
                name="register-user-information"
                component={RegisterUserInformationPage}
                options={{
                  title: "Register User Information",
                }}
              />
            )}
            <AuthStack.Screen
              name="register-baby-information"
              component={RegisterBabyInformation}
              options={{
                title: "Register Baby Information",
              }}
            />
          </>
        )}
      {user && user.userType === "guest" && user.userRole === "nurse" && (
        <AuthStack.Screen
          name="register-nurse-information"
          component={RegisterNurseInformationPage}
          options={{
            title: "Register User Information",
          }}
        />
      )}
    </AuthStack.Navigator>
  );
};

export default AuthRouter;
