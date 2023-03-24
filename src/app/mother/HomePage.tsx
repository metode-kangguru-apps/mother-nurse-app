import { StyleSheet, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Font } from "src/lib/ui/font";
import { Spacing } from "src/lib/ui/spacing";
import { TextSize } from "src/lib/ui/textSize";
import { MotherStackParamList } from "src/router/types";

interface Props extends NativeStackScreenProps<MotherStackParamList, "home"> {}

const HomePage: React.FC<Props> = ({ navigation }) => {
  return <View style={style.container}>Hello World</View>;
};

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontFamily: Font.Bold,
    fontSize: TextSize.title,
    textAlign: "center",
    marginBottom: Spacing.extratiny,
  },
  image: {
    width: 38,
    height: 38,
  },
});

export default HomePage;
