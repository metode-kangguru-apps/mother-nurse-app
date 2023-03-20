import { Dimensions, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { NativeStackScreenProps } from "@react-navigation/native-stack"

import { Font } from "src/lib/ui/font"
import { Spacing } from "src/lib/ui/spacing"
import { TextSize } from "src/lib/ui/textSize"
import { color } from "src/lib/ui/color"

import { AuthStackParamList } from "src/router/types"
import FloatingInput from "src/common/FloatingInput"

import { AntDesign } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import DateTimePicker from "src/common/DateTimePicker"
import PickerField from "src/common/PickerField"
import { useAssets } from "expo-asset"
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context"
import { useMemo } from "react"


const MEDIA_HEIGHT = Dimensions.get('window').height

interface Props extends NativeStackScreenProps<AuthStackParamList, 'register-baby-information'> { }

const RegisterBabyInformation: React.FC<Props> = ({ navigation }) => {
    const [assets, _] = useAssets([require('../../../assets/info-baby.png')])
    const insets = useSafeAreaInsets()
    const style = useMemo(() => createStyle(insets), [insets])
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, paddingTop: insets.top }}
        >
            <ScrollView showsVerticalScrollIndicator={false}>
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
                        <View style={style.titleContainer}>
                            <Text style={style.title}>Daftar Bayi</Text>
                        </View>
                        <View style={style.inputContainer}>
                            <FloatingInput label="Nama" />
                        </View>
                        <View style={[style.inputContainer, { zIndex: 10 }]}>
                            <DateTimePicker
                                label="Tanggal Lahir"
                            />
                        </View>
                        <View style={style.inputContainer}>
                            <FloatingInput label="Berat (gram)" />
                        </View>
                        <View style={style.inputContainer}>
                            <FloatingInput label="Tinggi Badan (cm)" />
                        </View>
                        <View style={[style.inputContainer, { zIndex: 10 }]}>
                            <PickerField
                                label="Jenis Kelamin"
                                items={[
                                    { key: 'Laki Laki', value: 'laki_laki' },
                                    { key: 'Perempuan', value: 'perempuan' },
                                ]}
                            />
                        </View>
                        <View style={style.addBaby}>
                            <Text>
                                Ada lebih dari 1 bayi?
                            </Text>
                            <Text style={style.addBabyButton}> Tambah Bayi </Text>
                            <SimpleLineIcons name="question" size={Spacing.small} color={color.primary} />
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
            justifyContent: 'space-between'
        },
        contentContainer: {
            width: "100%",
            backgroundColor: color.lightneutral,
            padding: Spacing.base - Spacing.extratiny,
            borderTopLeftRadius: Spacing.xlarge / 2,
            borderTopRightRadius: Spacing.xlarge / 2,
            justifyContent: 'space-between',
            minHeight: (
                MEDIA_HEIGHT * 3 / 4 - (Spacing.base - Spacing.extratiny) - 
                Spacing.xlarge - insets.top
            ),
            ...(Platform.select({
                native: {
                    paddingBottom: insets.top
                }, web: {
                    paddingBottom: Spacing.base
                }
            }))
        },
        welcomeImageContainer: {
            display: 'flex',
            alignItems: 'center',
            marginVertical: Spacing.large / 2,
            padding: Spacing.small
        },
        welcomeImage: {
            width: MEDIA_HEIGHT / 4,
            height: MEDIA_HEIGHT / 4
        },
        titleContainer: {
            display: "flex",
            alignItems: "center",
        },
        title: {
            fontFamily: Font.Black,
            fontSize: TextSize.h5,
            marginBottom: Spacing.small
        },
        inputContainer: {
            marginBottom: Spacing.tiny,
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
            alignSelf: 'flex-end',
            marginTop: Spacing.large
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