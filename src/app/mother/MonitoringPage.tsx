import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { MotherStackParamList } from "src/router/types";

import { color } from "src/lib/ui/color";
import { TextSize } from "src/lib/ui/textSize";
import { Font } from "src/lib/ui/font";
import { Spacing } from "src/lib/ui/spacing";
import CustomModal from "src/common/Modal";
import { useState } from "react";

interface Props
  extends NativeStackScreenProps<MotherStackParamList, "monitoring"> {}

const MonitoringPage: React.FC<Props> = ({ navigation }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <View style={style.container}>
      <View style={style.timerContainer}>
        {/* TODO: @muhammadhafizmm logic timer */}
        <Text style={style.timer}>01:35</Text>
        <View style={style.timerInformationWrapper}>
          <Text style={style.timerInformation}>jam</Text>
          <Text style={style.timerInformation}>menit</Text>
        </View>
      </View>
      <View style={style.contentContainer}>
        <TouchableOpacity onPress={() => setOpenModal(true)}>
          <View style={style.stopButton}>
            <Text style={style.stopButtonTitle}>Hentikan Sesi</Text>
          </View>
        </TouchableOpacity>
        <View style={style.pmkModulWrapper}>
          <Text style={style.pmkModulCaption}>Lihat kembali</Text>
          <View style={style.pmkModulButton}>
            <Text style={style.pmkModulTitle}>Modul PMK</Text>
          </View>
        </View>
      </View>
      {/* TODO: @muhammadhafizmm logic baby care */}
      <View style={style.babyCareWrapper}>
        <Text style={style.babyCareContent}>
          Bayi baru lahir rata-rata tidur 18-22 jam sehari
        </Text>
      </View>
      <CustomModal visible={openModal} modalClosable={false}>
        <View style={style.modalStopPMKWrapper}>
          <Text style={style.modalTitle}>Sesi hari ini selesai</Text>
          <Text style={style.modalMessage}>
            Jangan lupa nanti lanjutkan PMK lagi ya!
          </Text>
          <TouchableOpacity
            onPress={() => {
              setOpenModal(false);
              navigation.replace("add-progress");
            }}
          >
            <View style={style.buttonAddProgress}>
              <Text style={style.addProgressTitle}>Catat Pertumbuhan</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setOpenModal(false);
              navigation.replace("home");
            }}
          >
            <Text style={style.closeMonitoring}>Tutup</Text>
          </TouchableOpacity>
        </View>
      </CustomModal>
    </View>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.primary,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  timerContainer: {
    marginBottom: Spacing.large,
  },
  timer: {
    fontSize: TextSize.h3,
    fontFamily: Font.Bold,
    color: color.lightneutral,
  },
  timerInformationWrapper: {
    display: "flex",
    paddingHorizontal: Spacing.small,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timerInformation: {
    color: color.lightneutral,
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  stopButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: color.lightneutral,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    marginBottom: Spacing.large,
  },
  stopButtonTitle: {
    width: "80%",
    color: color.primary,
    fontFamily: Font.Bold,
    fontSize: TextSize.h5,
    textAlign: "center",
  },
  pmkModulWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xlarge + Spacing.base,
  },
  pmkModulCaption: {
    fontFamily: Font.Regular,
    color: color.lightneutral,
    marginBottom: Spacing.tiny,
  },
  pmkModulButton: {
    paddingHorizontal: Spacing.xlarge / 2,
    paddingVertical: Spacing.small,
    backgroundColor: color.secondary,
    borderRadius: Spacing.xlarge / 2,
  },
  pmkModulTitle: {
    fontFamily: Font.Medium,
    fontSize: TextSize.title,
    color: color.lightneutral,
  },
  babyCareWrapper: {
    width: "65%",
    paddingTop: Spacing.base,
    borderTopWidth: 1,
    borderColor: color.lightneutral,
  },
  babyCareContent: {
    fontFamily: Font.Regular,
    fontSize: TextSize.title,
    color: color.lightneutral,
    textAlign: "center",
  },
  modalStopPMKWrapper: {
    width: "80%",
    display: "flex",
    alignItems: "center",
    paddingVertical: Spacing.base,
    backgroundColor: color.lightneutral,
    borderRadius: 30,
    ...Platform.select({
      web: {
        paddingHorizontal: Spacing.large,
      },
      native: {
        paddingHorizontal: Spacing.xlarge / 2,
      },
    }),
  },
  modalTitle: {
    width: "70%",
    fontFamily: Font.Bold,
    fontSize: TextSize.h5,
    textAlign: "center",
  },
  modalMessage: {
    fontFamily: Font.Regular,
    fontSize: TextSize.title,
    marginVertical: Spacing.base,
    textAlign: "center",
  },
  buttonAddProgress: {
    paddingHorizontal: Spacing.xlarge / 2,
    paddingVertical: Spacing.small,
    backgroundColor: color.secondary,
    borderRadius: Spacing.xlarge / 2,
    marginBottom: Spacing.base,
  },
  addProgressTitle: {
    fontFamily: Font.Bold,
    fontSize: TextSize.title,
    color: color.lightneutral,
    textAlign: "center",
  },
  closeMonitoring: {
    color: color.secondary,
    fontFamily: Font.Medium,
    fontSize: TextSize.title,
  },
});

export default MonitoringPage;
