import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  FlatList,
  ListRenderItem,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStateV2 } from "@redux/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

import Header from "src/common/Header";
import Separator from "src/common/Separator";
import ProgressCard from "src/common/ProgressCard";

import { Font } from "src/lib/ui/font";
import { color } from "src/lib/ui/color";
import { Spacing } from "src/lib/ui/spacing";
import MotherIcons from "src/lib/ui/icons/Mother";

import { MotherStackParamList } from "src/router/types";

import { format } from "date-fns";
import { Progress } from "@redux/actions/pmkCare/types";
import { Timestamp } from "firebase/firestore";
import { AntDesign } from "@expo/vector-icons";
import { TextSize } from "src/lib/ui/textSize";
import { calculateStringDateTime } from "src/lib/utils/calculate";

interface Props
  extends NativeStackScreenProps<MotherStackParamList, "history"> {}

const HistoryProgressPage: React.FC<Props> = ({ navigation }) => {
  const { progress } = useSelector((state: RootStateV2) => state.pmkCare);
  const insets = useSafeAreaInsets();
  const style = useMemo(() => createStyle(insets), []);

  const renderProgressItem: ListRenderItem<Progress> = ({ item, index }) => {
    let renderedDate = "";
    let renderedTime = "";
    // format time to fit design
    if (item.createdAt) {
      const createdAt = item.createdAt as Timestamp;
      const formattedCreatedAt = new Date(
        createdAt.seconds * 1000 + createdAt.nanoseconds / 1000000
      );
      renderedDate = calculateStringDateTime(formattedCreatedAt);
      const hours = formattedCreatedAt.getHours().toString().padStart(2, "0");
      const minutes = formattedCreatedAt
        .getMinutes()
        .toString()
        .padStart(2, "0");
      renderedTime = `${hours}:${minutes}`;
    }
    return (
      <ProgressCard
        date={renderedDate}
        time={renderedTime}
        week={item.week}
        weight={item.weight}
        length={item.length}
        temperature={item.temperature}
        key={index}
      />
    );
  };

  return (
    <View style={style.container}>
      <Header
        title="Riwayat Pertumbuhan"
        titleStyle={{ fontFamily: Font.Bold }}
        onBackButton={() => navigation.pop()}
      />
      <TouchableOpacity onPress={() => navigation.push("session")}>
        <View style={style.moduleMenu}>
          <View style={style.moduleContent}>
            <View style={style.moduleIcon}>
              <MotherIcons
                width={24}
                height={28}
                viewBox="0 0 30 34"
                color={color.primary}
              />
            </View>
            <Text style={style.moduleTitle}>Riwayat Sesi PMK</Text>
          </View>
          <View style={style.moduleGoToButton}>
            <AntDesign name="arrowright" size={20} color={color.primary} />
          </View>
        </View>
      </TouchableOpacity>
      <FlatList
        style={style.progressWrapper}
        data={progress}
        renderItem={renderProgressItem}
        ListFooterComponent={
          <Separator
            spacing={Platform.select({
              web: Spacing.none,
              native: Spacing.base,
            })}
            color={color.surface}
          />
        }
      />
    </View>
  );
};

const createStyle = (insets: EdgeInsets) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    progressWrapper: {
      padding: Spacing.base,
      paddingBottom: Spacing.base + insets.bottom,
    },
    moduleMenu: {
      padding: Spacing.base,
      marginHorizontal: Spacing.base,
      backgroundColor: color.lightneutral,
      borderRadius: 10,
      marginBottom: Spacing.tiny,
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      shadowOffset: { width: 2, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 5,
    },
    moduleContent: {
      flex: 1,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    moduleIcon: {
      flex: 0.07,
      marginRight: Spacing.base,
      justifyContent: "center",
      alignItems: "center",
    },
    moduleTitle: {
      flex: 0.85,
      fontFamily: Font.Medium,
      fontSize: TextSize.title,
    },
    moduleGoToButton: {
      display: "flex",
      justifyContent: "center",
    },
  });

export default HistoryProgressPage;
