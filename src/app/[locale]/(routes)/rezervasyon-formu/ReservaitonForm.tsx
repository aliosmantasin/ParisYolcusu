"use client";
import { useForm, UseFormSetValue, type Resolver } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useRef, useEffect, useCallback } from "react";
import { 
  GoogleMap, 
  Marker, 
  useJsApiLoader,
  DirectionsRenderer
} from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from 'next/navigation';
import { useTheme } from "next-themes";

const formSchema = yup.object().shape({
  firstName: yup.string().min(3, "İsim en az 3 karakter olmalı").required(),
  lastName: yup.string().min(3, "Soyisim en az 3 karakter olmalı").required(),
  phone: yup.string().min(10, "Geçerli bir telefon numarası girin").required(),
  email: yup.string().email("Geçerli bir email girin").required(),
  vehicle: yup.string().required("Araç seçimi zorunludur"),
  passengers: yup.number().min(1).required("Yolcu sayısı zorunludur"),
  date: yup.date().required("Tarih ve saat seçimi zorunludur"),
  // Alış ve varış noktaları opsiyonel
  origin: yup.string().nullable().notRequired(),
  destination: yup.string().nullable().notRequired(),
  recaptchaToken: yup.string().required("Lütfen reCAPTCHA doğrulamasını yapın"),
});

type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  vehicle: string;
  passengers: number;
  date: Date;
  // Opsiyonel alanlar: boş, null veya string olabilir (schema ile aynı tip)
  origin: string | null | undefined;
  destination: string | null | undefined;
  recaptchaToken: string;
};

const defaultCenter = { lat: 48.8566, lng: 2.3522 }; // Paris center

// Place adresini formatla - havalimanları için name, diğerleri için formatted_address
const getPlaceDisplayName = (place: google.maps.places.PlaceResult): string => {
  // Havalimanları için name kullan (daha anlaşılır)
  const isAirport = place.types?.some(type => 
    type === 'airport' || 
    (type === 'establishment' && place.name?.toLowerCase().includes('airport'))
  );
  
  if (isAirport && place.name) {
    return place.name;
  }
  
  // Diğer yerler için formatted_address kullan
  return place.formatted_address || place.name || "";
};

// Custom PhoneInput component with theme support
interface PhoneInputFieldProps {
  setValue: UseFormSetValue<FormData>;
  errors: {
    phone?: {
      message?: string;
    };
  };
}

const PhoneInputField = ({ setValue, errors }: PhoneInputFieldProps) => {
  const { theme } = useTheme();
  const [inputStyle, setInputStyle] = useState<React.CSSProperties>({});
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    setInputStyle(
      theme === "dark"
        ? {
            backgroundColor: "#1F2937", // Tailwind gray-800
            color: "#F3F4F6", // Tailwind gray-200
            border: "1px solid #374151", // Tailwind gray-600
          }
        : {
            backgroundColor: "#FFFFFF",
            color: "#000000",
            border: "1px solid #D1D5DB", // Tailwind gray-300
          }
    );

    setDropdownStyle(
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
      <Label className="text-slate-700 dark:text-slate-300">Telefon</Label>
      <div className="mt-1">
        <PhoneInput
          country={"tr"}
          onChange={(value) => setValue("phone", value)}
          inputStyle={{ width: "100%", ...inputStyle }}
          dropdownStyle={{ ...dropdownStyle }}
          buttonStyle={{ ...dropdownStyle }}
          containerStyle={{ width: "100%" }}
        />
      </div>
      {errors.phone && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.phone.message}</p>}
    </div>
  );
};

const ReservationForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleType = searchParams.get('vehicle');

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [originPlace, setOriginPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [destinationPlace, setDestinationPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [routeInfo, setRouteInfo] = useState<{ distance: string; duration: string } | null>(null);
  
  const originRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);
  const originAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const destinationAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
	resolver: yupResolver(formSchema) as unknown as Resolver<FormData>,
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      vehicle: "",
      passengers: 1,
      date: undefined,
      origin: "",
      destination: "",
      recaptchaToken: "",
    },
  });

  const originRegister = register("origin");
  const destinationRegister = register("destination");

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  const calculateRoute = useCallback(async () => {
    if (!originPlace || !destinationPlace || !map || loadError) return;

    const directionsService = new google.maps.DirectionsService();
    try {
      if (!originPlace.geometry?.location || !destinationPlace.geometry?.location) {
        throw new Error("Geçersiz konum bilgisi");
      }

      const results = await directionsService.route({
        origin: originPlace.geometry.location,
        destination: destinationPlace.geometry.location,
        travelMode: google.maps.TravelMode.DRIVING,
      });

      setDirections(results);
      setValue("origin", getPlaceDisplayName(originPlace));
      setValue("destination", getPlaceDisplayName(destinationPlace));
      
      // Mesafe ve süre bilgisini al
      const leg = results.routes[0].legs[0];
      setRouteInfo({
        distance: leg.distance?.text || "",
        duration: leg.duration?.text || "",
      });
      
      // Haritayı rotaya göre ayarla
      const bounds = new google.maps.LatLngBounds();
      results.routes[0].legs.forEach(leg => {
        bounds.extend(leg.start_location);
        bounds.extend(leg.end_location);
      });
      map.fitBounds(bounds);
    } catch (error) {
      console.error("Rota hesaplanırken hata oluştu:", error);
      setToastMessage("❌ Rota hesaplanırken bir hata oluştu");
    }
  }, [map, setValue, originPlace, destinationPlace, loadError]);

  // Rota otomatik hesaplama
  useEffect(() => {
    if (originPlace?.geometry?.location && destinationPlace?.geometry?.location) {
      calculateRoute();
    }
  }, [originPlace, destinationPlace, calculateRoute]);

  useEffect(() => {
    if (isLoaded && map) {
      // Origin Autocomplete
      if (originRef.current) {
        originAutocompleteRef.current = new google.maps.places.Autocomplete(originRef.current);
        originAutocompleteRef.current.addListener("place_changed", () => {
          const place = originAutocompleteRef.current?.getPlace();
          if (place) {
            setOriginPlace(place);
            // Input değerini formatlanmış isim ile güncelle
            const displayName = getPlaceDisplayName(place);
            if (originRef.current) {
              originRef.current.value = displayName;
              setValue("origin", displayName);
            }
          }
        });
      }

      // Destination Autocomplete
      if (destinationRef.current) {
        destinationAutocompleteRef.current = new google.maps.places.Autocomplete(destinationRef.current);
        destinationAutocompleteRef.current.addListener("place_changed", () => {
          const place = destinationAutocompleteRef.current?.getPlace();
          if (place) {
            setDestinationPlace(place);
            // Input değerini formatlanmış isim ile güncelle
            const displayName = getPlaceDisplayName(place);
            if (destinationRef.current) {
              destinationRef.current.value = displayName;
              setValue("destination", displayName);
            }
          }
        });
      }
    }
  }, [isLoaded, map, setValue]);

  useEffect(() => {
    if (vehicleType) {
      setSelectedVehicle(vehicleType);
      setValue("vehicle", vehicleType);
    }
  }, [vehicleType, setValue]);

  const sendReservation = async (data: FormData) => {
    try {
      const res = await axios.post("/api/reservation", {
        ...data,
        formType: 'reservation',
        distance: routeInfo?.distance || '',
        duration: routeInfo?.duration || ''
      }, {
        headers: { "Content-Type": "application/json" },
      });
      
      if (res.status === 200) {
        // Başarılı rezervasyon durumunda teşekkür sayfasına yönlendir
        router.push('/rezervasyonunuz-alindi-tesekkurler');
      } else {
        throw new Error();
      }
    } catch {
      setToastMessage("❌ Rezervasyon sırasında hata oluştu");
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setValue("date", date);
    }
  };

  const t = useTranslations("Reservation");
  const tVehicles = useTranslations("OurVehicles");

  if (!isLoaded && !loadError) {
    return <div className="flex items-center justify-center h-64">{t("loadingMap")}</div>;
  }

  return (
    <section id="rezervasyon-formu" className="bg-gradient-to-b from-white to-slate-50 py-16 dark:from-black dark:to-slate-950">
      <div className="container mx-auto max-w-5xl px-4">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {t("reservationForm")}
          </div>
          <h2 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
            Rezervasyon Bilgileriniz
          </h2>
          <div className="mx-auto mb-6 h-1 w-24 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600" />
          <p className="text-slate-600 dark:text-slate-400">
            Lütfen transfer bilgilerinizi eksiksiz doldurun
          </p>
        </div>

        {/* Form Card */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
        <form onSubmit={handleSubmit(sendReservation)} className="space-y-6 p-8">
          {/* Kişisel Bilgiler */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
              <svg className="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Kişisel Bilgiler
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label className="text-slate-700 dark:text-slate-300">{t("name")}</Label>
                <Input {...register("firstName")} className="mt-1" />
                {errors.firstName && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.firstName.message}</p>}
              </div>
              
              <div>
                <Label className="text-slate-700 dark:text-slate-300">{t("surname")}</Label>
                <Input {...register("lastName")} className="mt-1" />
                {errors.lastName && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.lastName.message}</p>}
              </div>
            </div>
          </div>

          {/* İletişim Bilgileri */}
          <div className="space-y-4 border-t border-slate-200 pt-6 dark:border-slate-700">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
              <svg className="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              İletişim Bilgileri
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <PhoneInputField setValue={setValue} errors={errors} />
              </div>
              
              <div>
                <Label className="text-slate-700 dark:text-slate-300">{t("email")}</Label>
                <Input {...register("email")} type="email" className="mt-1" />
                {errors.email && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.email.message}</p>}
              </div>
            </div>
          </div>

          {/* Transfer Detayları */}
          <div className="space-y-4 border-t border-slate-200 pt-6 dark:border-slate-700">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
              <svg className="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Transfer Detayları
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label className="text-slate-700 dark:text-slate-300">{t("dateTime")}</Label>
                <div className="mt-1">
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="dd/MM/yyyy HH:mm"
                    className="w-full rounded-md border border-slate-300 p-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    minDate={new Date()}
                  />
                  {errors.date && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.date.message}</p>}
                </div>
              </div>
              
              <div>
                <Label className="text-slate-700 dark:text-slate-300">{t("passengers")}</Label>
                <Input 
                  type="number" 
                  {...register("passengers", { 
                    valueAsNumber: true,
                    min: 1
                  })} 
                  min="1"
                  className="mt-1"
                />
                {errors.passengers && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.passengers.message}</p>}
              </div>
            </div>

            <div>
              <Label className="text-slate-700 dark:text-slate-300">{t("vehicleType")}</Label>
              <Select 
                onValueChange={(value) => { 
                  setValue("vehicle", value); 
                  setSelectedVehicle(value); 
                }}
                value={selectedVehicle}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder={t("selectVehicle")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sedan-Vehicle">{tVehicles("vehicle1.name")} | 3 {tVehicles("passengers")}</SelectItem>
                  <SelectItem value="mercedes-benz-classe-v">{tVehicles("vehicle2.name")} | 7 {tVehicles("passengers")}</SelectItem>
                  <SelectItem value="mercedes-benz-classe-s">{tVehicles("vehicle3.name")} | 3 {tVehicles("passengers")}</SelectItem>
                </SelectContent>
              </Select>
              {errors.vehicle && <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.vehicle.message}</p>}
            </div>
          </div>

          {/* Lokasyon Bilgileri */}
          <div className="space-y-4 border-t border-slate-200 pt-6 dark:border-slate-700">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-white">
              <svg className="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Lokasyon Bilgileri
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Alış ve varış adresleri opsiyoneldir. Dilerseniz bu bilgileri iletişim durumunda da verebilirsiniz.
            </p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label className="text-slate-700 dark:text-slate-300">
                  {t("pickupLocation")} <span className="text-xs font-normal text-slate-400">(Opsiyonel)</span>
                </Label>
                <Input 
                  type="text" 
                  {...originRegister}
                  ref={(e) => {
                    originRegister.ref(e);
                    originRef.current = e;
                  }}
                  placeholder={loadError ? "Örn: İstanbul Havalimanı" : t("enterPickupLocation")}
                  className="mt-1"
                />
                {loadError && (
                  <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                    ⚠️ Google Maps yüklenemediği için manuel adres girişi yapın
                  </p>
                )}
              </div>
              
              <div>
                <Label className="text-slate-700 dark:text-slate-300">
                  {t("dropoffLocation")} <span className="text-xs font-normal text-slate-400">(Opsiyonel)</span>
                </Label>
                <Input 
                  type="text" 
                  {...destinationRegister}
                  ref={(e) => {
                    destinationRegister.ref(e);
                    destinationRef.current = e;
                  }}
                  placeholder={loadError ? "Örn: Taksim Meydanı" : t("enterDropoffLocation")}
                  className="mt-1"
                />
                {loadError && (
                  <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                    ⚠️ Google Maps yüklenemediği için manuel adres girişi yapın
                  </p>
                )}
              </div>
            </div>
          </div>

          {routeInfo && (
            <div className="rounded-xl bg-gradient-to-r from-emerald-50 to-emerald-100 p-4 ring-1 ring-emerald-200 dark:from-emerald-900/20 dark:to-emerald-800/20 dark:ring-emerald-800/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Mesafe</p>
                    <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100">{routeInfo.distance}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">Tahmini Süre</p>
                    <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100">{routeInfo.duration}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="h-80 w-full overflow-hidden rounded-xl border-2 border-slate-200 shadow-lg dark:border-slate-700">
            {loadError ? (
              <div className="flex h-full w-full flex-col items-center justify-center bg-slate-50 p-6 text-center dark:bg-slate-900">
                <div className="mb-4">
                  <svg
                    className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-700 dark:text-slate-300">
                  Harita Yüklenemedi
                </h3>
                <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                  Google Maps şu anda yüklenemiyor. Lütfen konum bilgilerinizi manuel olarak girin ve rezervasyonunuzu tamamlayın.
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500">
                  Hata: {loadError.message || "Bilinmeyen hata"}
                </p>
              </div>
            ) : (
              <GoogleMap 
                center={defaultCenter}
                zoom={12}
                mapContainerStyle={{ height: "100%", width: "100%" }}
                options={{
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                }}
                onLoad={map => setMap(map)}
              >
                {originPlace?.geometry?.location && (
                  <Marker
                    position={originPlace.geometry.location}
                    icon={{
                      url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                      scaledSize: new google.maps.Size(30, 30),
                    }}
                  />
                )}
                {destinationPlace?.geometry?.location && (
                  <Marker
                    position={destinationPlace.geometry.location}
                    icon={{
                      url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                      scaledSize: new google.maps.Size(30, 30),
                    }}
                  />
                )}
                {directions && (
                  <DirectionsRenderer 
                    directions={directions}
                    options={{
                      suppressMarkers: true,
                      polylineOptions: {
                        strokeColor: "#2563eb",
                        strokeWeight: 5,
                      }
                    }}
                  />
                )}
              </GoogleMap>
            )}
          </div>

          {/* Güvenlik ve Onay */}
          <div className="space-y-4 border-t border-slate-200 pt-6 dark:border-slate-700">
            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                onChange={(token) => setValue("recaptchaToken", token || "")}
              />
            </div>
            {errors.recaptchaToken && <p className="text-center text-sm text-red-500 dark:text-red-400">{errors.recaptchaToken.message}</p>}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 py-6 text-lg font-bold shadow-xl shadow-emerald-500/30 transition-all hover:scale-[1.02] hover:from-emerald-600 hover:to-emerald-700 hover:shadow-emerald-500/40" 
              // Rota hesaplanmasa bile rezervasyona izin ver; sadece gönderim sırasında kilitle
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t("submitting")}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t("submitReservation")}
                </span>
              )}
            </Button>
          </div>
        </form>

        </div>

        {toastMessage && (
          <div className="mt-6 flex items-center justify-between rounded-xl bg-red-50 p-4 ring-1 ring-red-200 dark:bg-red-900/20 dark:ring-red-800/30">
            <span className="flex items-center gap-2 text-sm font-medium text-red-800 dark:text-red-200">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {toastMessage}
            </span>
            <button 
              onClick={() => setToastMessage(null)} 
              className="rounded-lg p-1 text-red-600 transition-colors hover:bg-red-100 hover:text-red-800 dark:text-red-400 dark:hover:bg-red-800/30 dark:hover:text-red-200"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReservationForm;