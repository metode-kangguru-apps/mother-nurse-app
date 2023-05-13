import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { logOutUser } from "@redux/actions/authentication/thunks";
import { useAppDispatch } from "@redux/hooks";
import { persistor } from "@redux/store";
import { RootState } from "@redux/types";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootStackParamList } from "src/router/types";

interface Props
  extends NativeStackScreenProps<RootStackParamList, "NotFound"> {}

const NotFoundPage: React.FC<Props> = ({navigation}) => {
  const { user, mother, nurse } = useSelector((state: RootState) => state.authentication)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (user.userType === 'member') {
      if (user.userRole === 'nurse') {
        navigation.reset({
          index: 0,
          routes: [{name: 'nurse'}],
        })
      } else if (user.userRole === 'mother') {
        navigation.reset({
          index: 0,
          routes: [{name: 'mother'}],
        })
      }
    } else {
      dispatch(logOutUser())
      navigation.reset({
        index: 0,
        routes: [{name: 'auth'}],
      })
    }
  }, []);
  return <></>;
};

export default NotFoundPage;
