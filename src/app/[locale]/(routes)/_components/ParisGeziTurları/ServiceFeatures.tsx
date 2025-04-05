import { useTranslations } from "next-intl";
import { FaCar, FaUserTie, FaMapMarkedAlt, FaHotel } from "react-icons/fa";

const ServiceFeatures = () => {
  const t = useTranslations("ParisGeziTurlari.ServiceFeatures");

  const features = [
    {
      icon: FaCar,
      title: t("privateDriver.title"),
      description: t("privateDriver.description"),
    },
    {
      icon: FaUserTie,
      title: t("professionalGuide.title"),
      description: t("professionalGuide.description"),
    },
    {
      icon: FaMapMarkedAlt,
      title: t("customRoutes.title"),
      description: t("customRoutes.description"),
    },
    {
      icon: FaHotel,
      title: t("hotelTransfer.title"),
      description: t("hotelTransfer.description"),
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 HeadStyle">
          {t("title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6">
              <div className="flex justify-center mb-4">
                <feature.icon className="w-12 h-12 primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 HeadStyle">
                {feature.title}
              </h3>
              <p className="paragraphStyle">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceFeatures;
