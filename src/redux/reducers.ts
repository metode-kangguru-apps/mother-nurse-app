import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import AsyncStorage from '@react-native-async-storage/async-storage';

import notesReducer from "./actions/notes"
import userReducer from "./actions/user"
import globalReducer from "./actions/global"

const notesPersistConfig = {
  key: "notes",
  storage: AsyncStorage,
  whitelist: ["notes"],
};

const userPersistConfig = {
  key: "user",
  storage: AsyncStorage,
  whitelist: ["user"],
};

const globalPersistConfig = {
  key: "global",
  storage: AsyncStorage,
}



const rootReducer = combineReducers({
  notes: persistReducer(notesPersistConfig, notesReducer),
  user: persistReducer(userPersistConfig, userReducer),
  global: persistReducer(globalPersistConfig, globalReducer)
});

export default rootReducer;