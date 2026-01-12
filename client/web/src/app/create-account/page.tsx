"use client";

import { useCore } from "app/_providers";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Container, VerificationCodeInput } from "shared/ui";
import { useModal } from "app/_providers/modal-provider";
import { EMAIL_REGEX } from "shared/lib/regex";


type Step = "EMAIL" | "VERIFICATION_CODE";

export default function Page() {
  const router = useRouter();
  const core = useCore();

  const { openModal, closeModal } = useModal();

  const [step, setStep] = useState<Step>("EMAIL");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleEmailNext = () => {
    if (!email || !EMAIL_REGEX.test(email)) {
      setErrorMessage("Please enter a valid email address");
      return;
    }

    setLoading(true);

    // 인증 코드 전송 요청
    core.controller.authenticate.sendVerificationCode({
      email,
      purpose: "SIGN_UP",
      withCaptcha: ({ success, failure }) => {
        // captcha UI
        openModal("CAPTCHA", {
          onVerify: ({ captchaToken }) => {
            console.log('openModal에 전달된 props', captchaToken);
            closeModal();
            success({ captchaToken });
          },
          onExpire: () => {
            closeModal();
            failure({
              code: "CAPTCHA_EXPIRED",
              message: "Captcha verification failed",
            })
          },
          onError: (error: string) => {
            closeModal();
            failure({
              code: "CAPTCHA_ERROR",
              message: error,
            })
          },
        })
      },
      onSuccess: (resData: { expiresIn: number; cooldown: number }) => {
        setStep("VERIFICATION_CODE");
        // setExpiresIn(resData.expiresIn);
        // setCooldown(resData.cooldown);
      },
      onFailure: (error: { code: string; message: string }) => {
        setErrorMessage(error.message);
      },
      onFinally: () => {
        setLoading(false);
      },
    });
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrorMessage(null);
  }

  const handleVerificationCodeChange = (value: string) => {
    setVerificationCode(value);
    setErrorMessage(null);
  }

  const handleSubmit = async () => {};
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step === "EMAIL") {
      handleEmailNext();
      return;
    }
    handleSubmit();
  };
  
  return (
    <Container
      header={{ 
        isBack: true,
        onBack: () => { router.back(); },
      }}
      buttons={[
        {
          text: step === "EMAIL" ? "Next" : "Submit",
          onClick: step === "EMAIL" ? handleEmailNext : handleSubmit,
          disabled: loading,
        },
      ]}
    >
      <form onSubmit={handleFormSubmit}>
        <div className="pt-16">
          {step === "EMAIL" && (
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-3xl font-bold">Email</legend>
              <p className="text-sm">You'll use this to sign in and recover your account.</p>
              <input
                type="email"
                className="input input-xl w-full"
                value={email}
                onChange={handleEmailChange}
              />
              {errorMessage && <p className="text-error text-sm">{errorMessage}</p>}
            </fieldset>
          )}

          {step === "VERIFICATION_CODE" && (
            <fieldset className="fieldset">
              <legend className="fieldset-legend text-3xl font-bold">Let's confirm it's you</legend>
              <p className="text-sm">Enter the 6-digit code sent to your email</p>
              <VerificationCodeInput
                maxLength={6}
                value={verificationCode}
                onChange={handleVerificationCodeChange}
                onComplete={() => {
                  console.log("otp complete");
                }}
              />
            </fieldset>
          )}
        </div>
      </form>
    </Container>
  );
}