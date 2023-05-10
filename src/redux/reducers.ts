import { AnyAction, combineReducers, Reducer } from "redux";
import { persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

import globalReducer from "./actions/global";
import authenticationReducer from "./actions/authentication";
import babyReducer from "./actions/baby";
import { RootState } from "./types";
import { persistor } from "./store";

const authenticationPersistConfig = {
  key: "authentication",
  storage: AsyncStorage,
  whitelist: ["mother", "nurse", "user"],
};

const appReducer = combineReducers({
  global: globalReducer,
  authentication: persistReducer(
    authenticationPersistConfig,
    authenticationReducer
  ),
  baby: babyReducer,
});

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
  if (action.type === "CLEAR_SESSION") {
    const initialState = {} as RootState;
    return appReducer(initialState, action);
  }
  return appReducer(state, action);
};

export default rootReducer;
