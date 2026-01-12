import { Injectable } from '@nestjs/common';

type VerificationPurpose = 'SIGN_UP' | 'RESET_PASSWORD';

type SendVerificationCodeResponse = {
  result: boolean;
  data?: {
    expiresIn: number;
    cooldown: number;
  };
  error?: {
    code: string;
    message: string;
  };
};

@Injectable()
export class AuthService {
  private readonly expiresInSeconds = 300;
  private readonly cooldownSeconds = 60;
  private readonly cooldownTracker = new Map<string, number>();

  sendVerificationCode(
    email: string | undefined,
    purpose: VerificationPurpose | undefined,
    captchaToken: string | undefined,
  ): SendVerificationCodeResponse {
    if (!captchaToken) {
      return {
        result: false,
        error: {
          code: 'CAPTCHA_REQUIRED',
          message: 'X-Captcha-Token header is missing.',
        },
      };
    }

    if (!email || !this.isValidPurpose(purpose)) {
      return {
        result: false,
        error: {
          code: 'INVALID_REQUEST',
          message: 'email 또는 purpose 값이 올바르지 않습니다.',
        },
      };
    }

    const now = Date.now();
    const nextAvailableAt = this.cooldownTracker.get(email);

    if (nextAvailableAt && nextAvailableAt > now) {
      const remainingSeconds = Math.ceil((nextAvailableAt - now) / 1000);

      return {
        result: false,
        error: {
          code: 'COOLDOWN',
          message: `다음 요청까지 ${remainingSeconds}초 후에 다시 시도해주세요.`,
        },
      };
    }

    this.cooldownTracker.set(email, now + this.cooldownSeconds * 1000);

    return {
      result: true,
      data: {
        expiresIn: this.expiresInSeconds,
        cooldown: this.cooldownSeconds,
      },
    };
  }

  private isValidPurpose(value: unknown): value is VerificationPurpose {
    return value === 'SIGN_UP' || value === 'RESET_PASSWORD';
  }
}

