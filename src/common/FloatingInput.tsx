import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Animated,
  Platform,
  KeyboardTypeOptions,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import { color } from "src/lib/ui/color";

import { Spacing } from "src/lib/ui/spacing";
import { TextSize } from "src/lib/ui/textSize";
import { firstCapital } from "src/lib/utils/string";

type Props = {
  label: string;
  required?: boolean;
  onError?: boolean;
  defaultValue?: string;
  type?: "no-border";
  keyboardType?: KeyboardTypeOptions;
  statePrefix?: string;
  onFocus?: (state: boolean) => void;
  onChange?: (value: string) => void;
  bindFocus?: boolean;
};

const FloatingInput: React.FC<Props> = ({
  label,
  defaultValue,
  type,
  keyboardType = "default",
  statePrefix,
  required = false,
  bindFocus = false,
  onError = false,
  onFocus,
  onChange,
}) => {
  const [focus, setFocus] = useState<boolean>(bindFocus);
  const [inputValue, setInputValue] = useState<string>(defaultValue || "");
  const isFocusedAnimated = useRef(new Animated.Value(0)).current;
  const textField = useRef<TextInput>(null);

  const style = useMemo(
    () => createStyle(type, !!statePrefix),
    [type, statePrefix]
  );
  const borderColor = useMemo(
    () => handleBorderColorChange(type, focus),
    [focus, type]
  );

  const handleAnimatedOnFocusTop = isFocusedAnimated.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 6],
  });

  const handleAnimatedOnFocusSize = isFocusedAnimated.interpolate({
    inputRange: [0, 1],
    outputRange: [14, 12],
  });

  function handleBorderColorChange(
    type: "no-border" | undefined,
    focus: boolean
  ) {
    if (!type) {
      return !focus ? "transparent" : "rgba(0, 0, 255, 0.5)";
    } else {
      return "transparent";
    }
  }

  function handleOnchange(
    state: NativeSyntheticEvent<TextInputChangeEventData>
  ) {
    const result = state.nativeEvent.text;
    if (Platform.OS === "web") {
      if (keyboardType === "phone-pad" || keyboardType=="number-pad") {
        if (!(/^[0-9]+$/.test(result) || result === "")) {
          return;
        }
      } else if (keyboardType === "decimal-pad") {
        if (!(/^[0-9.]+$/.test(result) || result === "")) {
          return;
        }
      }
    }
    setInputValue(result);
    onChange && onChange(result);
  }

  const showErrorMessage = useCallback(() => {
    if (required && onError && !inputValue) {
      return (
        <Text style={style.errorMessage}>
          {firstCapital(label.toLowerCase())} harus di isi!
        </Text>
      );
    }
  }, [inputValue, required, onError]);

  useEffect(() => {
    Animated.timing(isFocusedAnimated, {
      toValue: focus || inputValue !== "" || statePrefix ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
    setTimeout(() => {
      if (focus && textField.current) {
        textField.current.focus();
      }
    }, Platform.select({ ios: 700, android: 400 }));
  }, [focus]);

  return (
    <>
      {showErrorMessage()}
      <View>
        <Animated.View
          pointerEvents={"none"}
          style={[
            style.labelContainer,
            {
              transform: [{ translateY: handleAnimatedOnFocusTop }],
            },
          ]}
        >
          <Animated.Text
            style={[
              style.labelStyle,
              {
                fontSize: handleAnimatedOnFocusSize,
              },
            ]}
          >
            {label}
          </Animated.Text>
        </Animated.View>
        {statePrefix && <Text style={style.statePrefix}>{statePrefix}</Text>}
        <TextInput
          ref={textField}
          style={[style.textInput, { borderColor: borderColor }]}
          keyboardType={keyboardType}
          value={inputValue}
          onFocus={() => {
            setFocus(true);
            onFocus && onFocus(true);
          }}
          onBlur={() => {
            setFocus(false);
            onFocus && onFocus(false);
          }}
          onChange={(state) => {
            handleOnchange(state);
          }}
          defaultValue={defaultValue}
          returnKeyType="default"
        />
      </View>
    </>
  );
};

const createStyle = (type: "no-border" | undefined, isStatePrefix: boolean) => {
  const textInputPaddingHorizontal = Spacing.tiny + Spacing.extratiny;
  return StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    container: {
      flex: 1,
    },
    errorMessage: {
      marginLeft: Spacing.extratiny,
      marginVertical: Spacing.extratiny,
      fontSize: TextSize.caption,
      color: color.apple,
    },
    labelContainer: {
      left: Platform.OS === "android" ? 12 : 14,
      zIndex: 1,
      position: "absolute",
    },
    labelStyle: {
      fontSize: 14,
      color: color.neutral,
    },
    statePrefix: {
      position: "absolute",
      top: Platform.OS === "android" ? 21.5 : 24,
      left: 13,
      zIndex: 1,
    },
    textInput: {
      outlineStyle: "none",
      paddingHorizontal: textInputPaddingHorizontal,
      paddingTop: Platform.OS === "android" ? 17 : 24,
      paddingBottom: Platform.OS === "android" ? 4 : 8,
      position: "relative",
      backgroundColor: color.surface,
      borderRadius: 10,
      ...(type === "no-border"
        ? {}
        : {
            borderWidth: 2,
          }),
      ...(isStatePrefix && {
        paddingLeft:
          textInputPaddingHorizontal +
          (Spacing.small * 2 - Spacing.extratiny / 2),
      }),
    },
  });
};

export default FloatingInput;
