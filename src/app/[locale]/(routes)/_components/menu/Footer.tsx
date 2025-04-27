import React from 'react'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import ClientFooter from '../../../../../components/ClientFooter'

const Footer = () => {
    const locale = useLocale();
    const t = useTranslations("FooterLinks");

    const translations = {
      contact: t("contact"),
      about: t("about"),
      cookiePolicy: t("cookiePolicy"),
      cookiePolicyUrl: t("cookiePolicyUrl"),
      span: t("span")
    };

    return <ClientFooter locale={locale} translations={translations} />
}

export default Footer
