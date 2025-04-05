import { ReactNode } from "react";
import { Metadata } from "next";
import Navbar from "./_components/menu/Navbar";
import Footer from "./_components/menu/Footer";
import ScrollTop from "./_components/lib/ScrollTop/ScrollTop";
import { GoogleTagManager } from "@next/third-parties/google";
import BottomNavigation from "./_components/homepage/BottomNavigation";
import { MdKeyboardArrowUp } from "react-icons/md";

export const metadata: Metadata = {
  title: "Paris Havalimanı Transfer Hizmeti | Paris Yolcusu",
  description: "Paris'te konforlu ve güvenilir VIP transfer hizmeti! Paris Yolcusu firması olarak, lüks araçlarımız ve profesyonel şoförlerimizle havalimanı transferi, özel şehir turları ve otel transferleri sunuyoruz. Hemen rezervasyon yapın ve rahat bir yolculuğun tadını çıkarın!",
  verification: {
    google: "nojSoW1CdLhiYDQ8XnjhXKsGckcs3RSKFx2QQc",
  },
  icons: {
    icon: [
      { url: "/images/favicon.ico/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/favicon.ico/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/favicon.ico/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/images/favicon.ico/android-icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/images/favicon.ico/apple-icon-57x57.png", sizes: "57x57", type: "image/png" },
      { url: "/images/favicon.ico/apple-icon-60x60.png", sizes: "60x60", type: "image/png" },
      { url: "/images/favicon.ico/apple-icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/images/favicon.ico/apple-icon-76x76.png", sizes: "76x76", type: "image/png" },
      { url: "/images/favicon.ico/apple-icon-114x114.png", sizes: "114x114", type: "image/png" },
      { url: "/images/favicon.ico/apple-icon-120x120.png", sizes: "120x120", type: "image/png" },
      { url: "/images/favicon.ico/apple-icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/images/favicon.ico/apple-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/images/favicon.ico/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default async function RoutesLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Navbar/>
      <GoogleTagManager gtmId="GTM-NJC2MR8S"/>
      <div>
        {children} 
      </div>
      <ScrollTop>
        <MdKeyboardArrowUp />
      </ScrollTop>
      <BottomNavigation/>
      <Footer/>
    </>
  );
}

 

