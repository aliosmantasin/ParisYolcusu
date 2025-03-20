
import Image from "next/image";
import Link from "next/link";



export default function Logo() {
  return (
    <div className="flex items-center relative">
      <Link href="/">
        <Image src="/images/ParisYolcusuLogo.png" alt="Paris Yolcusu Logo" width={150} height={150}/>
      </Link>
    </div>
  );
}


