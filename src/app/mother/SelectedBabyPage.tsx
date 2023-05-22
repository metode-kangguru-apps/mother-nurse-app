import { useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import moment from "moment";
import { RootStateV2 } from "@redux/types";
import { useSelector } from "react-redux";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Font } from "src/lib/ui/font";
import { color } from "src/lib/ui/color";
import { Spacing } from "src/lib/ui/spacing";
import BabyIcon from "src/lib/ui/icons/baby";
import { TextSize } from "src/lib/ui/textSize";
import { weekDifference } from "src/lib/utils/calculate";

import { MotherStackParamList } from "src/router/types";

import { useAppDispatch } from "@redux/hooks";
import { EvilIcons, AntDesign } from "@expo/vector-icons";

import { Timestamp } from "firebase/firestore";
import { getBabyProgressAndSession } from "@redux/actions/pmkCare/thunks";
import { Mother } from "@redux/actions/authentication/types";
import { Baby } from "@redux/actions/pmkCare/types";

interface Props
  extends NativeStackScreenProps<MotherStackParamList, "select-baby"> {}

const SelectedBabyPage: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { uid, babyCollection } = useSelector(
    (state: RootStateV2) => state.authentication.user as Mother
  );
  const [loading, setLoading] = useState<boolean>();
  const [selectedBaby, setSelectedBaby] = useState<number | undefined>(
    undefined
  );

  const renderItemList = (item: Baby, index: number) => {
    const dateBirthFormat = moment(item.birthDate, "DD/MM/YYYY").format(
      "DD MMMM YYYY"
    );
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          setSelectedBaby(index);
        }}
        key={index}
      >
        <View
          style={[
            style.babyContainer,
            selectedBaby === index ? style.selectedBaby : undefined,
          ]}
        >
          <View style={style.babyContent}>
            <View style={style.babyIcon}>
              <BabyIcon
                color={
                  item.gender === "laki-laki" ? color.primary : color.secondary
                }
              ></BabyIcon>
            </View>
            <View>
              <Text style={style.babyBirthDate}>{dateBirthFormat}</Text>
              <Text style={style.babyName}>{item.displayName}</Text>
            </View>
          </View>
          <View style={style.babyInfo}>
            <Text style={style.babyWeight}>Berat {item.currentWeight} gr</Text>
            <View style={style.devider}></View>
            <Text style={style.babyLength}>
              Panjang {item.currentLength} cm
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const handleSelectedBaby = () => {
    if (selectedBaby !== undefined && babyCollection[selectedBaby]) {
      setLoading(true);
      // count different week
      const babyCreatedAt = babyCollection[selectedBaby].createdAt as Timestamp;
      const formattedBabyCreatedAt = new Date(
        babyCreatedAt.seconds * 1000 + babyCreatedAt.nanoseconds / 1000000
      );
      const weekDiff = weekDifference(formattedBabyCreatedAt);
      const currentWeek = babyCollection[selectedBaby].gestationAge + weekDiff;

      let selectedBabyDocument = {
        ...babyCollection[selectedBaby],
        currentWeek,
      };
      dispatch(
        getBabyProgressAndSession({ userID: uid, baby: selectedBabyDocument })
      ).then(() => {
        setLoading(false);
      });
    }
  };

  return (
    <View style={style.scrollWrapper}>
      <ImageBackground
        source={require("../../../assets/baby-pattern.png")}
        style={style.backgroundPattern}
      />
      <ScrollView contentContainerStyle={style.wrapper}>
        <View style={style.container}>
          <Text style={style.title}>Pilih Bayi</Text>
          <View style={style.babiesWrapper}>
            {/* TODO: @muhammadhafizm implement loading */}
            {babyCollection &&
              babyCollection.map((element: Baby, index: number) => {
                return renderItemList(element, index);
              })}
            <TouchableWithoutFeedback
              onPress={() => navigation.push("add-new-baby")}
            >
              <View style={style.addBabyButton} pointerEvents="box-only">
                <Text style={style.addBabyTitle}>Tambah Bayi</Text>
                <AntDesign name="pluscircleo" size={20} color={color.primary} />
              </View>
            </TouchableWithoutFeedback>
          </View>
          <TouchableWithoutFeedback onPress={handleSelectedBaby}>
            <View
              style={[
                style.buttonStart,
                selectedBaby !== undefined
                  ? style.buttonSelectedBaby
                  : undefined,
              ]}
            >
              {!loading ? (
                <>
                  <Text style={style.textStart}>Mulai Terapi</Text>
                  <EvilIcons
                    name="arrow-right"
                    size={TextSize.h5}
                    color={color.lightneutral}
                  />
                </>
              ) : (
                <ActivityIndicator size={TextSize.h5} color={color.rose} />
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
    </View>
  );
};

const style = StyleSheet.create({
  scrollWrapper: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
  wrapper: {
    flexGrow: 1,
    justifyContent: "space-around",
  },
  container: {
    padding: Spacing.small,
    display: "flex",
    flexDirection: "column",
  },
  backgroundPattern: {
    flex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
    opacity: 0.25,
  },
  title: {
    fontFamily: Font.Bold,
    fontSize: TextSize.h5,
    textAlign: "center",
    marginBottom: Spacing.base,
  },
  image: {
    width: 32,
    height: 32,
  },
  babiesWrapper: {
    width: "100%",
    marginBottom: Spacing.base,
  },
  babyContainer: {
    backgroundColor: color.lightneutral,
    width: "100%",
    borderRadius: 20,
    padding: Spacing.small,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    marginBottom: Spacing.tiny,
    borderWidth: 2,
    borderColor: color.surface,
  },
  babyContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  babyIcon: {
    marginRight: Spacing.small,
  },
  babyBirthDate: {
    color: color.neutral,
    fontFamily: Font.Medium,
  },
  babyName: {
    fontSize: TextSize.h6,
  },
  babyInfo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.extratiny,
  },
  babyWeight: {
    color: color.accent2,
  },
  devider: {
    width: 1,
    height: "80%",
    backgroundColor: color.accent2,
    marginHorizontal: Spacing.extratiny,
  },
  babyLength: {
    color: color.accent2,
  },
  buttonStart: {
    width: "100%",
    borderRadius: Spacing.xlarge,
    backgroundColor: color.accent2,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.small + Spacing.extratiny / 2,
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
  },
  textStart: {
    color: color.lightneutral,
    marginRight: Spacing.xsmall,
  },
  selectedBaby: {
    borderColor: color.secondary,
  },
  buttonSelectedBaby: {
    backgroundColor: color.secondary,
  },
  addBabyButton: {
    width: "100%",
    borderRadius: 30,
    paddingVertical: Spacing.xsmall,
    backgroundColor: color.lightneutral,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    marginBottom: Spacing.small,
  },
  addBabyTitle: {
    fontFamily: Font.Medium,
    fontSize: TextSize.title,
    color: color.primary,
    marginRight: Spacing.tiny,
  },
});

export default SelectedBabyPage;
