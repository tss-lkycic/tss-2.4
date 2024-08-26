"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import new_logo from "/public/new_logo.svg";
import translate_logo from "/public/translate.svg";
import transition_logo from "/public/transition.svg";
import compare_logo from "/public/compare.svg";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState, useEffect, useRef } from "react";
import MenuItem from "./MenuItem";

export default function TopBar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const toggleMenu = () => {
    console.log(isMenuOpen);
    setIsMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef, buttonRef]);

  return (
    <div className="bg-[#474545] h-[3.5rem] w-full flex flex-row justify-between">
      <div className="flex items-center">
        <button
          ref={buttonRef}
          className="text-[#474545] bg-[#8d9093] p-2 mx-4 flex justify-center items-center rounded-full hover:bg-gray-700 hover:text-white transition-colors duration-200"
          onClick={toggleMenu}
        >
          <GiHamburgerMenu />
        </button>
        <div
          ref={menuRef}
          className={`absolute top-14 z-10 w-[270px] bg-[#474545] border-t border-white text-white transition-all duration-300 ease-in-out ${
            isMenuOpen ? "animate-slideDown" : "hidden animate-slideUp"
          }`}
        >
          <ul>
            <MenuItem href="/" iconSrc={new_logo} label="Home" />
            <MenuItem
              href="/translate"
              iconSrc={translate_logo}
              label="Task Translator"
            />
            <MenuItem
              href="/compare"
              iconSrc={compare_logo}
              label="Task Comparator"
            />
            <MenuItem
              href="/transition"
              iconSrc={transition_logo}
              label="Transition Generator"
            />
          </ul>
        </div>
      </div>
      {pathname == "/" ? null : (
        <Link href="/" className="flex-grow flex justify-center items-center">
          <div className="flex items-center">
            <Image src={new_logo} width={40} alt="Logo" className="m-2" />
            <p className="md:ml-5 ml-3 md:text-xl text-md text-white tracking-[0.5rem]">
              S T A K
            </p>
          </div>
        </Link>
      )}
      <div className="w-12"></div>
    </div>
  );
}
