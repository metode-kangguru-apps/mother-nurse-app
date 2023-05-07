import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { RootStackParamList } from "src/router/types";

interface Props
  extends NativeStackScreenProps<RootStackParamList, "NotFound"> {}

const NotFoundPage: React.FC<Props> = () => {
  useEffect(() => {
    location.replace("/");
  }, []);
  return <></>;
};

export default NotFoundPage;
