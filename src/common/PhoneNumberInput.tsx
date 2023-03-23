import FloatingInput from "./FloatingInput";
import { useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { useAssets } from "expo-asset";
import { Spacing } from "src/lib/ui/spacing";

interface Props {
  defaultValue?: string;
  onChange?: (value: string) => void;
}

const PhoneNumberInput: React.FC<Props> = ({ defaultValue, onChange }) => {
  const [assets, _] = useAssets([require("../../assets/indonesia-icon.png")]);
  const [focus, setFocus] = useState(false);
  return (
    <View
      style={[
        style.inputContainer,
        { borderColor: !focus ? "rgb(203, 203, 203)" : "rgba(0, 0, 255, 0.5)" },
      ]}
    >
      <View style={style.countryProviderCode}>
        <View style={style.countryProviderLogoContainer}>
          {assets && (
            <Image
              style={style.countryProviderLogo}
              source={{
                uri: assets[0].localUri as string,
              }}
            />
          )}
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
