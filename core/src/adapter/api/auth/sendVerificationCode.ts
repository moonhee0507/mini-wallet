import { fetch } from "../fetch";
import { BASE_URL, type Env } from "../constants";

type SendVerificationCodeParams = {
  email: string;
  purpose: "SIGN_UP" | "RESET_PASSWORD";
  captchaToken: string;
};

type SendVerificationCodeResponse = {
  result: boolean;
  data?: {
    expiresIn: number;
    cooldown: number;
  };
  error?: {
    code: string;
    message: string;
  }
};

export function sendVerificationCode(
  env: Env,
  apiData: SendVerificationCodeParams,
) {
  return fetch<SendVerificationCodeResponse>(
    BASE_URL.auth[env],
    "/auth/send-verification-code",
    {
      method: "POST",
      body: {
        email: apiData.email,
        purpose: apiData.purpose,
      },
      headers: {
        "X-Captcha-Token": apiData.captchaToken,
      }
    }
  );
} 