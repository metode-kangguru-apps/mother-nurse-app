import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { logOutUser } from "@redux/actions/authentication/thunks";
import { useAppDispatch } from "@redux/hooks";
import { RootState } from "@redux/types";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import { useSelector } from "react-redux";
import { Font } from "src/lib/ui/font";
import { Spacing } from "src/lib/ui/spacing";
import { TextSize } from "src/lib/ui/textSize";
import { MotherStackParamList, RootStackParamList } from "src/router/types";

interface Props
  extends CompositeScreenProps<
    NativeStackScreenProps<MotherStackParamList, "logout">,
    NativeStackScreenProps<RootStackParamList>
  > {}

const LogOut: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user, loading } = useSelector(
    (state: RootState) => state.authentication
  );
  const handleLogOutUser = () => {
    dispatch(logOutUser());
  };

  useEffect(() => {
    if (!loading && !user) {
      navigation.navigate("auth", {
        screen: "login",
      });
    }
  }, [loading, user]);

  return (
    <View style={style.container}>
      <TouchableWithoutFeedback onPress={handleLogOutUser}>
        <Text style={style.title}>Logout</Text>
      </TouchableWithoutFeedback>
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

export default LogOut;
