import { AnyAction, combineReducers, Reducer } from "redux";
import { persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

import globalReducer from "./actions/global";
import authenticationReducer from "./actions/authentication";
import babyReducer from "./actions/baby";
import { RootState } from "./types";

const globalPersistConfig = {
  key: "global",
  storage: AsyncStorage,
  whitelist: ["global"],
};

const authenticationPersistConfig = {
  key: "authentication",
  storage: AsyncStorage,
  whitelist: ["authentication"],
};

const babyPersistConfig = {
  key: "baby",
  storage: AsyncStorage,
  whitelist: ["baby"],
};

const appReducer = combineReducers({
  global: persistReducer(globalPersistConfig, globalReducer),
  authentication: persistReducer(
    authenticationPersistConfig,
    authenticationReducer
  ),
  baby: persistReducer(babyPersistConfig, babyReducer),
});

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
  if (action.type === "CLEAR_SESSION") {
    const initialState = {} as RootState;
    return appReducer(initialState, action);
  }
  return appReducer(state, action);
};

export default rootReducer;
