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

// Form Validasyonu (sadece gerekli alanlar)
const formSchema = yup.object().shape({
  fullName: yup.string().min(3, "İsim soyisim en az 3 karakter olmalı").required("İsim soyisim zorunludur"),
  phone: yup.string().min(10, "Geçerli bir telefon numarası girin").required("Telefon numarası zorunludur"),
  service: yup.string().required("Hizmet seçimi zorunludur"),
});

type FormData = {
  fullName: string;
  phone: string;
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
  const translations = useFormTranslations();

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting }, watch } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      service: "",
    },
  });

  const formValues = watch();
  const isFormValid = formValues.fullName && formValues.phone && formValues.service;

  const sendEmail = async (data: FormData) => {
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
          service: data.service,
          email: "", // Banner formunda email yok
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
        setValue("service", "");
        setSelectedService("");
        setTimeout(() => setToastMessage(null), 3000);
      } else {
        throw new Error();
      }
    } catch {
      setToastMessage("❌ Gönderilirken bir hata oluştu.");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <form 
        onSubmit={handleSubmit(sendEmail)} 
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
                <SelectItem value="Paris Disneyland">
                  Paris Disneyland
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
    </div>
  );
};

export default BannerInfoForm;
