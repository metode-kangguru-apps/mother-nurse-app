import {
  Dimensions,
  Platform,
  StyleSheet,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Font } from "src/lib/ui/font";
import { Spacing } from "src/lib/ui/spacing";
import { TextSize } from "src/lib/ui/textSize";
import { color } from "src/lib/ui/color";

import { MotherStackParamList } from "src/router/types";

import { EdgeInsets, } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import {
  Baby,
  AddBabyPayload,
} from "@redux/actions/authentication/types";
import { useSelector } from "react-redux";
import { RootState } from "@redux/types";
import { useAppDispatch } from "@redux/hooks";
import { addNewBaby } from "@redux/actions/authentication/thunks";
import RegisterBabyPage from "@app/authentication/RegisterBabyInformation/RegisterBabyPage";

const MEDIA_HEIGHT = Dimensions.get("window").height;

interface Props
  extends NativeStackScreenProps<MotherStackParamList, "add-new-baby"> {}

const AddNewBabyInformation: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user, mother} = useSelector(
    (state: RootState) => state.authentication
  );
  const [rememberBabyCount, _] = useState<number>(
    mother.babyCollection.length + 1
  );

  useEffect(() => {
    // if baby increase redierect to select baby
    if (rememberBabyCount === mother.babyCollection.length) {
      navigation.replace("select-baby");
    }
  }, [mother.babyCollection]);

  function handlerRegisterBaby(babyData: Baby) {
    const babyPayload: AddBabyPayload = {
      userId: user.uid,
      babyData: {
        displayName: babyData.displayName,
        gestationAge: babyData.gestationAge,
        birthDate: babyData.birthDate,
        weight: babyData.weight,
        length: babyData.length,
        currentWeight: babyData.weight,
        currentLength: babyData.length,
        gender: babyData.gender,
      },
    };
    dispatch(addNewBaby(babyPayload));
  }

  function handleBackButton() {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("select-baby");
    }
  }

  return (
    <RegisterBabyPage
      title="Tambah Bayi"
      handleBackButton={handleBackButton}
      handleRegisterBaby={handlerRegisterBaby}
    />
  );
};

const createStyle = (insets: EdgeInsets) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
    },
    contentContainer: {
      width: "100%",
      backgroundColor: color.lightneutral,
      padding: Spacing.base - Spacing.extratiny,
      borderTopLeftRadius: Spacing.xlarge / 2,
      borderTopRightRadius: Spacing.xlarge / 2,
      justifyContent: "space-between",
      minHeight:
        (MEDIA_HEIGHT * 3) / 4 -
        (Spacing.base - Spacing.extratiny) -
        Spacing.xlarge -
        insets.top,
      ...Platform.select({
        native: {
          paddingBottom: insets.top,
        },
        web: {
          paddingBottom: Spacing.base,
        },
      }),
    },
    welcomeImageContainer: {
      display: "flex",
      alignItems: "center",
      marginVertical: Spacing.xlarge / 2,
      padding: Spacing.small,
    },
    welcomeImage: {
      width: MEDIA_HEIGHT / 4,
      height: MEDIA_HEIGHT / 4,
    },
    titleContainer: {
      display: "flex",
      alignItems: "center",
    },
    title: {
      fontFamily: Font.Bold,
      fontSize: TextSize.h5,
      marginBottom: Spacing.small,
    },
    inputContainer: {
      marginBottom: Spacing.tiny,
    },
    buttonContainer: {
      display: "flex",
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignSelf: "flex-end",
      marginTop: Spacing.base,
    },
    nextButton: {
      paddingVertical: Spacing.xsmall,
      paddingHorizontal: Spacing.large,
      backgroundColor: color.secondary,
      borderRadius: Spacing.xlarge,
    },
    buttonTitle: {
      fontFamily: Font.Bold,
      fontSize: TextSize.body,
      color: color.lightneutral,
    },
    prevButton: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    prevButtonTitle: {
      color: color.accent2,
      fontSize: TextSize.body,
      fontFamily: Font.Bold,
      paddingLeft: Spacing.small,
    },
  });

export default AddNewBabyInformation;
