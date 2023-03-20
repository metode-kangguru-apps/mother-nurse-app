import { useSelector } from "react-redux"

import { RootState } from "@redux/types"
import { Dimensions, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"

import { Font } from "src/lib/ui/font"
import { color } from "src/lib/ui/color"
import { Spacing } from "src/lib/ui/spacing"
import { TextSize } from "src/lib/ui/textSize"

import { AuthStackParamList } from "src/router/types"
import FloatingInput from "src/common/FloatingInput"
import PhoneNumberInput from "src/common/PhoneNumberInput"

import { AntDesign } from '@expo/vector-icons';
import { useAssets } from "expo-asset"

import { useSafeAreaInsets, EdgeInsets } from 'react-native-safe-area-context';
import { useMemo } from "react"



interface Props extends NativeStackScreenProps<AuthStackParamList, 'register-user-information'> { }

const MEDIA_HEIGHT = Dimensions.get('window').height

const RegisterUserInformation: React.FC<Props> = ({ navigation }) => {
    const userState = useSelector((state: RootState) => state.user)
    const [assets, _] = useAssets([require('../../../assets/info-mother.png')])

    const insets = useSafeAreaInsets();

    const style = useMemo(() => createStyle(insets), [insets])

    if (userState.loading) return <Text>Loading...</Text>
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, paddingTop: insets.top }}
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View style={style.container}>
                    <View style={style.welcomeImageContainer}>
                        <View style={style.welcomeImage}>
                            {assets &&
                                <Image
                                    style={{ flex: 1 }}
                                    source={{
                                        uri: assets[0].localUri as string
                                    }}
                                />
                            }
                        </View>
                    </View>
                    <View style={style.contentContainer}>
                        <View style={style.formRegistration}>
                            <View style={style.titleContainer}>
                                <Text style={style.title}>Daftar</Text>
                            </View>
                            <View style={style.inputContainer}>
                                <FloatingInput label="Nama Ibu" />
                            </View>
                            <View style={style.inputContainer}>
                                <PhoneNumberInput />
                            </View>
                            <View style={style.inputContainer}>
                                <FloatingInput label="Kode Ruang Bayi" />
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
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const createStyle = (
    insets: EdgeInsets
) =>
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'space-between',
        },
        welcomeImageContainer: {
            display: 'flex',
            alignItems: 'center',
            marginVertical: Spacing.xlarge / 2,
            padding: Spacing.small
        },
        welcomeImage: {
            width: MEDIA_HEIGHT / 4,
            height: MEDIA_HEIGHT / 4
        },
        contentContainer: {
            width: "100%",
            height: (
                (MEDIA_HEIGHT * 3 / 4) - Spacing.xlarge - 
                (2 * Spacing.small) - insets.top
            ),
            backgroundColor: color.lightneutral,
            padding: Spacing.base - Spacing.extratiny,
            borderTopLeftRadius: Spacing.xlarge / 2,
            borderTopRightRadius: Spacing.xlarge / 2,
            justifyContent: 'space-between',
            ...(Platform.select({
                native: {
                    paddingBottom: insets.top
                }, web: {
                    paddingBottom: Spacing.base
                }
            }))
        },
        formRegistration: {
            width: "100%",
        },
        titleContainer: {
            width: "100%",
            alignItems: 'center'
        },
        title: {
            fontFamily: Font.Black,
            fontSize: TextSize.h5,
            marginBottom: Spacing.small
        },
        inputContainer: {
            position: 'relative',
            marginBottom: Spacing.tiny,
            zIndex: 1
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