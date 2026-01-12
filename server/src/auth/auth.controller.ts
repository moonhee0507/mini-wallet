import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

type SendVerificationCodeBody = {
  email: string;
  purpose: 'SIGN_UP' | 'RESET_PASSWORD';
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-verification-code')
  sendVerificationCode(
    @Body() body: SendVerificationCodeBody,
    @Headers('x-captcha-token') captchaToken?: string,
  ) {
    return this.authService.sendVerificationCode(body?.email, body?.purpose, captchaToken);
  }
}

