import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  FlatList,
  ListRenderItem,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { RootStateV2 } from "@redux/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";


import Header from "src/common/Header";
import { Font } from "src/lib/ui/font";
import { color } from "src/lib/ui/color";
import { Spacing } from "src/lib/ui/spacing";
import Separator from "src/common/Separator";
import ProgressCard from "src/common/ProgressCard";
import { MotherStackParamList } from "src/router/types";

import { format } from 'date-fns';
import { Progress } from "@redux/actions/pmkCare/types";
import { Timestamp } from "firebase/firestore";

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
      const createdAt = item.createdAt as Timestamp
      const formattedCreatedAt = new Date(
        createdAt.seconds * 1000 + createdAt.nanoseconds / 1000000
      );
      const day = formattedCreatedAt.getDate().toString().padStart(2, "0");
      const month = format(formattedCreatedAt, "MMM")
      const year = formattedCreatedAt.getFullYear().toString().slice(2);
      renderedDate = `${day} ${month} \'${year}`;

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
        title="Riwayat"
        titleStyle={{ fontFamily: Font.Bold }}
        onBackButton={() => navigation.replace("home")}
      />
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
  });

export default HistoryProgressPage;
