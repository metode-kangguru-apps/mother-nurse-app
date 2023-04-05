import Moment from "moment";
import { useAppDispatch } from "@redux/hooks";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Animated,
  Platform,
  KeyboardTypeOptions,
  Pressable,
  Text,
} from "react-native";
import { Spacing } from "src/lib/ui/spacing";

import CustomModal from "./Modal";
import DatePicker from "react-native-modern-datepicker";

type Props = {
  label: string;
  defaultValue?: string;
  onFocus?: (state: boolean) => void;
  onChange?: (value: string) => void;
};

const NativeDateTimePicker: React.FC<Props> = ({
  label,
  defaultValue,
  onFocus,
  onChange,
}) => {
  const [focus, setFocus] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(defaultValue || "");
  const [showDateTimePicker, setShowDateTimePicker] = useState<boolean>(false);
  const isFocusedAnimated = useRef(new Animated.Value(0)).current;

  const borderColor = useMemo(() => handleBorderColorChange(focus), [focus]);
  const style = useMemo(() => createStyle(borderColor), [borderColor]);

  const handleTopBasedOnPlatform = (): number[] => {
    switch (Platform.OS) {
      case "ios":
        return [17, 7];
      default:
        return [16, 6];
    }
  };

  const handleAnimatedOnFocusTop = isFocusedAnimated.interpolate({
    inputRange: [0, 1],
    outputRange: handleTopBasedOnPlatform(),
  });

  const handleAnimatedOnFocusLeft = isFocusedAnimated.interpolate({
    inputRange: [0, 1],
    outputRange: Platform.OS === "android" ? [14, 8] : [14, 9],
  });

  const handleAnimatedOnFocusSize = isFocusedAnimated.interpolate({
    inputRange: [0, 1],
    outputRange: Platform.OS === "web" ? [1, 0.9] : [1, 0.9],
  });

  function handleBorderColorChange(focus: boolean) {
    return !focus ? "rgb(203, 203, 203)" : "rgba(0, 0, 255, 0.5)";
  }

  useEffect(() => {
    Animated.timing(isFocusedAnimated, {
      toValue: focus || inputValue !== "" ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [focus]);

  useEffect(() => {
    if (!showDateTimePicker) {
      setFocus(false);
      onFocus && onFocus(false);
    }
  }, [showDateTimePicker]);

  return (
    <View style={{ width: "100%" }}>
      <Animated.Text
        style={[
          style.labelStyle,
          {
            transform: [
              { translateX: handleAnimatedOnFocusLeft },
              { translateY: handleAnimatedOnFocusTop },
              { scaleX: handleAnimatedOnFocusSize },
              { scaleY: handleAnimatedOnFocusSize },
            ],
            fontSize: 14,
            // web 14
            color: "#aaa",
          },
        ]}
      >
        {label}
      </Animated.Text>
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
  );
};

const createStyle = (borderColor: string) => {
  const textInputPaddingHorizontal = Spacing.tiny + Spacing.extratiny;
  return StyleSheet.create({
    labelStyle: {
      position: "absolute",
    },
    statePrefix: {
      position: "absolute",
      top: Platform.OS === "android" ? 23 : 26,
      left: 15,
    },
    textInput: {
      borderColor: borderColor,
      outlineStyle: "none",
      paddingHorizontal: textInputPaddingHorizontal,
      paddingTop: Platform.OS === "android" ? 22 : 24,
      paddingBottom: Platform.OS === "android" ? 4 : 8,
      position: "relative",
      borderWidth: 2,
      borderRadius: 10,
      height: 52,
    },
    modalContentContainer: {
      width: 350,
      height: 350,
    },
  });
};

export default NativeDateTimePicker;
