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
import { memo, useEffect, useRef, useState } from "react";
import { BABY_CARE_LIST } from "./constant";

interface Props
  extends NativeStackScreenProps<MotherStackParamList, "monitoring"> {}

interface Timer {
  hours: string;
  minutes: string;
  seconds: string;
}

const MonitoringPage: React.FC<Props> = ({ navigation }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [second, setSecond] = useState<number>(0);
  const [timer, setTimer] = useState<Timer>({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const randomIndex = useRef<number>(Math.floor(Math.random() * BABY_CARE_LIST.length));

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setSecond((prev) => {
        formatTime(prev + 1);
        return prev + 1;
      });
    }, 1000);
  }, []);

  function formatTime(time: number) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    const paddedHours = hours.toString().padStart(2, "0");
    const paddedMinutes = minutes.toString().padStart(2, "0");
    const paddedSeconds = seconds.toString().padStart(2, "0");

    setTimer({
      hours: paddedHours,
      minutes: paddedMinutes,
      seconds: paddedSeconds,
    });
  }

  function handleStopSession() {
    setOpenModal(true);
    clearInterval(intervalRef.current!);
  }

  return (
    <View style={style.container}>
      <View style={style.timerContainer}>
        <View style={style.timerWrapper}>
          <Text style={style.timer}>{timer.hours}</Text>
          <Text style={style.timerInformation}>jam</Text>
        </View>
        <Text style={style.timer}>:</Text>
        <View style={style.timerWrapper}>
          <Text style={style.timer}>{timer.minutes}</Text>
          <Text style={style.timerInformation}>menit</Text>
        </View>
        <Text style={style.timer}>:</Text>
        <View style={style.timerWrapper}>
          <Text style={style.timer}>{timer.seconds}</Text>
          <Text style={style.timerInformation}>detik</Text>
        </View>
      </View>
      <View style={style.contentContainer}>
        <TouchableOpacity onPress={() => handleStopSession()}>
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
          {BABY_CARE_LIST[randomIndex.current]}
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
    display: "flex",
    flexDirection: "row",

    marginBottom: Spacing.large,
  },
  timer: {
    fontSize: TextSize.h3,
    fontFamily: Font.Bold,
    color: color.lightneutral,
    textAlign: "center",
    marginHorizontal: Spacing.extratiny,
  },
  timerWrapper: {
    display: "flex",
    alignItems: "center",
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

export default memo(MonitoringPage);
