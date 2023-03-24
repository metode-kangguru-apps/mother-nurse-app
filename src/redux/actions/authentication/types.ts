export type User = {
  displayName?: string;
  uid?: string;
  isAnonymous: boolean;
  userType: "guest" | "member";
  userRole?: "mother" | "nurse";
};

export type BabyCollection = {
  babyID: string
  babyObj: Baby
};

export type Mother = {
  id?: string;
  phoneNumber?: string;
  babyRoomCode?: string;
  babyCollection: BabyCollection[] | Baby[] | undefined;
};

export type Baby = {
  id?: string;
  displayName?: string;
  gestationAge?: string;
  birthDate?: string;
  weight?: number;
  length?: number;
  gender?: "laki-laki" | "perempuan" | string;
};

export type Nurse = {};

export type Authetication = {
  user: User | undefined;
  mother: Mother | undefined;
  nurse: Nurse | undefined;
  loading?: boolean;
  error?: boolean;
};
