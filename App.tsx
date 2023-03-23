import React, { useCallback, useEffect } from "react";

import { useFonts } from "expo-font";
import { customFont } from "./src/lib/ui/font";

import * as SplashScreen from "expo-splash-screen";
import BaseContainer from "./src/common/BaseContainer";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@redux/store";

import RootRouter from "src/router";



const App: React.FC<{}> = () => {
  // load fonts
  const [isAppReady] = useFonts(customFont);

  // prepare splash screen
  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isAppReady) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  if (!isAppReady) {
    return null;
  }

  // load userState
  const { user: userState } = store.getState().authentication;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BaseContainer>
          <RootRouter
            onLayoutRootView={onLayoutRootView}
          />
        </BaseContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
