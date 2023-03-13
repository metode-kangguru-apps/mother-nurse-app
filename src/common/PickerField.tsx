import { useState, useMemo, useEffect, useRef } from "react"
import { View, Text, StyleSheet, Animated, Platform, Pressable } from "react-native"
import { Spacing } from "src/lib/ui/spacing"
import BottomSheet from "./BottomSheet"
import { Options } from "./types"


type Props = {
    label: string,
    items: Options[]
    defaultValue?: string,
    onFocus?: (state: boolean) => void
}

const FloatingInput: React.FC<Props> = ({
    label,
    items,
    defaultValue,
    onFocus
}) => {
    const [focus, setFocus] = useState<boolean>(false)
    const [inputValue, setInputValue] = useState<string>(defaultValue || '')
    const [modalVisible, setModalVisible] = useState<boolean>(false)
    const isFocusedAnimated = useRef(new Animated.Value(0)).current;

    const borderColor = useMemo(() => handleBorderColorChange(focus), [focus])

    const handleTopBasedOnPlatform = (): number[] => {
        switch (Platform.OS) {
            case 'ios':
                return [17, 7]
            default:
                return [16, 6]
        }
    }

    const handleAnimatedOnFocusTop = isFocusedAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: handleTopBasedOnPlatform(),

    })

    const handleAnimatedOnFocusLeft = isFocusedAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: Platform.OS === 'android' ? [14, 8] : [14, 9],
    })

    const handleAnimatedOnFocusSize = isFocusedAnimated.interpolate({
        inputRange: [0, 1],
        outputRange: Platform.OS === 'web' ? [1, 0.9] : [1, 0.9],
    })

    function handleBorderColorChange(focus: boolean) {
        return !focus ? "rgb(203, 203, 203)" : "rgba(0, 0, 255, 0.5)"
    }

    useEffect(() => {
        Animated.timing(isFocusedAnimated, {
            toValue: (focus || inputValue !== '') ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [focus])

    return (
        <View style={style.container}>
            <Animated.Text style={[
                style.labelStyle, {
                    transform: [
                        { translateX: handleAnimatedOnFocusLeft },
                        { translateY: handleAnimatedOnFocusTop },
                        { scaleX: handleAnimatedOnFocusSize },
                        { scaleY: handleAnimatedOnFocusSize }
                    ],
                    fontSize: 14,
                    // web 14
                    color: '#aaa',
                }
            ]}>
                {label}
            </Animated.Text>
            <Pressable
                style={[style.textInput, { borderColor: borderColor }]}
                onPress={() => {
                    setFocus(true)
                    onFocus && onFocus(true)
                    setModalVisible(true)
                }}
            >
                <Text>
                    {inputValue}
                </Text>
            </Pressable>
           <BottomSheet 
                visible={modalVisible}
                onCloseModal={() => {
                    setModalVisible(false)
                    setFocus(false)
                    onFocus && onFocus(false)
                }}
            >
                <Text>Hello World</Text>
            </BottomSheet>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        position: 'relative'
    },
    labelStyle: {
        position: 'absolute',
    },
    statePrefix: {
        position: 'absolute',
        top: Platform.OS === 'android' ? 23 : 26,
        left: 15
    },
    textInput: {
        paddingHorizontal: Spacing.tiny + Spacing.extratiny,
        paddingTop: Platform.OS === 'android' ? 17 : 24,
        paddingBottom: Platform.OS === 'android' ? 4 : 8,
        position: 'relative',
        borderWidth: 2,
        outlineStyle: 'none',
        borderRadius: 10,
        height: 52,
    },
    pickerContainer: {
        position: "absolute",
        width: "100%",
        backgroundColor: "#F3F3F3",
        padding: Spacing.small,
        borderRadius: 10,
        top: 60,
        zIndex: 10
    },
})


export default FloatingInput