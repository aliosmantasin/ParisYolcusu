import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

const CDGairport = () => {
  const t = useTranslations("ParisHavalimanı");

  return (
    <section className="my-20 m-2 p-10">
      <div className="max-w-5xl flex flex-wrap mx-auto justify-center rounded-lg overflow-hidden">
        <div className="w-full sm:w-1/2">
          <Image
            src="/images/cdgCart.webp"
            alt={t("CDGairport.title")}
            width={400}
            height={250}
            className="w-full h-56 object-cover brightness-100 dark:brightness-50"
          />
        </div>

        <div className="p-4 w-full sm:w-1/2">
          <h1 className="text-3xl font-semibold HeadStyle">{t("CDGairport.title")}</h1>

          <p className="paragraphStyle mt-2">
            {t.rich("CDGairport.description1", {
              strong: (chunks) => <strong className="underline font-bold">{chunks}</strong>,
            })}
          </p>
        </div>
      </div>

      {/* <div className="container mx-auto mt-5 ">
        <div className="relative overflow-x-auto scrollbar-custom">
          <table className="container text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">{t("CDGairport.table.route")}</th>
                <th scope="col" className="px-6 py-3">{t("CDGairport.table.distance")}</th>
                <th scope="col" className="px-6 py-3">{t("CDGairport.table.duration")}</th>
                <th scope="col" className="px-6 py-3">{t("CDGairport.table.vehicle")}</th>
                <th scope="col" className="px-6 py-3">{t("CDGairport.table.price")}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {t("CDGairport.routes.route1.name")}
                </th>
                <td className="px-6 py-4">{t("CDGairport.routes.route1.distance")}</td>
                <td className="px-6 py-4">{t("CDGairport.routes.route1.duration")}</td>
                <td className="px-6 py-4">{t("CDGairport.routes.route1.vehicle")}</td>
                <td className="px-6 py-4">{t("CDGairport.routes.route1.price")}</td>
              </tr>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {t("CDGairport.routes.route2.name")}
                </th>
                <td className="px-6 py-4">{t("CDGairport.routes.route2.distance")}</td>
                <td className="px-6 py-4">{t("CDGairport.routes.route2.duration")}</td>
                <td className="px-6 py-4">{t("CDGairport.routes.route2.vehicle")}</td>
                <td className="px-6 py-4">{t("CDGairport.routes.route2.price")}</td>
              </tr>
              <tr className="bg-white dark:bg-gray-800">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {t("CDGairport.routes.route3.name")}
                </th>
                <td className="px-6 py-4">{t("CDGairport.routes.route3.distance")}</td>
                <td className="px-6 py-4">{t("CDGairport.routes.route3.duration")}</td>
                <td className="px-6 py-4">{t("CDGairport.routes.route3.vehicle")}</td>
                <td className="px-6 py-4">{t("CDGairport.routes.route3.price")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> */}
    </section>
  );
};

export default CDGairport;
