import { Baby } from "../authentication/types";

export type GlobalState = {
  loading: boolean;
  selectedTerapiBaby: Baby | undefined;
  hospitalList: Hostpital[]
  error: boolean;
};

export type Hostpital = {
    key: string,
    value: string
}
