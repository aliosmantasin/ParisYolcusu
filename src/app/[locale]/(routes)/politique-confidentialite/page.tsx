import { Metadata } from "next";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = (await params).locale;
  const t = await getTranslations({ locale, namespace: "PrivacyPolicy" });
  
  return {
    title: `${t("title")} | Paris Yolcusu`,
    description: t("intro"),
  };
}

export default function PrivacyPolicyPage() {
  const t = useTranslations("PrivacyPolicy");

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-8">{t("lastUpdated")}</p>
      <p className="mb-8 text-lg">{t("intro")}</p>
      
      {/* Section 1 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t("section1.title")}</h2>
        <p className="mb-4">{t("section1.description")}</p>
        
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2">{t("section1.contactForm.title")}</h3>
          <p className="mb-2">{t("section1.contactForm.description")}</p>
          <ul className="list-disc ml-6 mb-4">
            {t.raw("section1.contactForm.items")?.map((item: string, index: number) => (
              <li key={index} className="mb-1">{item}</li>
            ))}
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2">{t("section1.reservationForm.title")}</h3>
          <p className="mb-2">{t("section1.reservationForm.description")}</p>
          <ul className="list-disc ml-6 mb-4">
            {t.raw("section1.reservationForm.items")?.map((item: string, index: number) => (
              <li key={index} className="mb-1">{item}</li>
            ))}
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-medium mb-2">{t("section1.automaticData.title")}</h3>
          <p className="mb-2">{t("section1.automaticData.description")}</p>
          <ul className="list-disc ml-6 mb-4">
            {t.raw("section1.automaticData.items")?.map((item: string, index: number) => (
              <li key={index} className="mb-1">{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Section 2 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t("section2.title")}</h2>
        <p className="mb-4">{t("section2.description")}</p>
        <ul className="list-disc ml-6 mb-4">
          {t.raw("section2.items")?.map((item: string, index: number) => (
            <li key={index} className="mb-2">{item}</li>
          ))}
        </ul>
      </section>

      {/* Section 3 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t("section3.title")}</h2>
        <p className="mb-4">{t("section3.description")}</p>
      </section>

      {/* Section 4 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t("section4.title")}</h2>
        <p className="mb-4">{t("section4.description")}</p>
        <ul className="list-disc ml-6 mb-4">
          {t.raw("section4.items")?.map((item: string, index: number) => (
            <li key={index} className="mb-2">{item}</li>
          ))}
        </ul>
      </section>

      {/* Section 5 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t("section5.title")}</h2>
        <p className="mb-4">{t("section5.description")}</p>
        <ul className="list-disc ml-6 mb-4">
          {t.raw("section5.items")?.map((item: string, index: number) => (
            <li key={index} className="mb-2">{item}</li>
          ))}
        </ul>
        <p className="mb-2 font-semibold">{t("section5.howToUse")}</p>
        <p className="mb-4">{t("section5.howToUseText")}</p>
      </section>

      {/* Section 6 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t("section6.title")}</h2>
        <p className="mb-4">{t("section6.description")}</p>
      </section>

      {/* Section 7 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t("section7.title")}</h2>
        <p className="mb-4">{t("section7.description")}</p>
      </section>

      {/* Section 8 */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">{t("section8.title")}</h2>
        <p className="mb-4">{t("section8.description")}</p>
        <p>
          {t("section8.email")}: <a href="mailto:info@parisyolcusu.com" className="text-blue-600 hover:underline dark:text-blue-400">{t("section8.emailAddress")}</a>
        </p>
      </section>

      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:underline dark:text-blue-400">
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
