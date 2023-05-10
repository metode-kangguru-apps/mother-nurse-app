import React, { useCallback, useEffect, useState } from "react";

import * as Font from "expo-font";
import { customFont } from "./src/lib/ui/font";

import * as SplashScreen from "expo-splash-screen";
import BaseContainer from "./src/common/BaseContainer";

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

const App: React.FC<{}> = () => {
  const [appIsReady, setAppIsReady] = useState<boolean>(false);

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
            setAppIsReady(true);
            SplashScreen.hideAsync();
          });
        });
      } catch (e) {
        // You might want to provide this error information to an error reporting service
        console.warn(e);
      }
    }
    loadResourcesAndDataAsync();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BaseContainer>
          <RootRouter />
        </BaseContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
