export type User = {
  displayName?: string;
  uid?: string;
  isAnonymous: boolean;
  userType: "guest" | "member";
  userRole?: "mother" | "nurse";
};

export type BabyCollection = {
  babyID: string;
  babyObj: Baby | undefined;
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
  gestationAge?: number;
  birthDate?: string;
  weight?: number;
  length?: number;
  gender?: "laki-laki" | "perempuan";
};

export type Nurse = {};

export type Authentication = {
  user: User | undefined;
  mother: Mother | undefined;
  nurse: Nurse | undefined;
  loading?: boolean;
  error?: boolean;
};
