import { Dispatch } from "react";
import { AnyAction, Store } from "redux";
import { ThunkDispatch, ThunkAction } from "redux-thunk";
import { store } from "./store";

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = ThunkDispatch<RootState, undefined, AnyAction> &
  Dispatch<AnyAction>;

export type AppStore = Store<any> & {
    dispatch: AppDispatch
  }

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;

export enum FirebaseCollection {
  USER = "users",
  MOTHER = "mothers",
  NURSE = "nurses",
  BABIES = "babies",
  HOSPITAL = "hospitals",
  PROGRESS = "progress",
  SESSION = "sessions"
}
