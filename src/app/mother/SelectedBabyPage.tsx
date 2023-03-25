import { RootState } from "@redux/types";
import { useSelector } from "react-redux";
import {
  FlatList,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Font } from "src/lib/ui/font";
import { Spacing } from "src/lib/ui/spacing";
import { TextSize } from "src/lib/ui/textSize";
import { MotherStackParamList } from "src/router/types";
import { color } from "src/lib/ui/color";

import { EvilIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@redux/hooks";
import { getMotherData } from "@redux/actions/authentication/thunks";
import { BabyCollection } from "@redux/actions/authentication/types";
import { setSelectedTerapiBaby } from "@redux/actions/global";
import moment from "moment";
import BabyIcon from "src/lib/ui/icons/baby";

interface Props
  extends NativeStackScreenProps<MotherStackParamList, "select-baby"> {}

const HomePage: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user, mother } = useSelector(
    (state: RootState) => state.authentication
  );
  const [selectedBaby, setSelectedBaby] = useState<number | undefined>(
    undefined
  );
  useEffect(() => {
    if (!mother && user?.uid) {
      dispatch(getMotherData(user?.uid));
    }
  }, [mother]);

  const renderItemList: ListRenderItem<BabyCollection> = ({ item, index }) => {
    const dateBirthFormat = moment(item.babyObj.birthDate, "DD/MM/YYYY").format(
      "DD MMMM YYYY"
    );
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          setSelectedBaby(index);
        }}
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
                  item.babyObj.gender === "laki-laki"
                    ? color.primary
                    : color.secondary
                }
              ></BabyIcon>
            </View>
            <View>
              <Text style={style.babyBirthDate}>{dateBirthFormat}</Text>
              <Text style={style.babyName}>{item.babyObj.displayName}</Text>
            </View>
          </View>
          <View style={style.babyInfo}>
            <Text style={style.babyWeight}>Berat {item.babyObj.weight} gr</Text>
            <View style={style.devider}></View>
            <Text style={style.babyLength}>
              Panjang {item.babyObj.weight} cm
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };
  return (
    <View style={style.container}>
      <Text style={style.title}>Pilih Bayi</Text>
      <View style={style.babiesWrapper}>
        {/* TODO: @muhammadhafizm implement loading */}
        <FlatList
          data={mother?.babyCollection as BabyCollection[]}
          renderItem={renderItemList}
        />
      </View>
      <TouchableWithoutFeedback
        onPress={() => {
          if (
            selectedBaby !== undefined &&
            mother?.babyCollection?.[selectedBaby]
          ) {
            // navigate to selected baby
            // navigation.navigate("home", {
            //   "baby-id": (mother.babyCollection[selectedBaby] as BabyCollection)
            //     .babyID,
            // });
            dispatch(
              setSelectedTerapiBaby(
                mother.babyCollection[selectedBaby] as BabyCollection
              )
            );
            navigation.navigate("profile");
          }
        }}
      >
        <View
          style={[
            style.buttonStart,
            selectedBaby !== undefined ? style.buttonSelectedBaby : undefined,
          ]}
        >
          <Text style={style.textStart}>Mulai Terapi</Text>
          <EvilIcons name="arrow-right" size={24} color={color.lightneutral} />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.small,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: Font.Black,
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
    shadowOpacity: 0.1,
    shadowRadius: 7,
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
    fontFamily: Font.Bold,
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
});

export default HomePage;
