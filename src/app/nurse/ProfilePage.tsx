import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootState } from "@redux/types";
import {
  Button,
  StyleSheet,
  View,
} from "react-native";

import { useSelector } from "react-redux";

import { NurseStackParamList, RootStackParamList } from "src/router/types";


import { useAppDispatch } from "@redux/hooks";
import { logOutUser } from "@redux/actions/authentication/thunks";
import { useEffect } from "react";
import { CompositeScreenProps } from "@react-navigation/native";

interface Props
  extends CompositeScreenProps<
    NativeStackScreenProps<NurseStackParamList, "profile">,
    NativeStackScreenProps<RootStackParamList>
  > {}

const ProfilePage: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user, loading } = useSelector(
    (state: RootState) => state.authentication
  );

  useEffect(() => {
    if (!loading && !user) {
      navigation.navigate("auth", {
        screen: "login",
      });
    }
  }, [loading, user]);

  return (
    <View style={style.flex}>
      <Button title="logout" onPress={() => dispatch(logOutUser())}></Button>
    </View>
  );
};

const style = StyleSheet.create({
  flex: {
    flex: 1,
  },
});

export default ProfilePage;
