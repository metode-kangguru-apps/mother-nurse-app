import { Platform } from "react-native";
import { useSelector } from "react-redux";
import { RootStateV2 } from "@redux/types";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomePage from "@app/mother/HomePage";
import ModulePage from "@app/mother/ModulePage";
import PMKCarePage from "@app/mother/PMKCarePage";
import ProfilePage from "@app/mother/ProfilePage";
import MonitoringPage from "@app/mother/MonitoringPage";
import SelectBabyPage from "@app/mother/SelectedBabyPage";
import AddProgressPage from "@app/mother/AddProgressPage";
import HistoryProgressPage from "@app/mother/HistoryProgressPage";
import AddNewBabyInformation from "@app/mother/AddNewBabyInformation";

import { MotherStackParamList } from "./types";

import { color } from "src/lib/ui/color";
import SessionPMKPage from "@app/mother/SessionPMKPage";
import WelcomePage from "@app/mother/WelcomePage";
import { Mother } from "@redux/actions/authentication/types";
import OnboardingPage from "@app/mother/OnboardingPage";

const MotherStack = createNativeStackNavigator<MotherStackParamList>();

const MotherRouter: React.FC<{}> = () => {
  const user = useSelector(
    (state: RootStateV2) => state.authentication.user as Mother
  );
  const baby = useSelector((state: RootStateV2) => state.pmkCare.baby);
  return (
    <MotherStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: color.surface, flex: 1 },
        animation: "none",
      }}
    >
      {!Object.keys(baby).length ? (
        <MotherStack.Screen
          name="select-baby"
          component={SelectBabyPage}
          options={{
            title: "Pilih Bayi",
            animation: Platform.select({
              ios: "slide_from_left",
              android: "simple_push",
            })
          }}
        />
      ) : (
        <>
          {!user.isFinnishedOnboarding ? (
            <>
              <MotherStack.Screen
                name="welcome"
                component={WelcomePage}
                options={{
                  title: "Selamat Datang",
                  animation: "slide_from_left"
                }}
              />
              <MotherStack.Screen
                name="onboarding"
                component={OnboardingPage}
                options={{
                  title: "Selamat Datang",
                  animation: "slide_from_left"
                }}
              />
            </>
          ) : (
            <>
              <MotherStack.Screen
                name="home"
                component={HomePage}
                options={{
                  title: "Perawatan Metode Kangguru",
                  animationTypeForReplace: "pop",
                  animation: Platform.select({
                    ios: "slide_from_left",
                    android: "simple_push",
                  }),
                }}
              />
              <MotherStack.Screen
                name="profile"
                component={ProfilePage}
                options={{
                  title: "Profil",
                  animation: "slide_from_right",
                }}
              />
              <MotherStack.Screen
                name="monitoring"
                component={MonitoringPage}
                options={{
                  title: "Sedang Terapi PMK",
                  animation: Platform.select({
                    ios: "fade_from_bottom",
                    android: "simple_push",
                  }),
                }}
              />
              <MotherStack.Screen
                name="add-progress"
                component={AddProgressPage}
                options={{
                  title: "Tambah Progress Bayi",
                  animation: "slide_from_right",
                }}
              />
              <MotherStack.Screen
                name="pmk-care"
                component={PMKCarePage}
                options={{
                  title: "Informasi Seputar PMK",
                  animation: "slide_from_right",
                }}
              />
              <MotherStack.Screen
                name="history"
                component={HistoryProgressPage}
                options={{
                  title: "Riwayat Pencatatan Bayi",
                  animation: "slide_from_right",
                }}
              />
              <MotherStack.Screen
                name="session"
                component={SessionPMKPage}
                options={{
                  title: "Riwayat Sesi PMK",
                  animation: "slide_from_right",
                }}
              />
              <MotherStack.Screen
                name="module"
                component={ModulePage}
                options={{
                  title: "Modul Pembelajaran PMK",
                  animation: "slide_from_right",
                }}
              />
            </>
          )}
        </>
      )}
      <MotherStack.Screen
        name="add-new-baby"
        component={AddNewBabyInformation}
        options={{
          title: "Tambah Bayi Baru",
          animationTypeForReplace: "pop",
          animation: Platform.select({
            ios: "slide_from_left",
            android: "simple_push",
          }),
        }}
      />
    </MotherStack.Navigator>
  );
};

export default MotherRouter;
