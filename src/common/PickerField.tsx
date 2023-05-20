import { useState, useMemo, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
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
import FloatingInput from "./FloatingInput";
import { firstCapital } from "src/lib/utils/string";

type Props = {
  label: string;
  items: Options[];
  defaultValue?: string;
  onFocus?: (state: boolean) => void;
  onChange?: (value: Options) => void;
  onSearch?: (value: string) => void;
  searchable?: boolean;
  loading?: boolean;
  required?: boolean;
  onError?: boolean;
};

const PickerFiled: React.FC<Props> = ({
  label,
  items,
  defaultValue,
  onFocus,
  onChange,
  onSearch,
  searchable = false,
  loading = false,
  required = false,
  onError = false,
}) => {
  const [focus, setFocus] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(defaultValue || "");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const isFocusedAnimated = useRef(new Animated.Value(0)).current;

  const borderColor = useMemo(() => handleBorderColorChange(focus), [focus]);

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

  function handlerSelectedValue(item: Options) {
    setInputValue(item.key);
    onChange && onChange(item);
    setModalVisible(false);
  }

  useEffect(() => {
    Animated.timing(isFocusedAnimated, {
      toValue: focus || inputValue !== "" ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [focus]);

  useEffect(() => {});

  return (
    <View style={style.wrapper}>
      {required && onError && !inputValue && (
        <Text style={style.errorMessage}>
          {firstCapital(label.toLowerCase())} harus di isi!
        </Text>
      )}
      <View style={style.container}>
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
          height={searchable ? "90%" : undefined}
        >
          {!searchable && <Text style={style.bottomSheetTitle}>{label}</Text>}
          {searchable && (
            <View style={style.searchPicker}>
              <FloatingInput
                bindFocus={modalVisible}
                onChange={(value) => {
                  onSearch && onSearch(value);
                }}
                label={`Cari ${label}`}
              />
            </View>
          )}
          <FlatList
            data={items}
            showsVerticalScrollIndicator={false}
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
            ListFooterComponent={() => (
              <>
                <Separator spacing={1} color={color.surface} />
                <Separator spacing={Spacing.base} color={color.lightneutral} />
              </>
            )}
          ></FlatList>
        </BottomSheet>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  errorMessage: {
    marginLeft: Spacing.extratiny,
    marginVertical: Spacing.extratiny,
    fontSize: TextSize.caption,
    color: color.apple,
  },
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
  textInput: {
    outlineStyle: "none",
    paddingTop: 22,
    paddingBottom: 8,
    position: "relative",
    backgroundColor: color.surface,
    borderRadius: 10,
    borderWidth: 2,
    height: 52,
    paddingHorizontal: Spacing.tiny + Spacing.extratiny,
  },
  searchPicker: {
    marginTop: Spacing.tiny,
    marginBottom: Spacing.small,
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
    marginBottom: Spacing.small,
  },
  selectorItem: {
    padding: Spacing.extratiny,
  },
});

export default PickerFiled;
