"use client";

import { type LucideProps, ChevronLeftIcon } from "lucide-react";
import { type ComponentType, type ReactNode, createElement } from "react";

const BackIcon = (props: LucideProps) =>
  createElement(ChevronLeftIcon as unknown as ComponentType<LucideProps>, props);

type ContainerProps = {
  children: ReactNode;
  header?: HeaderProps;
  buttons?: KeyboardAvoidingButton[];
};

type HeaderProps = {
  title?: string;
  isBack?: boolean;
  onBack?: () => void;
  rightContent?: ReactNode;
};

interface KeyboardAvoidingButton {
  key?: string | number;
  text: string;
  onClick: () => void;
  disabled?: boolean;
}

export const Container = ({ children, header, buttons }: ContainerProps) => {
  return (
    <div className="relative h-full flex flex-col">
      {header && (
        <div className="flex items-center justify-between p-4 border-b border-gray-100 shrink-0">
          <div className="flex justify-start">
            {header.isBack && (
              <button
                onClick={header.onBack}
                aria-label="Go back"
                className="btn bg-transparent"
              >
                <BackIcon className="text-foreground size-6" />
              </button>
            )}
          </div>
        </div>
      )}
      <div className="h-full p-4">
        {children}
      </div>
      {buttons && (
        <div className="absolute bottom-0 left-0 w-full z-10 flex justify-around gap-2 p-4">
          {buttons.map((button) => (
            <button key={button.text} onClick={button.onClick} className="btn btn-lg btn-primary w-full" disabled={button.disabled}>{button.text}</button>
          ))}
        </div>
      )}
    </div>
  )
};