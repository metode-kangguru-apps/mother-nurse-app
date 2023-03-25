import React, { useCallback, useEffect, useState } from "react";

import * as Font from "expo-font";
import { customFont } from "./src/lib/ui/font";

import * as SplashScreen from "expo-splash-screen";
import BaseContainer from "./src/common/BaseContainer";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@redux/store";

import RootRouter from "src/router";
import { cacheImages } from "src/lib/utils/cacheAssets";
import { localImages } from "src/lib/ui/images";

const App: React.FC<{}> = () => {
  const [appIsReady, setAppIsReady] = useState<boolean>(false);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();
        const fontAssets = Font.loadAsync(customFont);
        const imageAssets = cacheImages(localImages);

        await Promise.all([...imageAssets, fontAssets]);
      } catch (e) {
        // You might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setAppIsReady(true);
        SplashScreen.hideAsync();
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
