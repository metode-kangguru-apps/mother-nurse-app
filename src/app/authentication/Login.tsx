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

import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { loginUser, loginWithGoogle } from "@redux/actions/user/thunks"
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"

import * as Google from 'expo-auth-session/providers/google';
import { color } from 'src/lib/ui/color';

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
            <TouchableOpacity style={style.anonymousContainer} onPress={handleLoginUser}>
                <Text style={style.title}>Daftar</Text>
            </TouchableOpacity>
            <View style={style.otherMethod}>
                <Text style={style.other}>Atau masuk dengan</Text>
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
    googleButtonTitle: {
        fontFamily: Font.Bold,
        fontSize: TextSize.title,
        textAlign: "center",
    },
    loginWithGoogle: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: color.lightneutral,
        borderRadius: Spacing.large,
        paddingVertical: Spacing.xsmall,
        paddingHorizontal: Spacing.xlarge / 2,
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
        alignItems: 'center',
        justifyContent: 'center',
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: color.primary,
        marginBottom: Spacing.xlarge

    },
    title: {
        fontFamily: Font.Black,
        fontSize: TextSize.h4,
        textAlign: "center",
        color: "white"
    },
    otherMethod: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.tiny
    },
    other: {
        color: color.neutral,
        fontSize: TextSize.title,
        fontFamily: Font.Regular
    },
})

export default Login