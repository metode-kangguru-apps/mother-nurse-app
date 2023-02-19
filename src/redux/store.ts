
import thunk from 'redux-thunk'
import rootReducer from './reducers'
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage';

const middleware = [thunk];

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  middleware: [...middleware],
  devTools: process.env.NODE_ENV !== 'production',
})

const persistor = persistStore(store)

export {
    store,
    persistor
}