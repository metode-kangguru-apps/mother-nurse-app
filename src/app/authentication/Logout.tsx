import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { logOutUser } from "@redux/actions/user/thunks"
import { useAppDispatch } from "@redux/hooks"
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native"
import { Font } from "src/lib/ui/font"
import { Spacing } from "src/lib/ui/spacing"
import { TextSize } from "src/lib/ui/textSize"
import { AuthStackParamList } from "src/router/types"

interface Props extends NativeStackScreenProps<AuthStackParamList, 'logout'> { }

const LogOut: React.FC<Props> = ({navigation}) => {
    const dispatch = useAppDispatch()
    const handleLogOutUser = () => {
        try {
            dispatch(logOutUser())
        } catch {
            return
        }
        navigation.navigate('login')
    }
    return (
        <View style={style.container}>
            <TouchableWithoutFeedback onPress={handleLogOutUser}>
                <Text style={style.title}>Logout</Text>
            </TouchableWithoutFeedback>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        fontFamily: Font.Bold,
        fontSize: TextSize.title,
        textAlign: "center",
        marginBottom: Spacing.extratiny
    },
})

export default LogOut