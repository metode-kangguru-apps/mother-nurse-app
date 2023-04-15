import { AnyAction, combineReducers, Reducer } from "redux";
import { persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

import globalReducer from "./actions/global";
import authenticationReducer from "./actions/authentication";
import { RootState } from "./types";

const globalPersistConfig = {
  key: "global",
  storage: AsyncStorage,
  whitelist: ["selectedTerapiBaby"]
};

const authenticationPersistConfig = {
  key: "authentication",
  storage: AsyncStorage,
  whitelist: ["authentication"],
};

const appReducer = combineReducers({
  global: persistReducer(globalPersistConfig, globalReducer),
  authentication: persistReducer(
    authenticationPersistConfig,
    authenticationReducer
  ),
});

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
  if (action.type === "CLEAR_SESSION") {
    const initialState = {} as RootState;
    return appReducer(initialState, action);
  }
  return appReducer(state, action);
};

export default rootReducer;
