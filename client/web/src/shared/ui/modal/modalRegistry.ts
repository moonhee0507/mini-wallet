import type { ComponentType } from "react";
import { type ModalKey } from "./modalKeys";
import { CaptchaModal } from "./captchaModal";


/**
 * modal을 등록하는 레지스트리
 */
export const modalRegistry = {
  CAPTCHA: CaptchaModal,
} satisfies Record<ModalKey, ComponentType<any>>;