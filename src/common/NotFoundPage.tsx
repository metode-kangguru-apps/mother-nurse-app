import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { logOutUser } from "@redux/actions/authentication/thunks";
import { useAppDispatch } from "@redux/hooks";
import { persistor } from "@redux/store";
import React, { useEffect } from "react";
import { RootStackParamList } from "src/router/types";

interface Props
  extends NativeStackScreenProps<RootStackParamList, "NotFound"> {}

const NotFoundPage: React.FC<Props> = () => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(logOutUser())
    setTimeout(() => {
      location.replace("/");
    }, 2000)
  }, []);
  return <></>;
};

export default NotFoundPage;
