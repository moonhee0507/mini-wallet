import React, { useRef, useState, useEffect, useMemo } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Size = "xs" | "sm" | "md" | "lg";
type Color = "primary" | "secondary" | "accent" | "info" | "success" | "warning" | "error";

interface VerificationCodeInputProps {
  maxLength?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  size?: Size;
  color?: Color;
  isInvalid?: boolean;
  disabled?: boolean;
  className?: string;
}

const sizeClasses: Record<Size, string> = {
  xs: "w-8 h-8 text-xs p-0",
  sm: "w-10 h-10 text-sm p-0",
  md: "w-12 h-12 text-base p-0",
  lg: "w-14 h-14 text-lg p-0",
};

export const VerificationCodeInput = ({
  maxLength = 6,
  value = "",
  onChange,
  onComplete,
  size = "lg",
  color = "primary",
  isInvalid = false,
  disabled = false,
  className,
}: VerificationCodeInputProps) => {
  // 내부 상태 관리 (value prop이 없으면 내부 state 사용)
  const [internalValue, setInternalValue] = useState(new Array(maxLength).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 부모로부터 value가 들어오면 동기화
  useEffect(() => {
    if (typeof value === "string") {
      const newArr = new Array(maxLength).fill("");
      const chars = value.split("").slice(0, maxLength);
      chars.forEach((c, i) => (newArr[i] = c));
      setInternalValue(newArr);
    }
  }, [value, maxLength]);

  // 값 변경 알림
  const triggerChange = (newOtp: string[]) => {
    const otpString = newOtp.join("");
    setInternalValue(newOtp);
    onChange?.(otpString);
    if (otpString.length === maxLength) {
      onComplete?.(otpString);
    }
  };

  // 입력 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    
    // 숫자만 허용 (필요 시 정규식 제거 가능)
    if (isNaN(Number(val))) return;

    const newOtp = [...internalValue];
    // 마지막 입력된 글자만 취함 (모바일 등에서 중복 입력 방지)
    newOtp[index] = val.substring(val.length - 1);
    
    triggerChange(newOtp);

    // 다음 칸으로 포커스 이동
    if (val && index < maxLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // 키보드 조작 (Backspace, Arrow keys)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!internalValue[index] && index > 0) {
        // 현재 칸이 비어있으면 이전 칸으로 이동 후 삭제
        const newOtp = [...internalValue];
        newOtp[index - 1] = "";
        triggerChange(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        // 현재 칸 내용 삭제
        const newOtp = [...internalValue];
        newOtp[index] = "";
        triggerChange(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < maxLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // 붙여넣기 핸들러
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, maxLength).split("");
    
    // 숫자만 필터링 (선택 사항)
    if (pastedData.some((char) => isNaN(Number(char)))) return;

    const newOtp = [...internalValue];
    pastedData.forEach((char, index) => {
      newOtp[index] = char;
    });

    triggerChange(newOtp);

    // 입력된 마지막 위치로 포커스
    const focusIndex = Math.min(pastedData.length, maxLength - 1);
    inputRefs.current[focusIndex]?.focus();
  };

  // DaisyUI 클래스 결정
  const inputClass = useMemo(() => {
    const base = "input input-bordered text-center placeholder:text-base-content/30 focus:outline-none transition-all";
    const colorClass = isInvalid ? "input-error focus:border-error focus:ring-1 focus:ring-error" : `focus:input-${color} focus:ring-1 focus:ring-${color}`;
    
    return cn(base, sizeClasses[size], colorClass);
  }, [size, color, isInvalid]);

  return (
    <div className={cn("flex items-center justify-around gap-2", className)}>
      {Array.from({ length: maxLength }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el) as any}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={internalValue[index]}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          disabled={disabled}
          className={inputClass}
        />
      ))}
    </div>
  );
};