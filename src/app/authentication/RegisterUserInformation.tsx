import { useSelector } from "react-redux"

import { RootState } from "@redux/types"
import { Button, StyleSheet, Text, View } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"

import { Font } from "src/lib/ui/font"
import { Spacing } from "src/lib/ui/spacing"
import { TextSize } from "src/lib/ui/textSize"

import { AuthStackParamList } from "src/router/types"
import FloatingInput from "src/common/FloatingInput"

import { Ionicons } from '@expo/vector-icons';

interface Props extends NativeStackScreenProps<AuthStackParamList, 'register-user-information'> {}

const RegisterUserInformation: React.FC<Props> = ({ navigation }) => {
    const userState = useSelector((state: RootState) => state.user)
    if(userState.loading) return <Text>Loading...</Text>
    return (
        <View style={style.container}>
            <View style={style.welcomeImageContainer}>
                <View style={style.welcomeImage}>
                    <Ionicons name="md-images-outline" size={64} color="gray" />
                </View>
            </View>
            <View style={style.formRegistration}>
                <Text style={style.title}>Daftarkan data diri</Text>
                <FloatingInput label="Nama Panggilan"></FloatingInput>
                <FloatingInput label="Alamat Email"></FloatingInput>
                <FloatingInput label="Status Mother"></FloatingInput>
            </View>
            <Button title="Logout" onPress={() => navigation.navigate('logout')}></Button>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Spacing.base,
        alignItems: 'center'
    },
    welcomeImageContainer: {
        width: "90%",
        height: "30%",
        display: 'flex',
        alignItems: 'center',
        marginBottom: Spacing.xlarge,
    },
    welcomeImage: {
        width: "100%",
        height: "100%",
        backgroundColor: 'rgb(206, 206, 206)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    formRegistration: {
        width: "90%",
    },
    title: {
        fontFamily: Font.Bold,
        fontSize: TextSize.title,
        marginBottom: Spacing.extratiny
    },
})

export default RegisterUserInformation