import { AnyAction, combineReducers, Reducer } from "redux";
import { persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

import hospitalReducer from "./actions/hospital";
import authenticationV2Reducer from "./actions/authentication";
import pmkCareReducer from "./actions/pmkCare";
import { RootState } from "./types";

const authenticationPersistConfig = {
  key: "authentication",
  storage: AsyncStorage,
  whitelist: ["user"],
};

const appReducer = combineReducers({
  authentication: persistReducer(
    authenticationPersistConfig,
    authenticationV2Reducer
  ),
  hospital: hospitalReducer,
  pmkCare: pmkCareReducer,
});

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
  if (action.type === "CLEAR_SESSION") {
    const initialState = {} as RootState;
    return appReducer(initialState, action);
  }
  return appReducer(state, action);
};

export default rootReducer;
