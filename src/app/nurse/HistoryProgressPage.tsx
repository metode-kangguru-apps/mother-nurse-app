import { RootState } from "@redux/types";
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
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { NurseStackParamList } from "src/router/types";

import Header from "src/common/Header";
import { Font } from "src/lib/ui/font";
import { useMemo } from "react";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { Progress } from "@redux/actions/baby/types";
import ProgressCard from "src/common/ProgressCard";
import { Spacing } from "src/lib/ui/spacing";
import Separator from "src/common/Separator";
import { color } from "src/lib/ui/color";

import { format } from "date-fns";
import { AntDesign } from "@expo/vector-icons";

interface Props
  extends NativeStackScreenProps<NurseStackParamList, "history-progress"> {}

const HistoryProgressPage: React.FC<Props> = ({ navigation }) => {
  const { progress } = useSelector((state: RootState) => state.baby);
  const insets = useSafeAreaInsets();
  const style = useMemo(() => createStyle(insets), []);

  const renderProgressItem: ListRenderItem<Progress> = ({ item, index }) => {
    let renderedDate = "";
    let renderedTime = "";
    // format time to fit design
    if (item.createdAt) {
      const createdAtProgress = new Date(
        item.createdAt.seconds * 1000 + item.createdAt.nanoseconds / 1000000
      );
      const day = createdAtProgress.getDate().toString().padStart(2, "0");
      const month = format(createdAtProgress, "MMM");
      const year = createdAtProgress.getFullYear().toString().slice(2);
      renderedDate = `${day} ${month} \'${year}`;

      const hours = createdAtProgress.getHours().toString().padStart(2, "0");
      const minutes = createdAtProgress
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
      <View style={style.buttonProgressWrapper}>
        <TouchableOpacity onPress={() => console.log("")}>
          <View style={style.buttonProgress}>
            <Text style={style.progressText}>
              Catat <Text style={style.bold}>Pertumbuhan</Text>
            </Text>
            <AntDesign
              name="pluscircleo"
              size={20}
              color={color.lightneutral}
            />
          </View>
        </TouchableOpacity>
      </View>
      {progress && (
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
      )}
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
    buttonProgressWrapper: {
      paddingTop: Spacing.base,
      paddingHorizontal: Spacing.base,
    },
    buttonProgress: {
      width: "100%",
      borderRadius: Spacing.xlarge,
      backgroundColor: color.secondary,
      paddingHorizontal: Spacing.base,
      paddingVertical: Spacing.small + Spacing.extratiny / 2,
      display: "flex",
      justifyContent: "center",
      flexDirection: "row",
      marginVertical: Spacing.xsmall,
    },
    bold: {
      fontFamily: Font.Bold,
    },
    progressText: {
      color: color.lightneutral,
      marginRight: Spacing.xsmall,
    },
  });

export default HistoryProgressPage;
