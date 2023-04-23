import { useState, useMemo, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Platform,
  Pressable,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { color } from "src/lib/ui/color";
import { Font } from "src/lib/ui/font";
import { Spacing } from "src/lib/ui/spacing";
import { TextSize } from "src/lib/ui/textSize";
import BottomSheet from "./BottomSheet";
import Separator from "./Separator";
import { Options } from "./types";

type Props = {
  label: string;
  items: Options[];
  defaultValue?: string;
  onFocus?: (state: boolean) => void;
  onChange?: (value: string) => void;
};

const FloatingInput: React.FC<Props> = ({
  label,
  items,
  defaultValue,
  onFocus,
  onChange,
}) => {
  const [focus, setFocus] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(defaultValue || "");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const isFocusedAnimated = useRef(new Animated.Value(0)).current;

  const borderColor = useMemo(() => handleBorderColorChange(focus), [focus]);

  const handleAnimatedOnFocusTop = isFocusedAnimated.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 6]
  });

  const handleAnimatedOnFocusSize = isFocusedAnimated.interpolate({
    inputRange: [0, 1],
    outputRange: [14, 12]
  });

  function handleBorderColorChange(focus: boolean) {
    return !focus ? "transparent" : "rgba(0, 0, 255, 0.5)";
  }

  function handlerSelectedValue(item: Options) {
    setInputValue(item.key);
    onChange && onChange(item.value);
    setModalVisible(false);
  }

  useEffect(() => {
    Animated.timing(isFocusedAnimated, {
      toValue: focus || inputValue !== "" ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [focus]);

  return (
    <View style={style.container}>
      <Animated.View
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
        style={[style.textInput, { borderColor: borderColor }]}
        onPress={() => {
          setFocus(true);
          onFocus && onFocus(true);
          setModalVisible(true);
        }}
      >
        <Text>{inputValue}</Text>
      </Pressable>
      <BottomSheet
        visible={modalVisible}
        onCloseModal={() => {
          setModalVisible(false);
          setFocus(false);
          onFocus && onFocus(false);
        }}
      >
        <Text style={style.bottomSheetTitle}>{label}</Text>
        <FlatList
          data={items}
          renderItem={(state) => (
            <TouchableOpacity
              onPress={() => handlerSelectedValue(state.item)}
              style={style.selectorItem}
            >
              <Text>{state.item.key}</Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => (
            <Separator spacing={1} color={color.surface} />
          )}
          ListHeaderComponent={() => (
            <Separator spacing={1} color={color.surface} />
          )}
          ListFooterComponent={() => (
            <Separator spacing={1} color={color.surface} />
          )}
        ></FlatList>
      </BottomSheet>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    position: "relative",
  },
  labelWrapper: {
    position: "absolute",
    left: 14,
    zIndex: 1,
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
    paddingTop: 24,
    paddingBottom: 8,
    position: "relative",
    backgroundColor: color.surface,
    borderRadius: 10,
    borderWidth: 2,
    height: 52,
    paddingHorizontal: Spacing.tiny + Spacing.extratiny,
  },
  pickerContainer: {
    position: "absolute",
    width: "100%",
    backgroundColor: "#F3F3F3",
    padding: Spacing.small,
    borderRadius: 10,
    top: 60,
    zIndex: 10,
  },
  bottomSheetTitle: {
    fontFamily: Font.Medium,
    fontSize: TextSize.title,
    marginBottom: Spacing.tiny,
  },
  selectorItem: {
    padding: Spacing.extratiny,
  },
});

export default FloatingInput;
