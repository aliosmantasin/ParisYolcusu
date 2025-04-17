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
import { useState, useEffect } from "react";
import { useTheme } from "next-themes"; // 🌙 Tema desteği için
import { useFormTranslations } from "./languageInfo";

// ✅ Form Validasyonu
const formSchema = yup.object().shape({
  firstName: yup.string().min(3, "İsim en az 3 karakter olmalı").required(),
  lastName: yup.string().min(3, "Soyisim en az 3 karakter olmalı").required(),
  phone: yup.string().min(10, "Geçerli bir telefon numarası girin").required(),
  email: yup.string().email("Geçerli bir email girin").required(),
  service: yup.string().required("Hizmet seçimi zorunludur"),
  recaptchaToken: yup.string().required("Lütfen reCAPTCHA doğrulamasını yapın"),
});

// Type for form data
type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  service: string;
  recaptchaToken: string;
};

// 📱 Telefon Girişi Bileşeni (Tema Duyarlı)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PhoneInputField = ({ setValue, errors }: any) => {
  const { theme } = useTheme();
  const translations = useFormTranslations();
  const [inputStyle, setInputStyle] = useState({});

  useEffect(() => {
    setInputStyle(
      theme === "dark"
        ? {
            backgroundColor: "#1F2937", // Tailwind `gray-800`
            color: "#F3F4F6", // Tailwind `gray-200`
            border: "1px solid #374151", // Tailwind `gray-600`
          }
        : {
            backgroundColor: "#FFFFFF",
            color: "#000000",
            border: "1px solid #D1D5DB", // Tailwind `gray-300`
          }
    );
  }, [theme]);

  return (
    <div className="mb-4">
      <Label>{translations.phone}</Label>
      <PhoneInput
        country={"tr"}
        onChange={(value) => setValue("phone", value)}
        inputStyle={{ width: "100%", ...inputStyle }}
      />
      {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
    </div>
  );
};

const InfoForm = () => {
  const [selectedService, setSelectedService] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting }, watch } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      service: "",
      recaptchaToken: "",
    },
  });

  // Formdaki alanları izleme
  const formValues = watch();
  const isFormValid = Object.values(formValues).every(value => value !== "" && value !== undefined);

  const sendEmail = async (data: FormData) => {
    try {
      const res = await axios.post("/api/send-email", { ...data }, {
        headers: { "Content-Type": "application/json" },
      });
      if (res.status === 200) {
        setToastMessage("✅ Email başarıyla gönderildi.");
      } else {
        throw new Error();
      }
    } catch (error) {
      setToastMessage("❌ Email gönderilirken bir hata oluştu.");
    }
  };

  const translations = useFormTranslations();

  return (
    <section className="flex items-center justify-center my-20">
      <div className="w-full max-w-md p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">{translations.applyForm}</h2>
        <form onSubmit={handleSubmit(sendEmail)} id="formSubmission">
          <div className="mb-4">
            <Label>{translations.name}</Label>
            <Input {...register("firstName")} />
            {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
          </div>

          <div className="mb-4">
            <Label>{translations.surname}</Label>
            <Input {...register("lastName")} />
            {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
          </div>

          {/* 📱 Telefon Girişi (Karanlık/Aydınlık Mod Duyarlı) */}
          <PhoneInputField setValue={setValue} errors={errors} />

          <div className="mb-4">
            <Label>{translations.email}</Label>
            <Input {...register("email")} type="email" />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>

          <div className="mb-4">
            <Label>{translations.selectService}</Label>
            <Select onValueChange={(value) => { setValue("service", value); setSelectedService(value); }}>
              <SelectTrigger>
                <span>{selectedService || translations.select}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={translations.airplaneTransfer}>{translations.airplaneTransfer}</SelectItem>
                <SelectItem value={translations.parisTravelTours}>{translations.parisTravelTours}</SelectItem>
                <SelectItem value={translations.privateChauffeur}>{translations.privateChauffeur}</SelectItem>
              </SelectContent>
            </Select>
            {errors.service && <p className="text-red-500">{errors.service.message}</p>}
          </div>

          <div className="mb-4">
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
              onChange={(token) => setValue("recaptchaToken", token || "")}
            />
            {errors.recaptchaToken && <p className="text-red-500">{errors.recaptchaToken.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={!isFormValid || isSubmitting}>
            {isSubmitting ? "Gönderiliyor..." : translations.sendForm}
          </Button>
        </form>

        {toastMessage && (
          <div className="flex mt-10 bg-gray-900 text-white p-4 rounded shadow-md">
            {toastMessage}
            <button onClick={() => setToastMessage(null)} className="ml-4 text-red-400">Kapat</button>
          </div>
        )}
      </div>
    </section>
  );
};

export default InfoForm;
