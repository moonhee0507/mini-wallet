"use client";

import * as React from "react";
import Core, { type Env } from "mini-wallet-core";
import { ModalProvider } from "./modal-provider";

const CoreContext = React.createContext<Core | null>(null);

export const useCore = () => {
  const core = React.useContext(CoreContext);
  if (!core) {
    throw new Error("CoreProvider가 감싸고 있지 않습니다.");
  }
  return core;
};

function CoreProvider({ children }: { children: React.ReactNode }) {
  const env = (process.env.NEXT_PUBLIC_ENV as Env | undefined) ?? "dev";
  const core = React.useMemo(() => new Core(env), [env]);

  return <CoreContext.Provider value={core}>{children}</CoreContext.Provider>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CoreProvider>
      <ModalProvider>
        {children}
      </ModalProvider>
    </CoreProvider>
  );
}