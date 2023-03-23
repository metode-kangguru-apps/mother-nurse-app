import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

import globalReducer from "./actions/global";
import authenticationReducer from "./actions/authentication";

const globalPersistConfig = {
  key: "global",
  storage: AsyncStorage,
};

const authenticationPersistConfig = {
  key: "authentication",
  storage: AsyncStorage,
  whitelist: ["authentication"],
};

const rootReducer = combineReducers({
  global: persistReducer(globalPersistConfig, globalReducer),
  authentication: persistReducer(
    authenticationPersistConfig,
    authenticationReducer
  ),
});

export default rootReducer;
