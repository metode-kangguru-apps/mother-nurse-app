import {
    Button,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from "react-native";
  import { NativeStackScreenProps } from "@react-navigation/native-stack";
  
  import { Font } from "src/lib/ui/font";
  import { Spacing } from "src/lib/ui/spacing";
  import { TextSize } from "src/lib/ui/textSize";
  import { color } from "src/lib/ui/color";
  
  import { AuthStackParamList, RootStackParamList } from "src/router/types";
  import FloatingInput from "src/common/FloatingInput";
  
  import { AntDesign } from "@expo/vector-icons";
  import { SimpleLineIcons } from "@expo/vector-icons";
  import DateTimePicker from "src/common/DateTimePicker";
  import PickerField from "src/common/PickerField";
  import { useAssets } from "expo-asset";
  import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
  import { useEffect, useMemo, useState } from "react";
  import { Baby, Authentication } from "@redux/actions/authentication/types";
  import { useSelector } from "react-redux";
  import { RootState } from "@redux/types";
  import { useAppDispatch } from "@redux/hooks";
  import {
      logOutUser,
    loginUser,
    signUpMotherWithGoogle,
  } from "@redux/actions/authentication/thunks";
  import { CompositeScreenProps } from "@react-navigation/native";
  import { clearAuthenticationDataSuccess } from "@redux/actions/authentication";
  
  const MEDIA_HEIGHT = Dimensions.get("window").height;
  
  interface Props
    extends CompositeScreenProps<
      NativeStackScreenProps<AuthStackParamList, "register-nurse-information">,
      NativeStackScreenProps<RootStackParamList>
    > {}
  
  const RegisterNurseInformation: React.FC<Props> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const insets = useSafeAreaInsets();
    const [formField, setFormField] = useState<Baby>({});
    const style = useMemo(() => createStyle(insets), [insets]);
    const { user, mother } = useSelector(
      (state: RootState) => state.authentication
    );
    const [assets, _] = useAssets([require("../../../assets/info-baby.png")]);
  
    useEffect(() => {
      if (mother && mother.babyCollection) {
        if (mother.babyCollection.length > 1) {
          navigation.navigate("mother", {
            screen: "select-baby",
          });
        } else {
          navigation.navigate("mother", {
            screen: "home",
          });
        }
      }
    }, [mother]);
  
    function handlerRegisterAccount() {
      const newUserObj = {
        user: {
          displayName: user?.displayName,
          userType: "member",
          userRole: "mother",
          isAnonymous: true,
        },
        mother: {
          phoneNumber: mother?.phoneNumber,
          babyRoomCode: mother?.babyRoomCode,
          babyCollection: [
            {
              displayName: formField.displayName,
              gestationAge: formField.gestationAge,
              birthDate: formField.birthDate,
              weight: formField.weight,
              length: formField.length,
              currentWeight: formField.weight,
              currentLength: formField.length,
              gender: formField.gender,
            },
          ],
        },
        nurse: undefined,
      };
      if (user?.isAnonymous) {
        dispatch(loginUser(newUserObj as Authentication));
      } else {
        const newGoogleUserObj = {
          ...newUserObj,
          user: {
            ...newUserObj.user,
            uid: user?.uid,
            isAnonymous: false,
          },
        };
        dispatch(signUpMotherWithGoogle(newGoogleUserObj as Authentication));
      }
    }
  
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, paddingTop: insets.top }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={style.container}>
            <Text>Nurse Register</Text>
            <Button title="Logout" onPress={() => dispatch(logOutUser())}></Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  };
  
  const createStyle = (insets: EdgeInsets) =>
    StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: "space-between",
      },
    });
  
  export default RegisterNurseInformation;
  