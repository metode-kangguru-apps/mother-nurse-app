import { clearDateTimePicker, setShowDateTimePicker } from "@redux/actions/global"
import { useAppDispatch } from "@redux/hooks"
import { RootState } from "@redux/types"
import { useState, useMemo, useEffect, useRef } from "react"
import { View, TextInput, StyleSheet, Animated, Platform, KeyboardTypeOptions, Pressable, Text } from "react-native"
import { useSelector } from "react-redux"
import { Spacing } from "src/lib/ui/spacing"

type Props = {
    label: string,
    defaultValue?: string,
    type?: "no-border",
    keyboardType?: KeyboardTypeOptions,
    onFocus?: (state: boolean) => void
}

const NativeDateTimePicker: React.FC<Props> = ({
    label,
    defaultValue,
    type,
    keyboardType = "default",
    onFocus
}) => {
    const dispatch = useAppDispatch()
    const [focus, setFocus] = useState<boolean>(false)
    const [inputValue, setInputValue] = useState<string>(defaultValue || '')
    const isFocusedAnimated = useRef(new Animated.Value(0)).current;
    const textInputRef = useRef(null)

    const {
        showDateTimePicker,
        dateTimePicker
    } = useSelector((state: RootState) => state.global)

    const borderColor = useMemo(() => handleBorderColorChange(focus), [focus])
    const style = useMemo(() => createStyle(borderColor), [borderColor])

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
        focus: boolean
    ) {
        return !focus ? "rgb(203, 203, 203)" : "rgba(0, 0, 255, 0.5)"
    }

    useEffect(() => {
        Animated.timing(isFocusedAnimated, {
            toValue: (focus || inputValue !== '') ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [focus])

    useEffect(() => {
        if (!showDateTimePicker) {
            if (Platform.OS === 'web') {
                setFocus(false)
                onFocus && onFocus(false)
            }
            if (dateTimePicker) {
                textInputRef.current?.blur()
                setInputValue(dateTimePicker)
                dispatch(clearDateTimePicker())
            }
        }
    }, [showDateTimePicker])

    return (
        <View style={{ width: "100%" }}>
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
            { Platform.OS === 'web' ? (
                <Pressable
                    style={[style.textInput, style.textInputWeb]}
                    onPress={() => {
                        setFocus(true)
                        onFocus && onFocus(true)
                        dispatch(setShowDateTimePicker({
                            showDateTimePicker: true,
                        }))
                    }}
                >
                    <Text>
                        {inputValue}
                    </Text>
                </Pressable>
            ) : (
                <TextInput
                    ref={textInputRef}
                    style={style.textInput}
                    keyboardType={keyboardType}
                    onFocus={() => {
                        setFocus(true)
                        onFocus && onFocus(true)
                        dispatch(setShowDateTimePicker({
                            showDateTimePicker: true,
                        }))
                    }}
                    onBlur={() => {
                        setFocus(false)
                        onFocus && onFocus(false)
                        dispatch(setShowDateTimePicker({
                            showDateTimePicker: false
                        }))
                    }}
                    onChange={(state) => {
                        setInputValue(state.nativeEvent.text)
                    }}
                    showSoftInputOnFocus={false}
                    defaultValue={inputValue}
                />
            )}
        </View>
    )
}

const createStyle = (
    borderColor: string
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
            borderColor: borderColor,
            outlineStyle: 'none',
            paddingHorizontal: textInputPaddingHorizontal,
            paddingTop: Platform.OS === 'android' ? 17 : 24,
            paddingBottom: Platform.OS === 'android' ? 4 : 8,
            position: 'relative',
            borderWidth: 2,
            borderRadius: 10
        },
        textInputWeb: {
            height: 52,
        }
    })
}

export default NativeDateTimePicker