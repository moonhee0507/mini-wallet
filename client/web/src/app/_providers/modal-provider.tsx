// ui/modal/ModalContext.tsx

import React, { createContext, useContext } from "react";
import { type ModalKey } from "shared/ui/modal/modalKeys";
import { useState } from "react";
import { modalRegistry } from "shared/ui/modal/modalRegistry";

type ModalRegistry = typeof modalRegistry;
type ModalPropsMap = {
  [K in ModalKey]: React.ComponentProps<ModalRegistry[K]>;
};

type ModalContextValue = {
  openModal: <K extends ModalKey>(
    key: K,
    props: ModalPropsMap[K]
  ) => void;
  closeModal: () => void;
};

const ModalContext =
  createContext<ModalContextValue | null>(null);

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("ModalProvider missing");
  }
  return ctx;
}

export function ModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [modal, setModal] = useState<{
    key: ModalKey;
    props?: ModalPropsMap[ModalKey];
  } | null>(null);

  const openModal = <K extends ModalKey>(key: K, props: ModalPropsMap[K]) => {
    setModal({ key, props });
  };

  const closeModal = () => {
    setModal(null);
  };

  const ModalComponent = modal
    ? modalRegistry[modal.key]
    : null;

  return (
    <ModalContext.Provider
      value={{ openModal, closeModal }}
    >
      {children}

      {ModalComponent && modal && (
        <ModalComponent {...(modal.props as ModalPropsMap[typeof modal.key])} />
      )}
    </ModalContext.Provider>
  );
}