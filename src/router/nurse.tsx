import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NurseStackParamList } from "./types";

import { color } from "src/lib/ui/color";
import ProfilePage from "@app/nurse/ProfilePage";
import { useSelector } from "react-redux";
import { RootState, RootStateV2 } from "@redux/types";
import MotherDetailPage from "@app/nurse/MotherDetailPage";
import DetailBabyPage from "@app/nurse/DetailBabyPage";
import HistoryProgressPage from "@app/nurse/HistoryProgressPage";
import AddProgressPage from "@app/nurse/AddProgressPage";

const NurseStack = createNativeStackNavigator<NurseStackParamList>();

const NurseRouter: React.FC<{}> = () => {
  const { mother, baby } = useSelector((state: RootStateV2) => state.pmkCare);
  return (
    <NurseStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: color.surface, flex: 1 },
        animation: "none",
      }}
    >
      {Object.keys(mother).length ? (
        <>
          <NurseStack.Screen
            name="mother-detail"
            component={MotherDetailPage}
            options={{
              title: "Profil Pasien",
              animation: "slide_from_right",
            }}
          />
          {Object.keys(baby).length > 0 && (
            <>
              <NurseStack.Screen
                name="baby-detail"
                component={DetailBabyPage}
                options={{
                  title: "Profil Bayi",
                  animationTypeForReplace: "pop",
                  animation: "slide_from_right",
                }}
              />
              <NurseStack.Screen
                name="history-progress"
                component={HistoryProgressPage}
                options={{
                  title: "Progres Bayi",
                  animationTypeForReplace: "pop",
                  animation: "slide_from_right",
                }}
              />
              <NurseStack.Screen
                name="add-progress"
                component={AddProgressPage}
                options={{
                  title: "Tambah Progress Bayi",
                  animation: "slide_from_right",
                }}
              />
            </>
          )}
        </>
      ) : (
        <NurseStack.Screen
          name="profile"
          component={ProfilePage}
          options={{
            title: "Perawatan Metode Kangguru",
            animationTypeForReplace: "pop",
            animation: "slide_from_right",
          }}
        />
      )}
    </NurseStack.Navigator>
  );
};

export default NurseRouter;
