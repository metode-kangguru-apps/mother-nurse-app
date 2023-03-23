import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootState } from "@redux/types";
import { useSelector } from "react-redux";
import { Button, StyleSheet, Text, View } from "react-native";

import { Font } from "src/lib/ui/font";
import { Spacing } from "src/lib/ui/spacing";
import { TextSize } from "src/lib/ui/textSize";
import { MotherStackParamList } from "src/router/types";

interface Props
  extends NativeStackScreenProps<MotherStackParamList, "select-baby"> {}

const SelectBabyPage: React.FC<Props> = ({ navigation }) => {
  const { user, mother } = useSelector(
    (state: RootState) => state.authentication
  );
  return (
    <View style={style.container}>
      <Text style={style.title}>Mantap {user?.displayName}</Text>
      <Button
        title="go to selected baby"
        onPress={() => {
          if (mother && mother.babyRefs) {
            if (mother.babyRefs.length > 1) {
              navigation.navigate("home", { "baby-id": mother.babyRefs[0] });
            }
          }
        }}
      ></Button>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: Font.Bold,
    fontSize: TextSize.title,
    textAlign: "center",
    marginBottom: Spacing.extratiny,
  },
});

export default SelectBabyPage;
