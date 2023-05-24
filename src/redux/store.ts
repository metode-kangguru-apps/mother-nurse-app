import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { configureStore } from "@reduxjs/toolkit";
import { persistStore } from "redux-persist";
import { AppStore } from "./types";

const middleware = [thunk];

const store: AppStore = configureStore({
  reducer: rootReducer,
  middleware: [...middleware],
  devTools: process.env.NODE_ENV !== "production",
});

const persistor = persistStore(store);

export { store, persistor };
