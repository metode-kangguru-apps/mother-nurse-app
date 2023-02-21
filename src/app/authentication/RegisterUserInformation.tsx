import { useSelector } from "react-redux"

import { RootState } from "@redux/types"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"

import { Font } from "src/lib/ui/font"
import { color } from "src/lib/ui/color"
import { Spacing } from "src/lib/ui/spacing"
import { TextSize } from "src/lib/ui/textSize"

import { AuthStackParamList } from "src/router/types"
import FloatingInput from "src/common/FloatingInput"
import PhoneNumberInput from "src/common/PhoneNumberInput"

import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';


interface Props extends NativeStackScreenProps<AuthStackParamList, 'register-user-information'> { }

const RegisterUserInformation: React.FC<Props> = ({ navigation }) => {
    const userState = useSelector((state: RootState) => state.user)
    if (userState.loading) return <Text>Loading...</Text>
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            <View style={style.container}>
                <View style={style.contentContainer}>
                    <View style={style.welcomeImageContainer}>
                        <View style={style.welcomeImage}>
                            <Ionicons name="md-images-outline" size={64} color="gray" />
                        </View>
                    </View>
                    <View style={style.formRegistration}>
                        <Text style={style.title}>Daftar</Text>
                        <View style={style.inputContainer}>
                            <FloatingInput label="Nama Ibu" />
                        </View>
                        <View style={style.inputContainer}>
                            <PhoneNumberInput />
                        </View>
                        <View style={style.inputContainer}>
                            <FloatingInput label="Kode Perawat" />
                        </View>
                    </View>
                </View>
                <View style={style.buttonContainer}>
                    <TouchableOpacity style={style.prevButton} onPress={() => navigation.goBack()}>
                        <AntDesign name="arrowleft" size={TextSize.h6} color={color.accent2} />
                        <Text style={style.prevButtonTitle}>Kembali</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={style.nextButton} onPress={() => navigation.push('register-baby-information')}>
                        <Text style={style.buttonTitle}>Selanjutnya</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: Spacing.base,
        paddingHorizontal: Spacing.small,
    },
    contentContainer: {
        width: "100%",
    },
    welcomeImageContainer: {
        width: "100%",
        height: Spacing.xlarge * 3.5,
        display: 'flex',
        alignItems: 'center',
        marginBottom: Spacing.xlarge / 2,
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
        width: "100%",
        marginBottom: Spacing.large
    },
    title: {
        fontFamily: Font.Black,
        fontSize: TextSize.h5,
        marginBottom: Spacing.small
    },
    inputContainer: {
        marginBottom: Spacing.tiny
    },
    buttonContainer: {
        display: 'flex',
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    nextButton: {
        paddingVertical: Spacing.xsmall,
        paddingHorizontal: Spacing.large,
        backgroundColor: color.secondary,
        borderRadius: Spacing.xlarge
    },
    buttonTitle: {
        fontFamily: Font.Bold,
        fontSize: TextSize.body,
        color: color.lightneutral,
    },
    prevButton: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    prevButtonTitle: {
        color: color.accent2,
        fontSize: TextSize.body,
        fontFamily: Font.Bold,
        paddingLeft: Spacing.small
    }
})

export default RegisterUserInformation