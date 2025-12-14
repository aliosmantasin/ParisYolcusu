

import { useTranslations } from "next-intl";

export function useFormTranslations() {
  const t = useTranslations("Apply");
  
  return {
    applyForm: t("applyForm"),
    name: t("name"),
    surname: t("surname"),
    phone: t("phone"),
    email: t("email"),
    selectService: t("selectService"),
    select: t("select"),
    airplaneTransfer: t("AirplaneTransfer"),
    parisTravelTours: t("ParisTravelTours"),
    privateChauffeur: t("PrivateChauffeur"),
    disneylandTransfer: t("DisneylandTransfer"),
    sendForm: t("SendForm")
  };
}
