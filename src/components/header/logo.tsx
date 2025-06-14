import Image from "next/image";
import Link from "next/link";

import { LogoImg } from "@/lib/data";

export default function Logo() {
  return (
    <Link href="/" className="flex gap-2 items-center text-white text-2xl md:text-3xl font-medium">
      <Image
        src={LogoImg}
        width={60}
        height={60}
        alt="logo"
      />
      <h2>Amar Editz</h2>
    </Link>
  );
}
