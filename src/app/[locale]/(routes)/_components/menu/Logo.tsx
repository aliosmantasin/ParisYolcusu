import { Dancing_Script } from "next/font/google";
import Link from "next/link";

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "700"], // Farklı kalınlıklar eklenebilir
});

export default function Logo() {
  return (
    <div className="flex items-center relative">
      <Link href="/">
        <span className={`${dancingScript.className} text-3xl font-bold text-black dark:text-white`}>
          Sade Tasarım
        </span>
      </Link>
    </div>
  );
}


