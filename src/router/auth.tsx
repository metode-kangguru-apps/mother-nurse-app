import LoginScreen from "@app/authentication/Login";
import LogOutScreen from "@app/authentication/Logout";
import RegisterUserInformationScreen from "@app/authentication/RegisterUserInformation";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthStackParamList } from "./types";

const AuthStack = createNativeStackNavigator<AuthStackParamList>()

const AuthRouter: React.FC<{}> = () => {
    return (
        <AuthStack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: 'white', flex: 1 },
                animation: 'none'
            }}
        >
            <AuthStack.Screen name='login' component={LoginScreen} />
            <AuthStack.Screen name='register-user-information' component={RegisterUserInformationScreen} />
            <AuthStack.Screen name='logout' component={LogOutScreen} />
        </AuthStack.Navigator>
    )
}

export default AuthRouter