"use client";

import { useForm, UseFormSetValue, FieldErrors } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useFormTranslations } from "../../bilgi-alma-formu/languageInfo";
import ReCAPTCHA from "react-google-recaptcha";
import { createPortal } from "react-dom";

// Form Validasyonu (sadece gerekli alanlar)
const formSchema = yup.object().shape({
  fullName: yup.string().min(3, "İsim soyisim en az 3 karakter olmalı").required("İsim soyisim zorunludur"),
  phone: yup.string().min(10, "Geçerli bir telefon numarası girin").required("Telefon numarası zorunludur"),
  email: yup.string().email("Geçerli bir email adresi girin").required("Email zorunludur"),
  service: yup.string().required("Hizmet seçimi zorunludur"),
});

type FormData = {
  fullName: string;
  phone: string;
  email: string;
  service: string;
};

// Telefon Girişi Bileşeni
const PhoneInputField = ({ setValue, errors }: { setValue: UseFormSetValue<FormData>; errors: FieldErrors<FormData> }) => {
  const { theme } = useTheme();

  const [inputStyle, setInputStyle] = useState({});

  useEffect(() => {
    setInputStyle(
      theme === "dark"
        ? {
            backgroundColor: "#1F2937",
            color: "#F3F4F6",
            border: "1px solid #374151",
          }
        : {
            backgroundColor: "#FFFFFF",
            color: "#000000",
            border: "1px solid #D1D5DB",
          }
    );
  }, [theme]);

  return (
    <div className="w-full">
      <PhoneInput
        country={"tr"}
        onChange={(value) => setValue("phone", value)}
        inputStyle={{ 
          width: "100%", 
          height: "44px",
          ...inputStyle 
        }}
        containerClass="w-full"
        inputClass="!h-11 !border-gray-300 dark:!border-gray-600"
      />
      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
    </div>
  );
};

const BannerInfoForm = () => {
  const [selectedService, setSelectedService] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showRecaptchaModal, setShowRecaptchaModal] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [formDataToSubmit, setFormDataToSubmit] = useState<FormData | null>(null);
  const [mounted, setMounted] = useState(false);
  const translations = useFormTranslations();

  useEffect(() => {
    setMounted(true);
  }, []);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting }, watch } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      service: "",
    },
  });

  const formValues = watch();
  const isFormValid = formValues.fullName && formValues.phone && formValues.email && formValues.service;

  const sendEmail = async (data: FormData, token: string | null = null) => {
    try {
      // İsim soyisimi ayır
      const nameParts = data.fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      const res = await axios.post(
        "/api/send-email",
        {
          firstName,
          lastName,
          phone: data.phone,
          email: data.email,
          service: data.service,
          recaptchaToken: token,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      
      if (res.status === 200) {
        setToastMessage("✅ Bilgileriniz başarıyla gönderildi.");
        // Formu temizle
        setValue("fullName", "");
        setValue("phone", "");
        setValue("email", "");
        setValue("service", "");
        setSelectedService("");
        setRecaptchaToken(null);
        setShowRecaptchaModal(false);
        setTimeout(() => setToastMessage(null), 3000);
      } else {
        throw new Error();
      }
    } catch {
      setToastMessage("❌ Gönderilirken bir hata oluştu.");
      setShowRecaptchaModal(false);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleFormSubmit = (data: FormData) => {
    // Form doğrulandı, reCAPTCHA modal'ını aç
    setFormDataToSubmit(data);
    setShowRecaptchaModal(true);
  };

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const handleVerifyAndSubmit = () => {
    if (recaptchaToken && formDataToSubmit) {
      sendEmail(formDataToSubmit, recaptchaToken);
    }
  };

  const handleCloseModal = () => {
    setShowRecaptchaModal(false);
    setRecaptchaToken(null);
    setFormDataToSubmit(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <form 
        onSubmit={handleSubmit(handleFormSubmit)} 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700"
      >
        {/* Yatay Form (Masaüstü) - Dikey Form (Mobil) */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-end">
          {/* İsim Soyisim */}
          <div className="flex-1 w-full sm:w-auto min-w-0">
            <Input
              {...register("fullName")}
              placeholder="İsim Soyisim"
              className="w-full h-11 border-gray-300 dark:border-gray-600"
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
            )}
          </div>

          {/* Telefon */}
          <div className="flex-1 w-full sm:w-auto min-w-0">
            <PhoneInputField setValue={setValue} errors={errors} />
          </div>

          {/* Email */}
          <div className="flex-1 w-full sm:w-auto min-w-0">
            <Input
              {...register("email")}
              type="email"
              placeholder={translations.email}
              className="w-full h-11 border-gray-300 dark:border-gray-600"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Hizmet Seçiniz */}
          <div className="flex-1 w-full sm:w-auto min-w-0">
            <Select
              onValueChange={(value) => {
                setValue("service", value);
                setSelectedService(value);
              }}
            >
              <SelectTrigger className="w-full h-11 border-gray-300 dark:border-gray-600">
                <span className="truncate">{selectedService || translations.selectService}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={translations.airplaneTransfer}>
                  {translations.airplaneTransfer}
                </SelectItem>
                <SelectItem value={translations.parisDisneyland}>
                  {translations.parisDisneyland}
                </SelectItem>
                <SelectItem value={translations.parisTravelTours}>
                  {translations.parisTravelTours}
                </SelectItem>
                <SelectItem value={translations.privateChauffeur}>
                  {translations.privateChauffeur}
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.service && (
              <p className="text-red-500 text-xs mt-1">{errors.service.message}</p>
            )}
          </div>

          {/* Gönder Butonu */}
          <Button
            type="submit"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2.5 h-11 font-medium rounded-lg transition-colors"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? "Gönderiliyor..." : translations.sendForm}
          </Button>
        </div>
      </form>

      {/* Toast Mesajı */}
      {toastMessage && (
        <div className="mt-4 p-4 bg-gray-900 text-white rounded-lg shadow-md flex items-center justify-between">
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-4 text-red-400 hover:text-red-300"
          >
            ✕
          </button>
        </div>
      )}

      {/* reCAPTCHA Modal */}
      {mounted && showRecaptchaModal && typeof window !== "undefined" && document.body && (
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 overflow-y-auto overflow-x-hidden" style={{ zIndex: 9999 }}>
            <div className="relative p-4 w-full max-w-md max-h-full">
              <div className="relative bg-white rounded-lg shadow-lg dark:bg-gray-800">
                {/* Modal header */}
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-700 border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Doğrulama
                  </h3>
                  <button
                    onClick={handleCloseModal}
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
                    Lütfen aşağıdaki reCAPTCHA&apos;yı tamamlayarak formu gönderin.
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
                      onClick={handleCloseModal}
                      className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
                    >
                      İptal
                    </button>
                    <button
                      onClick={handleVerifyAndSubmit}
                      disabled={!recaptchaToken || isSubmitting}
                      className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Gönderiliyor..." : "Formu Gönder"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      )}
    </div>
  );
};

export default BannerInfoForm;
