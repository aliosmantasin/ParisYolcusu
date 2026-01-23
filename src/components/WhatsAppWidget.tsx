"use client";
import { FaWhatsapp } from "react-icons/fa";
import { useLocale, useTranslations } from "next-intl";

const WHATSAPP_PHONE = "33651150547";

type WhatsAppOption = { label: string; message: string };

const optionsByLocale: Record<string, WhatsAppOption[]> = {
  tr: [
    {
      label: "Bilgi Almak İstiyorum",
      message:
        "Merhaba, genel bilgi almak istiyorum?",
    },

    {
      label: "Havalimanı Transfer",
      message:
        "Merhaba, Paris'te Havalimanı Transfer hizmeti için bilgi almak istiyorum. Uçuş bilgilerimi paylaştıktan sonra fiyat paylaşabilir misiniz?",
    },
    {
      label: "Disneyland Transfer",
      message:
        "Merhaba, Paris Disneyland için gidiş/dönüş VIP transfer hizmeti hakkında bilgi almak istiyorum. Fiyat ve araç seçeneklerini paylaşır mısınız?",
    },
    {
      label: "Paris Şehir Turu",
      message:
        "Merhaba, Paris şehir turu (Eyfel, Louvre, Notre-Dame vb.) için özel şoförlü tur hizmetiniz hakkında detaylı bilgi alabilir miyim?",
    },
    {
      label: "Paris Kapıdan Kapıya Transfer",
      message:
        "Merhaba, Paris içinde otel / adres arası kapıdan kapıya VIP transfer hizmeti için bilgi ve fiyat almak istiyorum.",
    },
  ],
  en: [
    {
      label: "Airport Transfer",
      message:
        "Hello, I would like to get information about your Airport Transfer service in Paris. Could you share prices after I send my flight details?",
    },
    {
      label: "Disneyland Transfer",
      message:
        "Hello, I would like to get information about round-trip VIP transfer service to Disneyland Paris. Could you share vehicle options and prices?",
    },
    {
      label: "Paris City Tour",
      message:
        "Hello, I would like to get detailed information about your private Paris City Tour (Eiffel Tower, Louvre Museum, Notre-Dame, etc.).",
    },
    {
      label: "Door-to-Door Transfer",
      message:
        "Hello, I would like to get information and prices for door-to-door VIP transfers between hotel and addresses in Paris.",
    },
  ],
  fr: [
    {
      label: "Transfert Aéroport",
      message:
        "Bonjour, je souhaite obtenir des informations sur votre service de transfert aéroport à Paris. Pourriez-vous partager les tarifs après l’envoi de mes détails de vol ?",
    },
    {
      label: "Transfert Disneyland",
      message:
        "Bonjour, je souhaite obtenir des informations sur votre service de transfert VIP aller-retour vers Disneyland Paris. Pourriez-vous partager les options de véhicules et les tarifs ?",
    },
    {
      label: "Visite de la Ville de Paris",
      message:
        "Bonjour, je souhaite obtenir des informations détaillées sur votre visite privée de la ville de Paris (Tour Eiffel, Musée du Louvre, Cathédrale Notre-Dame, etc.).",
    },
    {
      label: "Transfert Porte à Porte",
      message:
        "Bonjour, je souhaite obtenir des informations et des tarifs pour vos transferts VIP porte-à-porte entre l'hôtel et les adresses à Paris.",
    },
  ],
};

import { useWhatsAppWidget } from "./WhatsAppContext";

export default function WhatsAppWidget() {
  const { isOpen, close } = useWhatsAppWidget();
  const locale = useLocale();
  const t = useTranslations("WhatsAppWidget");
  const options = optionsByLocale[locale] || optionsByLocale.tr;

  if (!isOpen) return null;

  return (
    <div className="fixed right-4 bottom-20 z-[99998] w-64">
      <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl px-4 py-3 backdrop-blur-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.98)' }}>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
           
            <div className="text-sm font-semibold text-gray-900 dark:text-white">
              {t("title")}
            </div>
          </div>
          <button 
            onClick={close} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-lg font-bold"
            aria-label="Kapat"
          >
            ×
          </button>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          {options.map((opt) => (
            <a
              key={opt.label}
              href={`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(
                opt.message
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-[#DCF8C6] dark:hover:bg-gray-700 text-gray-800 dark:text-gray-100 transition-colors"
            >
              <FaWhatsapp className="flex-shrink-0" size={18} style={{ color: '#25D366' }} />
              <span className="line-clamp-2">{opt.label}</span>
            </a>
          ))}
        </div>

   
      </div>
    </div>

    
  );
}


