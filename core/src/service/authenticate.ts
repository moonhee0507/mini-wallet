import Core from "..";
import { type Env } from "../adapter/api/constants";

export default class AuthenticateService {
  constructor(
    private env: Env,
    private fetch: Core["fetch"],
  ) {}

  sendVerificationCode(
    apiData: { email: string; purpose: "SIGN_UP" | "RESET_PASSWORD"; captchaToken: string },
  ) {
    return this.fetch('sendVerificationCode', apiData);
  }
}