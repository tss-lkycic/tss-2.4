"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import new_logo from "/public/new_logo.svg";

export default function TopBar() {
  const pathname = usePathname();

  return (
    <div className=" bg-[#474545] h-[3.5rem] w-full">
      {pathname == "/" ? null : (
        <Link href="/">
          <div className="flex justify-center items-center h-full">
            <Image src={new_logo} width={40} alt="Logo" className="m-2"></Image>
            <p className="ml-5 text-xl  text-white tracking-[0.5rem]">
              S T A K
            </p>
          </div>
        </Link>
      )}
    </div>
  );
}
