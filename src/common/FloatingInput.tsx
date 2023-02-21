import { useState, useMemo, useEffect, useRef } from "react"
import { View, Text, TextInput, StyleSheet, Animated, Platform, KeyboardTypeOptions } from "react-native"
import { Spacing } from "src/lib/ui/spacing"

type Props = {
    label: string,
    defaultValue?: string,
    type?: "no-border",
    keyboardType?: KeyboardTypeOptions,
    statePrefix?: string, 
    onFocus?: (state: boolean) => void
}

const FloatingInput: React.FC<Props> = ({
    label,
    defaultValue,
    type,
    keyboardType = "default",
    statePrefix,
    onFocus
}) => {
    const [focus, setFocus] = useState<boolean>(false)
    const [inputValue, setInputValue] = useState<string>(defaultValue || statePrefix || '')
    const isFocusedAnimated = useRef(new Animated.Value(0)).current;

    const style = useMemo(() => createStyle(type, !!statePrefix), [type, statePrefix])
    const borderColor = useMemo(() => handleBorderColorChange(type, focus), [focus, type])

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

    function handleBorderColorChange(
        type: "no-border" | undefined,
        focus: boolean
    ) {
        if (!type) {
            return !focus ? "rgb(203, 203, 203)" : "rgba(0, 0, 255, 0.5)"
        } else {
            return "transparent"
        }
    }

    useEffect(() => {
        Animated.timing(isFocusedAnimated, {
            toValue: (focus || inputValue !== '' || statePrefix) ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [focus])

    return (
        <View>
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
            {statePrefix &&
                <Text style={style.statePrefix}>{statePrefix}</Text>
            }
            <TextInput
                style={[style.textInput, { borderColor: borderColor, outlineStyle: 'none' }]}
                keyboardType={keyboardType}
                onFocus={() => {
                    setFocus(true)
                    onFocus && onFocus(true)
                }}
                onBlur={() => {
                    setFocus(false)
                    onFocus && onFocus(false)
                }}
                onChange={(state) => {
                    setInputValue(state.nativeEvent.text)
                }}
                defaultValue={defaultValue}
            />
        </View>
    )
}

const createStyle = (
    type: "no-border" | undefined,
    isStatePrefix: boolean
) => {
    const textInputPaddingHorizontal = Spacing.tiny + Spacing.extratiny
    return StyleSheet.create({
        labelStyle: {
            position: 'absolute',
        },
        statePrefix: {
            position: 'absolute',
            top: Platform.OS === 'android' ? 23 : 26,
            left: 15
        },
        textInput: {
            paddingHorizontal: textInputPaddingHorizontal,
            paddingTop: Platform.OS === 'android' ? 17 : 24,
            paddingBottom: Platform.OS === 'android' ? 4 : 8,
            position: 'relative',
            outline: "none",
            borderWidth: 2,
            ...(type === 'no-border' ? {} : {
                borderRadius: 10
            }),
            ...(isStatePrefix && {
                paddingLeft: textInputPaddingHorizontal + (Spacing.small * 2 - Spacing.extratiny / 2)
            })
        },
    })
}

export default FloatingInput