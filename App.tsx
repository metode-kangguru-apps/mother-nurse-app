import React, { useEffect, useRef, useState } from "react";
import { Animated, Platform, StyleSheet } from "react-native";

import { Provider } from "react-redux";
import { persistor, store } from "@redux/store";
import { PersistGate } from "redux-persist/integration/react";

import * as SplashScreen from "expo-splash-screen";

import BaseContainer from "./src/common/BaseContainer";
import SplashScreenApp from "src/common/SplashScreen";

import RootRouter from "src/router";
import { color } from "src/lib/ui/color";
import { customFont } from "./src/lib/ui/font";
import { localImages } from "src/lib/ui/images";
import { cacheImages, cacheFonts } from "src/lib/utils/cacheAssets";

import {
  getMotherData,
  getNurseData,
} from "@redux/actions/authentication/thunks";
import { UserInitialState } from "@redux/actions/authentication/types";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Subscription } from "expo-modules-core";
import { storeMessagingDeviceToken } from "@redux/actions/authentication";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    storeMessagingDeviceToken(token)
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

const App: React.FC<{}> = () => {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] =
    useState<Notifications.Notification>();
  const notificationListener = useRef<Subscription>(null);
  const responseListener = useRef<Subscription>(null);

  const [appIsReady, setAppIsReady] = useState<boolean>(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const getUserData = async (authentication: UserInitialState) => {
    if (authentication.user) {
      if (authentication.user.userType === "member") {
        if (authentication.user.userRole === "mother") {
          return await store.dispatch(getMotherData(authentication.user.uid));
        } else if (authentication.user.userRole === "nurse") {
          return await store.dispatch(getNurseData(authentication.user.uid));
        }
      }
    }
  };

  useEffect(() => {
    if (Platform.OS === "web") return;
    registerForPushNotificationsAsync().then(
      (token) => token && setExpoPushToken(token)
    );

    // @ts-ignore
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // @ts-ignore
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();
        const fontAssets = cacheFonts([...customFont]);
        const imageAssets = cacheImages(localImages);
        const authentication = store.getState()
          .authentication as UserInitialState;
        await getUserData(authentication).then(async () => {
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
