import { sendVerificationCode } from "./sendVerificationCode";

export const authApi = {
  sendVerificationCode,
};

export type AuthApiKey = keyof typeof authApi;