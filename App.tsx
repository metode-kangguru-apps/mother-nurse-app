import React, { useCallback, useEffect } from 'react'

import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useFonts } from 'expo-font'
import { customFont } from './src/lib/ui/font';

import * as SplashScreen from 'expo-splash-screen';
import BaseContainer from './src/common/BaseContainer';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '@redux/store';

import AuthRouter from 'src/router/auth'
import { RootStackParamList } from 'src/router/types';
import linking from 'src/router/path';
import MotherRouter from 'src/router/mother';


const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC<{}> = () => {

  const [isAppReady] = useFonts(customFont)

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isAppReady) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      await SplashScreen.hideAsync();
    }
  }, [isAppReady]);

  if (!isAppReady) {
    return null;
  }


  return (
    <NavigationContainer linking={linking} onReady={onLayoutRootView}>
      <BaseContainer>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: 'white', flex: 1 },
                animation: 'none'
              }}
            >
              <Stack.Screen name='auth' component={AuthRouter} />
              <Stack.Screen name='mother' component={MotherRouter}/>
            </Stack.Navigator>
          </PersistGate>
        </Provider>
      </BaseContainer>
    </NavigationContainer>
  );
}

export default App
