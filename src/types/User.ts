export interface User{
   email: string;
   password: string;
   role: UserEnum;
}

export type UserEnum = "ADMIN" | "USER";