"use client"
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function Logo() {
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = theme === "system" ? resolvedTheme : theme;
  
  const logoSrc = currentTheme === "dark" 
    ? "/images/ParisYolcusuLogoBeyaz.png" 
    : "/images/ParisYolcusuLogo.png";

  return (
    <div className="flex items-center relative">
      <Link href="/">
        <Image src={logoSrc} alt="Paris Yolcusu Logo" width={150} height={150} />
      </Link>
    </div>
  );
}
