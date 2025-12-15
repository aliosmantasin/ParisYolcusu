"use client";

import { useForm, UseFormSetValue } from "react-hook-form";
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
  origin: yup.string().required("Alış noktası zorunludur"),
  destination: yup.string().required("Varış noktası zorunludur"),
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
  origin: string;
  destination: string;
  recaptchaToken: string;
};

const defaultCenter = { lat: 41.0082, lng: 28.9784 }; // Istanbul center

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
      <Label>Telefon</Label>
      <PhoneInput
        country={"tr"}
        onChange={(value) => setValue("phone", value)}
        inputStyle={{ width: "100%", ...inputStyle }}
        dropdownStyle={{ ...dropdownStyle }}
        buttonStyle={{ ...dropdownStyle }}
        containerStyle={{ width: "100%" }}
      />
      {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
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
    resolver: yupResolver(formSchema),
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
    <section className="flex items-center justify-center my-20">
      <div className="w-full max-w-2xl p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">{t("reservationForm")}</h2>
        
        <form onSubmit={handleSubmit(sendReservation)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t("name")}</Label>
              <Input {...register("firstName")} />
              {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName.message}</p>}
            </div>
            
            <div>
              <Label>{t("surname")}</Label>
              <Input {...register("lastName")} />
              {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <PhoneInputField setValue={setValue} errors={errors} />
            </div>
            
            <div>
              <Label>{t("email")}</Label>
              <Input {...register("email")} type="email" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t("dateTime")}</Label>
              <div>
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                className="w-full p-2 border rounded"
                minDate={new Date()}
              />
              {errors.date && <p className="text-red-500 text-sm">{errors.date.message}</p>}
              </div>
       
            </div>
            
            <div>
              <Label>{t("passengers")}</Label>
              <Input 
                type="number" 
                {...register("passengers", { 
                  valueAsNumber: true,
                  min: 1
                })} 
                min="1" 
              />
              {errors.passengers && <p className="text-red-500 text-sm">{errors.passengers.message}</p>}
            </div>
          </div>

          <div>
            <Label>{t("vehicleType")}</Label>
            <Select 
              onValueChange={(value) => { 
                setValue("vehicle", value); 
                setSelectedVehicle(value); 
              }}
              value={selectedVehicle}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectVehicle")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sedan-Vehicle">{tVehicles("vehicle1.name")} | 3 {tVehicles("passengers")}</SelectItem>
                <SelectItem value="mercedes-benz-classe-v">{tVehicles("vehicle2.name")} | 7 {tVehicles("passengers")}</SelectItem>
                <SelectItem value="mercedes-benz-classe-s">{tVehicles("vehicle3.name")} | 3 {tVehicles("passengers")}</SelectItem>
                
              </SelectContent>
            </Select>
            {errors.vehicle && <p className="text-red-500 text-sm">{errors.vehicle.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>{t("pickupLocation")}</Label>
              <Input 
                type="text" 
                {...originRegister}
                ref={(e) => {
                  originRegister.ref(e);
                  originRef.current = e;
                }}
                placeholder={loadError ? "Örn: İstanbul Havalimanı" : t("enterPickupLocation")}
              />
              {errors.origin && <p className="text-red-500 text-sm">{errors.origin.message}</p>}
              {loadError && (
                <p className="text-amber-600 text-xs mt-1">
                  ⚠️ Google Maps yüklenemediği için manuel adres girişi yapın
                </p>
              )}
            </div>
            
            <div>
              <Label>{t("dropoffLocation")}</Label>
              <Input 
                type="text" 
                {...destinationRegister}
                ref={(e) => {
                  destinationRegister.ref(e);
                  destinationRef.current = e;
                }}
                placeholder={loadError ? "Örn: Taksim Meydanı" : t("enterDropoffLocation")}
              />
              {errors.destination && <p className="text-red-500 text-sm">{errors.destination.message}</p>}
              {loadError && (
                <p className="text-amber-600 text-xs mt-1">
                  ⚠️ Google Maps yüklenemediği için manuel adres girişi yapın
                </p>
              )}
            </div>
          </div>

          {routeInfo && (
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="font-medium">Mesafe:</span> {routeInfo.distance}
              </div>
              <div>
                <span className="font-medium">Tahmini Süre:</span> {routeInfo.duration}
              </div>
            </div>
          )}

          <div className="h-64 w-full rounded-lg overflow-hidden border">
            {loadError ? (
              <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
                <div className="mb-4">
                  <svg
                    className="w-16 h-16 text-gray-400 mx-auto"
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
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Harita Yüklenemedi
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Google Maps şu anda yüklenemiyor. Lütfen konum bilgilerinizi manuel olarak girin ve rezervasyonunuzu tamamlayın.
                </p>
                <p className="text-xs text-gray-500">
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

          <div className="my-4">
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
              onChange={(token) => setValue("recaptchaToken", token || "")}
            />
            {errors.recaptchaToken && <p className="text-red-500 text-sm">{errors.recaptchaToken.message}</p>}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={(!directions && !loadError) || isSubmitting}
          >
            {isSubmitting ? t("submitting") : t("submitReservation")}
          </Button>
        </form>

        {toastMessage && (
          <div className="flex justify-between items-center mt-4 bg-gray-900 text-white p-4 rounded shadow-md">
            {toastMessage}
            <button 
              onClick={() => setToastMessage(null)} 
              className="ml-4 text-red-400 hover:text-red-300"
            >
              {t("close")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ReservationForm;