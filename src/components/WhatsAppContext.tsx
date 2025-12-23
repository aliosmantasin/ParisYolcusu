
"use client";
import { createContext, useContext, useState, ReactNode, useCallback } from "react";

type WhatsAppWidgetContextType = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const WhatsAppWidgetContext = createContext<WhatsAppWidgetContextType | undefined>(
  undefined
);

export function WhatsAppWidgetProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return (
    <WhatsAppWidgetContext.Provider value={{ isOpen, open, close, toggle }}>
      {children}
    </WhatsAppWidgetContext.Provider>
  );
}

export function useWhatsAppWidget() {
  const ctx = useContext(WhatsAppWidgetContext);
  if (!ctx) {
    throw new Error("useWhatsAppWidget must be used within WhatsAppWidgetProvider");
  }
  return ctx;
}
