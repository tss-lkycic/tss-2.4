import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MenuItem = ({ href, iconSrc, label }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  const menuItem =
    "p-2 border-b border-white flex flex-row items-center hover:bg-gray-700 transition-colors duration-200";
  const activeMenuItem = "bg-gray-800";

  return (
    <Link href={href}>
      <li className={`${menuItem} ${isActive ? activeMenuItem : ""}`}>
        <div className="w-[50px] flex items-center justify-center mr-2">
          <Image src={iconSrc} height={35} alt={`${label} Logo`} />
        </div>
        <span>{label}</span>
      </li>
    </Link>
  );
};

export default MenuItem;
