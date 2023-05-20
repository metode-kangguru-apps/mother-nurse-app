import FloatingInput from "./FloatingInput";
import { useCallback, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Spacing } from "src/lib/ui/spacing";
import { color } from "src/lib/ui/color";
import { TextSize } from "src/lib/ui/textSize";

interface Props {
  required?: boolean;
  onError?: boolean;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

const PhoneNumberInput: React.FC<Props> = ({
  required,
  onError,
  defaultValue,
  onChange,
}) => {
  const [inputValue, setInputValue] = useState<string>(defaultValue || "");
  const [focus, setFocus] = useState(false);

  const showErrorMessage = useCallback(() => {
    if (required && onError && !inputValue) {
      return (
        <Text style={style.errorMessage}>Nomor telepon harus di isi!</Text>
      );
    } else if (onError && (inputValue.length < 8 || inputValue.length > 13)) {
      return (
        <Text style={style.errorMessage}>
          Nomor telepon minimal 8 & maksimal 13 karakter
        </Text>
      );
    }
    return;
  }, [inputValue, required, onError]);

  return (
    <View style={style.wrapper}>
      {showErrorMessage()}
      <View
        style={[
          style.inputContainer,
          { borderColor: !focus ? "transparent" : "rgba(0, 0, 255, 0.5)" },
        ]}
      >
        <View style={style.countryProviderCode}>
          <View style={style.countryProviderLogoContainer}>
            <Image
              style={style.countryProviderLogo}
              source={require("../../assets/indonesia-icon.png")}
            />
          </View>
        </View>
        <View style={style.textInput}>
          <FloatingInput
            label="Nomor Telepon"
            type="no-border"
            statePrefix="+62"
            keyboardType="phone-pad"
            defaultValue={defaultValue}
            onChange={(value) => {
              setInputValue(value);
              onChange && onChange(value);
            }}
            onFocus={(state) => setFocus(state)}
          />
        </View>
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
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    borderWidth: 2,
    borderRadius: 10,
    backgroundColor: color.surface,
  },
  countryProviderCode: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.small,
  },
  countryProviderLogoContainer: {
    width: Spacing.base,
    height: Spacing.base,
  },
  countryProviderLogo: {
    flex: 1,
  },
  textInput: {
    flex: 1,
  },
});

export default PhoneNumberInput;
