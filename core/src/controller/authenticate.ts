import Core from "..";

type ErrorInfo = {
  code: string;
  message: string;
};

export default class AuthenticateController {
  constructor(private core: Core) {}

  public sendVerificationCode({
    email,
    purpose,
    withCaptcha,
    onSuccess,
    onFailure,
    onFinally,
  }: {
    email: string;
    purpose: "SIGN_UP" | "RESET_PASSWORD";
    withCaptcha: (handlers: {
      success: ({ captchaToken }: { captchaToken: string }) => void;
      failure: (error: ErrorInfo) => void;
    }) => void;
    onSuccess: (resData: { expiresIn: number; cooldown: number }) => void;
    onFailure: (error: ErrorInfo) => void;
    onFinally?: () => void;
  }) {
    const success = async ({ captchaToken }: { captchaToken: string }) => {
      try {
        const response = await this.core.service.authenticate.sendVerificationCode({ email, purpose, captchaToken });

        if (response?.result && response.data) {
          onSuccess(response.data);
          return;
        }

        if (response?.error) {
          onFailure(response.error);
          return;
        }

        onFailure({
          code: "UNKNOWN_ERROR",
          message: "Failed to send verification code",
        });
      } catch (error: any) {
        onFailure(
          error?.code && error?.message
            ? { code: error.code, message: error.message }
            : {
                code: "REQUEST_FAILED",
                message: error?.message ?? "Failed to send verification code",
              },
        );
      } finally {
        onFinally?.();
      }
    };

    const failure = async (error: ErrorInfo) => {
      onFailure(error);
      onFinally?.();
    };

    // captcha 래퍼
    withCaptcha({
      success,
      failure,
    });
  }
}