import { tables } from "@/config/table.ts";

export const userType = {
  OTP: "OTP",
  EMAIL: "EMAIL",
} as const;

export const matchUserTypeTable: any = {
  [userType.OTP]: tables.OTP_USERS,
  [userType.EMAIL]: tables.EMAIL_USERS,
};

export type UserType = keyof typeof userType;
