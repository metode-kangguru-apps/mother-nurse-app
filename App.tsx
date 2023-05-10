import React, { useEffect, useRef, useState } from "react";

import { customFont } from "./src/lib/ui/font";

import * as SplashScreen from "expo-splash-screen";
import BaseContainer from "./src/common/BaseContainer";
import SplashScreenApp from "src/common/SplashScreen";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@redux/store";

import RootRouter from "src/router";
import { cacheImages, cacheFonts } from "src/lib/utils/cacheAssets";
import { localImages } from "src/lib/ui/images";
import {
  getMotherData,
  getNurseData,
} from "@redux/actions/authentication/thunks";
import { Animated, StyleSheet } from "react-native";
import { color } from "src/lib/ui/color";

const App: React.FC<{}> = () => {
  const [appIsReady, setAppIsReady] = useState<boolean>(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();
        const fontAssets = cacheFonts([...customFont]);
        const imageAssets = cacheImages(localImages);
        const authentication = store.getState().authentication;
        const getUserData = async () => {
          if (authentication?.user?.userType === "member") {
            if (authentication?.user?.userRole === "mother") {
              return await store.dispatch(
                getMotherData(authentication.user.uid)
              );
            } else if (authentication?.user?.userRole === "nurse") {
              return await store.dispatch(
                getNurseData(authentication.user.uid)
              );
            }
          }
        };
        getUserData().then(async () => {
          await Promise.all([...imageAssets, fontAssets]).then(() => {
            setTimeout(async () => {
              setAppIsReady(true);
              await SplashScreen.hideAsync().then(() => {
                Animated.timing(fadeAnim, {
                  toValue: 0,
                  delay: 100,
                  duration: 450, // Durasi animasi dalam milidetik
                  useNativeDriver: true,
                }).start();
              });
            }, 1500);
          });
        });
      } catch (e) {
        // You might want to provide this error information to an error reporting service
        console.warn(e);
      }
    }
    loadResourcesAndDataAsync();
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BaseContainer>
        {!appIsReady ? (
          <SplashScreenApp />
        ) : (
          <>
            <Animated.View
              pointerEvents={"none"}
              style={[styles.container, { opacity: fadeAnim }]}
            ></Animated.View>
            <RootRouter />
          </>
            )}
        </BaseContainer>
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1,
    width: "100%",
    height: "100%",
    position: "absolute",
    backgroundColor: color.primary,
  },
});

export default App;
