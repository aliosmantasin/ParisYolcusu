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
import { useState } from "react";

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

const InfoForm = () => {
  const [selectedService, setSelectedService] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setToastMessage("❌ Email gönderilirken bir hata oluştu.");
    }
  };

  return (
    <section className="flex items-center justify-center my-20">
     
      <div className="w-full max-w-md p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold text-center mb-4">Başvuru Formu</h2>
        <form onSubmit={handleSubmit(sendEmail)}>
          <div className="mb-4">
            <Label>Adınız</Label>
            <Input {...register("firstName")} />
            {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
          </div>
          
          <div className="mb-4">
            <Label>Soy Adınız</Label>
            <Input {...register("lastName")} />
            {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
          </div>
          
          <div className="mb-4">
            <Label>Telefon</Label>
            <PhoneInput
              country={"tr"}
              onChange={(value) => setValue("phone", value)}
              inputStyle={{ width: "100%" }}
            />
            {errors.phone && <p className="text-red-500">{errors.phone.message}</p>}
          </div>
          
          <div className="mb-4">
            <Label>Email</Label>
            <Input {...register("email")} type="email" />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>
          
          <div className="mb-4">
            <Label>Hizmet Seçiniz</Label>
            <Select onValueChange={(value) => { setValue("service", value); setSelectedService(value); }}>
              <SelectTrigger>
                <span>{selectedService || "Seçiniz"}</span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hizmet1">Hizmet1</SelectItem>
                <SelectItem value="hizmet2">Hizmet2</SelectItem>
                <SelectItem value="hizmet3">Hizmet3</SelectItem>
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
          
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Gönderiliyor..." : "Gönder"}
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
