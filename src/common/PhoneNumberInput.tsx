import FloatingInput from "./FloatingInput";
import { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Spacing } from "src/lib/ui/spacing";
import { color } from "src/lib/ui/color";

interface Props {
  defaultValue?: string;
  onChange?: (value: string) => void;
}

const PhoneNumberInput: React.FC<Props> = ({ defaultValue, onChange }) => {
  const [focus, setFocus] = useState(false);
  return (
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
            onChange && onChange(value);
          }}
          onFocus={(state) => setFocus(state)}
        />
      </View>
    </View>
  );
};

const style = StyleSheet.create({
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
