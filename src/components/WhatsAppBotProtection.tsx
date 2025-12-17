"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslations } from "next-intl";

interface WhatsAppBotProtectionProps {
  whatsappUrl: string;
  onVerified: () => void;
  onClose: () => void;
}

export function WhatsAppBotProtection({ whatsappUrl, onVerified, onClose }: WhatsAppBotProtectionProps) {
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("BotProtection");

  useEffect(() => {
    setMounted(true);
    console.log("WhatsAppBotProtection mounted");
    return () => {
      console.log("WhatsAppBotProtection unmounted");
    };
  }, []);

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const handleVerify = () => {
    if (recaptchaToken) {
      // Store verification in session storage
      sessionStorage.setItem("whatsapp_verified", "true");
      // Open WhatsApp after verification
      window.open(whatsappUrl, "_blank");
      setRecaptchaToken(null);
      onVerified();
      onClose();
    }
  };

  const handleClose = () => {
    setRecaptchaToken(null);
    onClose();
  };

  if (!mounted) {
    return null;
  }

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 overflow-y-auto overflow-x-hidden" style={{ zIndex: 9999 }}>
      <div className="relative p-4 w-full max-w-md max-h-full">
        {/* Modal content */}
        <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-800">
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-700 border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("welcome")}
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
            </button>
          </div>

          {/* Modal body */}
          <div className="p-4 md:p-5 space-y-4">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              {t("description")}
            </p>

            <div className="mb-6 flex justify-center">
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                onChange={handleRecaptchaChange}
              />
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-200 rounded-b dark:border-gray-700">
              <button
                onClick={handleClose}
                className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              >
                İptal
              </button>
              <button
                onClick={handleVerify}
                disabled={!recaptchaToken}
                className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("verifyButton")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof window !== "undefined" && document.body
    ? createPortal(modalContent, document.body)
    : null;
}
