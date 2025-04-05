import Image from "next/image";
import { useTranslations } from "next-intl";

const PopularAttractions = () => {
  const t = useTranslations("ParisGeziTurlari");

  const attractions = [
    {
      title: t("PopularAttractions.eiffel.title"),
      description: t("PopularAttractions.eiffel.description"),
      image: "/images/eyfelkulesi.webp",
    },
    {
      title: t("PopularAttractions.louvre.title"),
      description: t("PopularAttractions.louvre.description"),
      image: "/images/louvre.webp",
    },
    {
      title: t("PopularAttractions.notreDame.title"),
      description: t("PopularAttractions.notreDame.description"),
      image: "/images/notredeme.webp",
    },
    {
      title: t("PopularAttractions.versailles.title"),
      description: t("PopularAttractions.versailles.description"),
      image: "/images/versay.webp",
    },
  ];

  return (
    <section className="py-16 theme">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 HeadStyle">
          {t("PopularAttractions.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {attractions.map((attraction, index) => (
            <div key={index} className="cardBgColor cardHover rounded-lg shadow-lg overflow-hidden cursor-pointer">
              <div className="relative h-48">
                <Image
                  src={attraction.image}
                  alt={attraction.title}
                  fill
                  className="object-cover brightness-100 dark:brightness-50"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 HeadStyle">{attraction.title}</h3>
                <p className="text-gray-600 paragraphStyle">{attraction.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularAttractions;
