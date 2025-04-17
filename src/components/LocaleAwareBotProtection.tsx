"use client";

import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

// Dinamik olarak ReCAPTCHA'yı import et
const ReCAPTCHA = dynamic(() => import('react-google-recaptcha'), {
  ssr: false,
  loading: () => <div>Loading...</div>
});

// Translations for different languages
const translations = {
  en: {
    welcome: "Welcome",
    description: "Please complete the verification process to access our site.",
    question: "What is the capital of France?",
    answerPlaceholder: "Enter your answer here",
    verifyButton: "Verify and Continue",
    validation: {
      answerRequired: "Please answer the question",
      answerIncorrect: "Incorrect answer. The capital of France is Paris.",
      recaptchaRequired: "Please complete the reCAPTCHA verification"
    }
  },
  tr: {
    welcome: "Hoş Geldiniz",
    description: "Sitemize erişmek için lütfen doğrulama işlemini yapınız.",
    question: "Fransa'nın başkenti neresidir?",
    answerPlaceholder: "Cevabınızı buraya yazın",
    verifyButton: "Doğrula ve Devam Et",
    validation: {
      answerRequired: "Lütfen soruyu cevaplayınız",
      answerIncorrect: "Yanlış cevap. Fransa'nın başkenti Paris'tir.",
      recaptchaRequired: "Lütfen reCAPTCHA doğrulamasını tamamlayınız"
    }
  },
  fr: {
    welcome: "Bienvenue",
    description: "Veuillez compléter le processus de vérification pour accéder à notre site.",
    question: "Quelle est la capitale de la France ?",
    answerPlaceholder: "Entrez votre réponse ici",
    verifyButton: "Vérifier et Continuer",
    validation: {
      answerRequired: "Veuillez répondre à la question",
      answerIncorrect: "Réponse incorrecte. La capitale de la France est Paris.",
      recaptchaRequired: "Veuillez compléter la vérification reCAPTCHA"
    }
  }
};

// Validation schema
const formSchema = yup.object().shape({
  // answer: yup.string()
  //   .required("answerRequired")
  //   .test(
  //     "is-correct-answer",
  //     "answerIncorrect",
  //     (value) => value?.toLowerCase() === "paris"
  //   ),
  recaptchaToken: yup.string().required("recaptchaRequired"),
});

type FormData = {
  // answer: string;
  recaptchaToken: string;
};

export function LocaleAwareBotProtection() {
  const [showModal, setShowModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  
  // URL'den locale bilgisini almayı dene
  let urlLocale = "tr";
  if (pathname.startsWith("/en")) {
    urlLocale = "en";
  } else if (pathname.startsWith("/fr")) {
    urlLocale = "fr";
  }
  
  // Get translations for the current locale
  const t = translations[urlLocale as keyof typeof translations] || translations.en;
  
  console.log("LocaleAwareBotProtection - Current locale from useLocale:", locale);
  console.log("LocaleAwareBotProtection - Current locale from URL:", urlLocale);
  console.log("LocaleAwareBotProtection - Current pathname:", pathname);

  const { 
    handleSubmit, 
    setValue, 
    formState: { errors, isValid }
  } = useForm<FormData>({
    resolver: yupResolver(formSchema),
    defaultValues: {
      // answer: "",
      recaptchaToken: "",
    },
    mode: "onChange"
  });

  useEffect(() => {
    setIsClient(true);
    console.log('LocaleAwareBotProtection - isClient:', true);
    console.log('LocaleAwareBotProtection - siteKey:', process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY);
  }, []);

  useEffect(() => {
    // Check if user is already verified and verification hasn't expired
    const verificationData = localStorage.getItem(`isUserVerified_${urlLocale}`);
    if (verificationData) {
      const { timestamp } = JSON.parse(verificationData);
      const now = new Date().getTime();
      const verificationExpiry = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      
      if (now - timestamp < verificationExpiry) {
        setIsVerified(true);
        setShowModal(false);
        return;
      }
    }
    
    // If not verified or verification expired, show modal
    setIsVerified(false);
    setShowModal(true);
    
    console.log("LocaleAwareBotProtection - Showing verification modal for:", urlLocale);
  }, [urlLocale]);

  const onSubmit = () => {
    setIsVerified(true);
    setShowModal(false);
    // Store verification with timestamp
    localStorage.setItem(`isUserVerified_${urlLocale}`, JSON.stringify({
      verified: true,
      timestamp: new Date().getTime()
    }));
    console.log("LocaleAwareBotProtection - User verified for locale:", urlLocale);
  };

  const onRecaptchaChange = (token: string | null) => {
    setValue("recaptchaToken", token || "", { shouldValidate: true });
  };

  if (!showModal || isVerified) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 overflow-y-auto overflow-x-hidden">
      <div className="relative p-4 w-full max-w-md max-h-full">
        {/* Modal content */}
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t.welcome}
            </h3>
          </div>
          
          {/* Modal body */}
          <div className="p-4 md:p-5 space-y-4">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              {t.description}
            </p>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {t.question}
                </label>
                <input
                  type="text"
                  {...register("answer")}
                  className="w-full p-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  placeholder={t.answerPlaceholder}
                />
                {errors.answer && (
                  <p className="mt-1 text-sm text-red-500">
                    {t.validation[errors.answer.message as keyof typeof t.validation]}
                  </p>
                )}
              </div> */}
              
              <div className="mb-6">
                {isClient && (
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                    onChange={onRecaptchaChange}
                  />
                )}
                {errors.recaptchaToken && (
                  <p className="mt-1 text-sm text-red-500">
                    {t.validation[errors.recaptchaToken.message as keyof typeof t.validation]}
                  </p>
                )}
              </div>
              
              {/* Modal footer */}
              <div className="flex items-center pt-4 border-t border-gray-200 rounded-b dark:border-gray-600">
                <button
                  type="submit"
                  disabled={!isValid}
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t.verifyButton}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 