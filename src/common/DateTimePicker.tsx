import { clearDateTimePicker, setShowDateTimePicker } from "@redux/actions/global"
import { useAppDispatch } from "@redux/hooks"
import { RootState } from "@redux/types"
import { useState, useMemo, useEffect, useRef } from "react"
import { View, TextInput, StyleSheet, Animated, Platform, KeyboardTypeOptions } from "react-native"
import { useSelector } from "react-redux"
import { Spacing } from "src/lib/ui/spacing"

type Props = {
    label: string,
    defaultValue?: string,
    type?: "no-border",
    keyboardType?: KeyboardTypeOptions,
    onFocus?: (state: boolean) => void
}

const FloatingInput: React.FC<Props> = ({
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

    const style = useMemo(() => createStyle(type), [type])
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
            toValue: (focus || inputValue !== '') ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [focus])

    useEffect(() => {
        if (!showDateTimePicker && dateTimePicker) {
            textInputRef.current?.blur()
            setInputValue(dateTimePicker)
            dispatch(clearDateTimePicker())
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
            <TextInput
                ref={textInputRef}
                style={[style.textInput, { borderColor: borderColor, outlineStyle: 'none' }]}
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
        </View>
    )
}

const createStyle = (
    type: "no-border" | undefined,
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
        },
    })
}

export default FloatingInput