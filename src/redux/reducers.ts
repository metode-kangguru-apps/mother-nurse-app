import { AnyAction, combineReducers, Reducer } from "redux";
import { persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

import globalReducer from "./actions/global";
import hospitalReducer from "./actions/hospital";
import authenticationReducer from "./actions/authentication";
import authenticationV2Reducer  from "./actions/authenticationV2";
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
  hospital: hospitalReducer,
  authentication: persistReducer(
    authenticationPersistConfig,
    authenticationReducer
  ),
  authenticationV2: authenticationV2Reducer,
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
