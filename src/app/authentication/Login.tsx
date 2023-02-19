import {
    FIREBASE_WEB_CLIENT_ID
} from '@env';
import { useEffect } from "react"
import { GoogleAuthProvider } from "firebase/auth"
import { useSelector } from "react-redux"
import { RootState } from "@redux/types"
import { AuthStackParamList } from "src/router/types"

import { Font } from "src/lib/ui/font"
import { Spacing } from "src/lib/ui/spacing"
import { TextSize } from "src/lib/ui/textSize"

import { useAssets } from "expo-asset"
import { useAppDispatch } from "@redux/hooks"
import * as WebBrowser from 'expo-web-browser';

import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { loginUser, loginWithGoogle } from "@redux/actions/user/thunks"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"

import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

interface Props extends NativeStackScreenProps<AuthStackParamList, 'login'> { }

const Login: React.FC<Props> = ({ navigation }) => {
    const dispatch = useAppDispatch()
    const { user, loading } = useSelector((state: RootState) => state.user)

    const [assets, _] = useAssets([require('../../../assets/google-icons.png')])

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
        { clientId: FIREBASE_WEB_CLIENT_ID }
    );
    
    // handle if user login with oAuth google
    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            dispatch(loginWithGoogle(credential))
            navigation.navigate('register-user-information')
        }
    }, [response])

    // handle if user already login
    useEffect(() => {
        if (user && !loading) {
            navigation.addListener('focus', () => {
                navigation.push('register-user-information');
            });
        }
    }, [])

    // handle if user sign-up anonymous
    const handleLoginUser = () => {
        try {
            dispatch(loginUser())
            navigation.push('register-user-information');
        } catch {
            return
        }
    }

    return (
        <View style={style.container}>
            <View style={style.welcomeImage}>
                <Ionicons name="md-images-outline" size={64} color="gray" />
            </View>
            <TouchableOpacity style={style.anonymousContainer} onPress={handleLoginUser}>
                <Text style={style.title}>Mulai sebagai Anonymous</Text>
                <AntDesign name="right" size={TextSize.title} color="black" />
            </TouchableOpacity>
            <View style={style.otherMethod}>
                <View style={style.line}></View>
                <Text style={style.other}>Atau masuk dengan</Text>
                <View style={style.line}></View>
            </View>
            <TouchableOpacity 
                style={style.loginWithGoogle} 
                disabled={!request} 
                onPress={() => promptAsync({})}
            >
                <View style={style.googleIcon}>
                    {assets &&
                        <Image
                            style={style.image}
                            source={{
                                uri: assets[0].localUri as string
                            }}
                        />
                    }
                </View>
                <Text style={style.googleButtonTitle}>Google</Text>
            </TouchableOpacity>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    welcomeImage: {
        width: "90%",
        height: "50%",
        backgroundColor: 'rgb(206, 206, 206)',
        marginBottom: Spacing.xlarge,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    googleButtonTitle: {
        fontFamily: Font.Bold,
        fontSize: TextSize.title,
        textAlign: "center",
    },
    loginWithGoogle: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgb(203, 203, 203)",
        borderRadius: Spacing.extratiny,
        marginTop: Spacing.extratiny,
        marginBottom: Spacing.tiny,
        paddingVertical: Spacing.extratiny * 3/2,
        paddingLeft: Spacing.tiny,
        paddingRight: Spacing.extratiny + Spacing.tiny
    },
    googleIcon: {
        width: Spacing.small + Spacing.extratiny,
        height: Spacing.small + Spacing.extratiny,
        marginRight: Spacing.tiny
    },
    image: {
        flex: 1,
    },
    anonymousContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    title: {
        fontFamily: Font.Bold,
        fontSize: TextSize.title,
        textAlign: "center",
        marginBottom: Spacing.extratiny,
        marginRight: Spacing.extratiny
    },
    otherMethod: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: Spacing.small
    },
    line: {
        height: 1,
        width: Spacing.large,
        backgroundColor: "rgb(120, 120, 120)",
        marginHorizontal: Spacing.small
    },
    other: {
        color: "rgb(120, 120, 120)",
        fontSize: TextSize.caption
    },
})

export default Login