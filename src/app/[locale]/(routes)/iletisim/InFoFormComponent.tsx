/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useFormTranslations } from "./languageInfo";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { MdPhone, MdEmail, MdAccessTime } from "react-icons/md";

// ✅ Form Validasyonu
const formSchema = yup.object().shape({
  name: yup.string().min(3, "İsim en az 3 karakter olmalı").required(),
  email: yup.string().email("Geçerli bir email girin").required(),
  phone: yup.string().min(10, "Geçerli bir telefon numarası girin").optional(),
  message: yup.string().min(10, "Mesaj en az 10 karakter olmalı").required(),
  recaptchaToken: yup.string().required("Lütfen reCAPTCHA doğrulamasını yapın"),
});

// Type for form data
type FormData = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  recaptchaToken: string;
};

// 📱 Telefon Girişi Bileşeni (Tema Duyarlı)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PhoneInputField = ({ setValue, errors }: any) => {
  const { theme } = useTheme();
  const t = useTranslations("Contact");
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
    <div>
      <PhoneInput
        country={"tr"}
        onChange={(value) => setValue("phone", value)}
        inputStyle={{ width: "100%", ...inputStyle }}
      />
      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
    </div>
  );
};

const InfoForm = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const t = useTranslations("Contact");
  const locale = useLocale();

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting }, watch } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      recaptchaToken: "",
    },
  });

  // Formdaki alanları izleme
  const formValues = watch();
  const isFormValid = formValues.name && formValues.email && formValues.message && formValues.recaptchaToken;

  const sendEmail = async (data: FormData) => {
    try {
      const res = await axios.post("/api/send-email", { ...data }, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.status === 200) {
        setToastMessage(t("successMessage"));
      } else {
        throw new Error();
      }
    } catch (error) {
      setToastMessage(t("errorMessage"));
    }
  };

  return (
    <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sol Kolon - Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">{t("formTitle")}</h2>
            <div className="space-y-4 mb-6 text-gray-600 dark:text-gray-400">
              <p>{t("introText1")}</p>
              <p>{t("introText2")}</p>
              <p>{t("introText3")}</p>
            </div>
            <form onSubmit={handleSubmit(sendEmail)} id="formSubmission">
              <div className="mb-4">
                <Label>{t("nameLabel")} *</Label>
                <Input {...register("name")} />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div className="mb-4">
                <Label>{t("emailLabel")} *</Label>
                <Input {...register("email")} type="email" />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div className="mb-4">
                <Label>{t("phoneLabel")}</Label>
                <PhoneInputField setValue={setValue} errors={errors} />
              </div>

              <div className="mb-4">
                <Label>{t("messageLabel")} *</Label>
                <Textarea {...register("message")} rows={6} />
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
              </div>

              <div className="mb-4">
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                  onChange={(token) => setValue("recaptchaToken", token || "")}
                />
                {errors.recaptchaToken && <p className="text-red-500 text-sm mt-1">{errors.recaptchaToken.message}</p>}
              </div>

              <Button type="submit" className="w-full bg-[#067481] hover:bg-[#056a77] text-white" disabled={!isFormValid || isSubmitting}>
                {isSubmitting ? t("sending") : t("sendButton")}
              </Button>
            </form>

            {toastMessage && (
              <div className="flex items-center justify-between mt-4 bg-gray-900 text-white p-4 rounded shadow-md">
                <span>{toastMessage}</span>
                <button onClick={() => setToastMessage(null)} className="ml-4 text-blue-400 hover:text-blue-300">✕</button>
              </div>
            )}
          </div>

          {/* Sağ Kolon - İletişim Bilgileri */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">{t("contactTitle")}</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MdPhone className="w-6 h-6 text-[#067481] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">{t("phone")}</p>
                  <p className="text-gray-600 dark:text-gray-400">+33 6 34 99 38 83</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MdEmail className="w-6 h-6 text-[#067481] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">{t("email")}</p>
                  <p className="text-gray-600 dark:text-gray-400">contact@parisyolcusu.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MdAccessTime className="w-6 h-6 text-[#067481] flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">{t("businessHours")}</p>
                  <p className="text-gray-600 dark:text-gray-400">{t("businessHoursText")}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{t("faqQuestion")}</p>
              <Link href={`/${locale}/#faq`} className="inline-flex items-center gap-2 text-[#067481] hover:text-[#056a77] font-medium">
                {t("faqLink")} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfoForm;
