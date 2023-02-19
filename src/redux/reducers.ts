import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import AsyncStorage from '@react-native-async-storage/async-storage';

import notesReducer from "./actions/notes"
import userReducer from "./actions/user"

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



const rootReducer = combineReducers({
  notes: persistReducer(notesPersistConfig, notesReducer),
  user: persistReducer(userPersistConfig, userReducer),
});

export default rootReducer;