import { useMemo } from "react";

import {
  FlatList,
  ListRenderItem,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { MotherStackParamList } from "src/router/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

import { AntDesign } from "@expo/vector-icons";

import { Font } from "src/lib/ui/font";
import { Spacing } from "src/lib/ui/spacing";
import { color } from "src/lib/ui/color";

import Header from "src/common/Header";
import Separator from "src/common/Separator";
import { TextSize } from "src/lib/ui/textSize";
import { MODULE_ITEM_LIST } from "../constant";

interface Props
  extends NativeStackScreenProps<MotherStackParamList, "module"> {}

const ModulePage: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const style = useMemo(() => createStyle(insets), []);

  const renderProgressItem: ListRenderItem<any> = ({ item, index }) => {
    return (
      <TouchableOpacity key={index}>
        <View style={style.moduleMenu}>
          <View style={style.moduleContent}>
            <View style={style.moduleIcon}>{item.icon()}</View>
            <Text style={style.moduleTitle}>{item.title}</Text>
          </View>
          <View style={style.moduleGoToButton}>
            <AntDesign name="arrowright" size={20} color={color.primary} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={style.container}>
      <Header
        title="Modul"
        titleStyle={{ fontFamily: Font.Bold }}
        onBackButton={() => navigation.pop()}
      />
      <FlatList
        style={style.progressWrapper}
        data={MODULE_ITEM_LIST}
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
      flex: 1,
      padding: Spacing.base,
      backgroundColor: color.lightneutral,
      borderRadius: 10,
      marginBottom: Spacing.small,
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
      marginRight: Spacing.base,
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

export default ModulePage;
