import { ReactElement } from "react";
import { MotherStackParamList } from "src/router/types";

export interface MenuItem {
  icon: ReactElement;
  title: string;
  navigationIdentifier: "profile" | "history" | "add-progress" | "module";
}

export type Stones = {
  first: number;
  second: number;
  third: number;
  fourth: number;
  fifth: number;
};
