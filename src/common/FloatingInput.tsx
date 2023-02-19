import { useState, useMemo, useEffect, useRef } from "react"
import { View, TextInput, StyleSheet, Animated, Platform } from "react-native"
import { Spacing } from "src/lib/ui/spacing"
import { TextSize } from "src/lib/ui/textSize"

type Props = {
    label: string,
    defaultValue?: string
}

const FloatingInput: React.FC<Props> = ({
    label,
    defaultValue
}) => {
    const [focus, setFocus] = useState<boolean>(false)
    const [inputValue, setInputValue] = useState<string>(defaultValue || '')
    const style = useMemo(() => createStyle(focus), [focus])
    const isFocusedAnimated = useRef(new Animated.Value(defaultValue === '' ? 0 : 1)).current;

    const handleTopBasedOnPlatform = (): number[] => {
        switch(Platform.OS){
            case 'web':
                return [16, 6]
            case 'android':
                return [24, 13]
            case 'ios':
                return [24, 14]
        }
        return [16, 6]
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

    useEffect(() => {
        Animated.timing(isFocusedAnimated, {
            toValue: (focus || inputValue !== '') ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [focus])

    return (
        <View style={style.inputContainer}>
            <Animated.Text style={[
                style.labelStyle, {
                    transform: [
                        {translateX: handleAnimatedOnFocusLeft},
                        {translateY: handleAnimatedOnFocusTop},
                        {scaleX: handleAnimatedOnFocusSize},
                        {scaleY: handleAnimatedOnFocusSize}
                    ],
                    fontSize: 14,
                    // web 14
                    color: '#aaa',
                }
            ]}>
                {label}
            </Animated.Text>
            <TextInput
                style={[style.textInput, {borderColor: !focus ? "rgb(203, 203, 203)" : "rgba(0, 0, 255, 0.5)"}]}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                onChange={(state) => setInputValue(state.nativeEvent.text)}
            />
        </View>
    )
}

const createStyle = (
    isFocused: boolean
) => {
    return StyleSheet.create({
        inputContainer: {
            paddingVertical: Spacing.tiny,
        },
        labelStyle: {
            position: 'absolute',
        },
        textInput: {
            borderWidth: 2,
            paddingHorizontal: Spacing.tiny + Spacing.extratiny,
            paddingTop: Platform.OS === 'android' ? 17 : 24,
            paddingBottom: Platform.OS === 'android' ? 4 : 8,
            position: 'relative',
            borderRadius: Spacing.tiny

        },
    })
}

export default FloatingInput