import {
    FlatList,
    ListRenderItem,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from "react-native";
  
  import { useMemo } from "react";
  import { RootStateV2 } from "@redux/types";
  import { Session } from "@redux/actions/pmkCare/types";
  import { NativeStackScreenProps } from "@react-navigation/native-stack";
  
  import { useSelector } from "react-redux";
  import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
  
  import Separator from "src/common/Separator";
  
  import { Font } from "src/lib/ui/font";
  import { color } from "src/lib/ui/color";
  import { Spacing } from "src/lib/ui/spacing";
  
  import { NurseStackParamList } from "src/router/types";
  import Header from "src/common/Header";
  import { TextSize } from "src/lib/ui/textSize";
  
  interface Props
    extends NativeStackScreenProps<NurseStackParamList, "session"> {}
  
  const SessionPMKPage: React.FC<Props> = ({ navigation }) => {
    const insets = useSafeAreaInsets();
    const style = useMemo(() => createStyle(insets), []);
    const session = useSelector((state: RootStateV2) => state.pmkCare.sessions);
  
    const renderSessionItem: ListRenderItem<Session> = ({ item, index }) => {
      return (
        <View
          style={style.sessionsContainer}
          key={`session_${item.monitoredRangeDate}_${index}`}
        >
          <Text style={style.sessionsRangeDate}>{item.monitoredRangeDate}</Text>
          {item.durations.map((stringDuration, idx) => (
            <View
              style={style.sessionContentContainer}
              key={`duration_${item.monitoredRangeDate}_${idx}`}
            >
              <Text style={style.sessionIndex}>Sesi {idx + 1}</Text>
              <View style={style.sessionDurationContainer}>
                <Text style={style.sessionLable}>Total Durasi</Text>
                <Text style={style.sessionDuration}>{stringDuration}</Text>
              </View>
            </View>
          ))}
        </View>
      );
    };
  
    return (
      <View style={style.container}>
        <Header
          title="Riwayat Sesi PMK"
          titleStyle={{ fontFamily: Font.Bold }}
          onBackButton={() => navigation.pop()}
        />
        {session.length ? (
          <FlatList
            style={style.progressWrapper}
            data={session}
            renderItem={renderSessionItem}
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
        ) : (
          <View style={style.sessionEmpty}>
            <View style={style.sessionEmptyContent}>
              <Text style={style.textSessionEmpty}>
                Terapi PMK belum pernah di lakukan dalam aplikasi
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  };
  
  const createStyle = (insets: EdgeInsets) =>
    StyleSheet.create({
      container: {
        flex: 1,
      },
      sessionsContainer: {
        flex: 1,
        display: "flex",
      },
      sessionsRangeDate: {
        fontSize: TextSize.title,
        fontFamily: Font.Bold,
        marginBottom: Spacing.tiny,
      },
      sessionContentContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        paddingVertical: Spacing.tiny,
        paddingHorizontal: Spacing.small,
        backgroundColor: color.lightneutral,
        borderLeftWidth: Spacing.extratiny,
        borderColor: color.primary,
        borderBottomRightRadius: 10,
        borderTopRightRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        marginBottom: Spacing.tiny,
      },
      sessionIndex: {
        fontFamily: Font.Bold,
        fontSize: TextSize.title,
      },
      sessionDurationContainer: {
        display: "flex",
        flexDirection: "row",
        marginTop: Spacing.extratiny / 2
      },
      sessionLable: {
        fontFamily: Font.Light,
        fontSize: TextSize.body,
        marginRight: Spacing.tiny
      },
      sessionDuration: {
        fontSize: TextSize.body,
        fontFamily: Font.Medium,
      },
      progressWrapper: {
        paddingHorizontal: Spacing.base,
        paddingTop: Spacing.small,
        paddingBottom: Spacing.base + insets.bottom,
      },
      sessionEmpty: {
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      sessionEmptyContent: {
        display: "flex",
        width: "100%",
        bottom: 60,
        alignItems: "center",
        position: "relative",
      },
      textSessionEmpty: {
        maxWidth: 290,
        fontSize: TextSize.title,
        fontFamily: Font.Medium,
        textAlign: "center",
      },
    });
  
  export default SessionPMKPage;
  