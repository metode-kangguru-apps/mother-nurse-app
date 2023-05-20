import Moment from "moment";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Platform,
  Pressable,
  Text,
} from "react-native";
import { Spacing } from "src/lib/ui/spacing";

import CustomModal from "./Modal";
import DatePicker from "react-native-modern-datepicker";
import { color } from "src/lib/ui/color";
import { firstCapital } from "src/lib/utils/string";
import { TextSize } from "src/lib/ui/textSize";

type Props = {
  label: string;
  defaultValue?: string;
  required?: boolean;
  onError?: boolean;
  onFocus?: (state: boolean) => void;
  onChange?: (value: string) => void;
};

const NativeDateTimePicker: React.FC<Props> = ({
  label,
  defaultValue,
  required = false,
  onError = false,
  onFocus,
  onChange,
}) => {
  const [focus, setFocus] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(defaultValue || "");
  const [showDateTimePicker, setShowDateTimePicker] = useState<boolean>(false);
  const isFocusedAnimated = useRef(new Animated.Value(0)).current;

  const borderColor = useMemo(() => handleBorderColorChange(focus), [focus]);
  const style = useMemo(() => createStyle(borderColor), [borderColor]);

  const handleAnimatedOnFocusTop = isFocusedAnimated.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 6],
  });

  const handleAnimatedOnFocusSize = isFocusedAnimated.interpolate({
    inputRange: [0, 1],
    outputRange: [14, 12],
  });

  function handleBorderColorChange(focus: boolean) {
    return !focus ? "transparent" : "rgba(0, 0, 255, 0.5)";
  }

  const showErrorMessage = useCallback(() => {
    if (required && onError && !inputValue) {
      return (
        <Text style={style.errorMessage}>
          {firstCapital(label.toLowerCase())} harus di isi!
        </Text>
      );
    }
  }, [required, onError, inputValue]);

  useEffect(() => {
    Animated.timing(isFocusedAnimated, {
      toValue: focus || inputValue !== "" ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [focus]);

  useEffect(() => {
    if (!showDateTimePicker) {
      setFocus(false);
      onFocus && onFocus(false);
    }
  }, [showDateTimePicker]);

  return (
    <View style={style.wrapper}>
      {showErrorMessage()}
      <View style={{ width: "100%" }}>
        <Animated.View
          pointerEvents={"none"}
          style={[
            style.labelWrapper,
            {
              transform: [{ translateY: handleAnimatedOnFocusTop }],
            },
          ]}
        >
          <Animated.Text
            style={[style.labelStyle, { fontSize: handleAnimatedOnFocusSize }]}
          >
            {label}
          </Animated.Text>
        </Animated.View>
        <Pressable
          style={style.textInput}
          onPress={() => {
            setFocus(true);
            onFocus && onFocus(true);
            setShowDateTimePicker(true);
          }}
        >
          <Text>{inputValue}</Text>
        </Pressable>
        <CustomModal
          visible={showDateTimePicker}
          onModalClose={() => {
            setShowDateTimePicker(false);
          }}
        >
          <View style={style.modalContentContainer}>
            <DatePicker
              style={{ borderRadius: 20 }}
              mode="calendar"
              onDateChange={(dateString) => {
                const resultString = Moment(new Date(dateString)).format(
                  "DD/MM/YYYY"
                );
                setShowDateTimePicker(false);
                setInputValue(resultString);
                onChange && onChange(resultString);
              }}
            ></DatePicker>
          </View>
        </CustomModal>
      </View>
    </View>
  );
};

const createStyle = (borderColor: string) => {
  const textInputPaddingHorizontal = Spacing.tiny + Spacing.extratiny;
  return StyleSheet.create({
    wrapper: {
      flex: 1,
    },
    errorMessage: {
      marginLeft: Spacing.extratiny,
      marginVertical: Spacing.extratiny,
      fontSize: TextSize.caption,
      color: color.apple,
    },
    labelWrapper: {
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
      top: Platform.OS === "android" ? 23 : 26,
      left: 15,
    },
    textInput: {
      outlineStyle: "none",
      paddingHorizontal: textInputPaddingHorizontal,
      paddingTop: Platform.OS === "android" ? 22 : 24,
      paddingBottom: Platform.OS === "android" ? 5 : 8,
      position: "relative",
      backgroundColor: color.surface,
      borderRadius: 10,
      borderColor: borderColor,
      borderWidth: 2,
      height: 52,
    },
    modalContentContainer: {
      width: 350,
      height: 350,
    },
  });
};

export default NativeDateTimePicker;
