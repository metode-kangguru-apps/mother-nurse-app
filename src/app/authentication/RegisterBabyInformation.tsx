import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"

import { Font } from "src/lib/ui/font"
import { Spacing } from "src/lib/ui/spacing"
import { TextSize } from "src/lib/ui/textSize"
import { color } from "src/lib/ui/color"

import { AuthStackParamList } from "src/router/types"
import FloatingInput from "src/common/FloatingInput"

import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';




interface Props extends NativeStackScreenProps<AuthStackParamList, 'register-baby-information'> { }

const RegisterBabyInformation: React.FC<Props> = ({ navigation }) => {
    return (
        <View style={style.container}>
            <View style={style.contentContainer}>
                <View style={style.welcomeImageContainer}>
                    <View style={style.welcomeImage}>
                        <Ionicons name="md-images-outline" size={64} color="gray" />
                    </View>
                </View>
                <View style={style.formRegistration}>
                    <Text style={style.title}>Daftar Bayi</Text>
                    <View style={style.inputContainer}>
                        <FloatingInput label="Nama" />
                    </View>
                    <View style={style.inputContainer}>
                        <FloatingInput label="Tanggal Lahir" />
                    </View>
                    <View style={style.inputContainer}>
                        <FloatingInput label="Berat (gram)" />
                    </View>
                    <View style={style.inputContainer}>
                        <FloatingInput label="Tinggi Badan (cm)" />
                    </View>
                    <View style={style.inputContainer}>
                        <FloatingInput label="Jenis Kelamin" />
                    </View>
                    <View style={style.addBaby}>
                        <Text>
                            Ada lebih dari 1 bayi?
                        </Text>
                        <Text style={style.addBabyButton}> Tambah Bayi </Text>
                        <SimpleLineIcons name="question" size={Spacing.small} color={color.primary} />
                    </View>
                </View>
            </View>
            <View style={style.buttonContainer}>
                <TouchableOpacity style={style.prevButton} onPress={() => navigation.goBack()}>
                    <AntDesign name="arrowleft" size={TextSize.h6} color={color.accent2} />
                    <Text style={style.prevButtonTitle}>Kembali</Text>
                </TouchableOpacity>
                <TouchableOpacity style={style.nextButton}>
                    <Text style={style.buttonTitle}>Selanjutnya</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        width: "100%",
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
    addBaby: {
        display: 'flex',
        flexDirection: 'row'
    },
    addBabyButton: {
        color: color.primary
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

export default RegisterBabyInformation