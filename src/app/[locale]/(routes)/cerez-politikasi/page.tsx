import { Metadata } from "next";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale;
  const t = await getTranslations({ locale, namespace: "CookiePolicy" });
  
  return {
    title: `${t("title")} | Paris Yolcusu`,
    description: t("aboutCookiesText"),
  };
}

export default function CookiePolicyPage() {
  const t = useTranslations("CookiePolicy");

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>
      
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t("aboutCookies")}</h2>
        <p className="mb-4">
          {t("aboutCookiesText")}
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t("cookieTypes")}</h2>
        
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2">{t("mandatoryCookies")}</h3>
          <p>
            {t("mandatoryCookiesText")}
          </p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2">{t("functionalCookies")}</h3>
          <p>
            {t("functionalCookiesText")}
          </p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2">{t("analyticalCookies")}</h3>
          <p>
            {t("analyticalCookiesText")}
          </p>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2">{t("marketingCookies")}</h3>
          <p>
            {t("marketingCookiesText")}
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t("manageCookies")}</h2>
        <p className="mb-4">
          {t("manageCookiesText1")}
        </p>
        <p className="mb-4">
          {t("manageCookiesText2")}
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t("thirdPartyCookies")}</h2>
        <p className="mb-4">
          {t("thirdPartyCookiesText")}
        </p>
        <ul className="list-disc ml-6 mb-4">
          <li className="mb-2">{t("googleAnalytics")}</li>
          <li className="mb-2">{t("googleTagManager")}</li>
          <li className="mb-2">{t("facebookPixel")}</li>
          <li className="mb-2">{t("microsoftClarity")}</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t("contact")}</h2>
        <p className="mb-4">
          {t("contactText")}
        </p>
        <p>
          {t("email")}: <a href="mailto:info@parisyolcusu.com" className="text-blue-600 hover:underline">info@parisyolcusu.com</a>
        </p>
      </section>

      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:underline">
          {t("backToHome")}
        </Link>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return [
    { locale: 'tr' },
    { locale: 'en' },
    { locale: 'fr' }
  ]
} 