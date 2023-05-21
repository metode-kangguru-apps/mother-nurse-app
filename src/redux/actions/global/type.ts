import { Baby, Mother } from "../authentication/types";

export type GlobalState = {
  loading: boolean;
  selectedTerapiBaby: Baby | undefined;
  selectedMotherDetail: Mother | undefined;
  hospitalList: Hostpital[]
  error: boolean;
};

export type Hostpital = {
    key: string,
    value: string
}
