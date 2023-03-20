import LoginScreen from "@app/authentication/Login";
import LogOutScreen from "@app/authentication/Logout";
import RegisterBabyInformationScreen from "@app/authentication/RegisterBabyInformation";
import RegisterUserInformationScreen from "@app/authentication/RegisterUserInformation";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { color } from "src/lib/ui/color";
import { AuthStackParamList } from "./types";

const AuthStack = createNativeStackNavigator<AuthStackParamList>()

const AuthRouter: React.FC<{}> = () => {
    return (
        <AuthStack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: color.surface,
                    flex: 1,
                    borderLeftWidth: 1,
                    borderRightWidth: 1,
                    borderColor: "rgba(0, 0, 0, 0.1)",
                },
                animation: 'none'
            }}
        >
            <AuthStack.Screen 
                name='login' 
                component={LoginScreen} 
                options={{
                    title: 'Login'
                }}
            />
            <AuthStack.Screen
                name='register-user-information'
                component={RegisterUserInformationScreen}
                options={{
                    title: 'Register User Information'
                }}
            />
            <AuthStack.Screen
                name='register-baby-information'
                component={RegisterBabyInformationScreen}
                options={{
                    title: 'Register Baby Information'
                }}
            />
            <AuthStack.Screen
                name='logout'
                component={LogOutScreen}
                options={{
                    title: 'Logout'
                }}
            />
        </AuthStack.Navigator>
    )
}

export default AuthRouter