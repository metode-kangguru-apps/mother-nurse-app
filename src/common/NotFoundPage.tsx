import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { logingOutUser } from "@redux/actions/authentication/thunks";
import { useAppDispatch } from "@redux/hooks";
import { RootStateV2 } from "@redux/types";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootStackParamList } from "src/router/types";

interface Props
  extends NativeStackScreenProps<RootStackParamList, "NotFound"> {}

const NotFoundPage: React.FC<Props> = ({ navigation }) => {
  const { user } = useSelector((state: RootStateV2) => state.authentication);
  const dispatch = useAppDispatch();
  function resetToAuth() {
    dispatch(logingOutUser());
    navigation.reset({
      index: 0,
      routes: [{ name: "auth" }],
    });
  }
  useEffect(() => {
    if (user) {
      if (user.userType === "member") {
        if (user.userRole === "nurse") {
          navigation.reset({
            index: 0,
            routes: [{ name: "nurse" }],
          });
        } else if (user.userRole === "mother") {
          navigation.reset({
            index: 0,
            routes: [{ name: "mother" }],
          });
        }
      } else {
        resetToAuth();
      }
    } else {
      resetToAuth();
    }
  }, []);
  return <></>;
};

export default NotFoundPage;
