"use client";

import HCaptchaImport from "@hcaptcha/react-hcaptcha";
import { type ComponentClass, useRef } from "react";

type CaptchaProps = {
  sitekey: string;
  onVerify?: (token: string, ekey: string) => void;
  onExpire?: () => void;
  onError?: (error: string) => void;
};

const HCaptcha = HCaptchaImport as unknown as ComponentClass<CaptchaProps>;

const SITEKEY = "10000000-ffff-ffff-ffff-000000000001";

type CaptchaModalProps = {
  onSuccess: ({ captchaToken }: { captchaToken: string }) => void;
  onFailure: () => void;
};

export function CaptchaModal({
  onSuccess,
  onFailure,
}: CaptchaModalProps) {
  const captchaRef = useRef(null);
  return (
    <dialog open className="modal modal-open">
      <div className="modal-box w-fit">
        <HCaptcha
          ref={captchaRef}
          sitekey={SITEKEY}
          onVerify={(token) => {
            console.log("🚀 onVerify token", token);
            onSuccess({ captchaToken: token });
          }}
          onExpire={() => {
            onFailure();
          }}
          onError={() => {
            onFailure();
          }}
        />
      </div>
    </dialog>
  );
}