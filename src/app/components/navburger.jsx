"use client";

import { useRouter } from "next/navigation";
import { useRef, useEffect } from "react";
import { motion, useCycle } from "framer-motion";

const sidebarVariants = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at calc(100% - 40px) 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
    },
  }),
  closed: {
    clipPath: "circle(20px at calc(100% - 40px) 40px)",
    transition: {
      delay: 0.5,
      type: "spring",
      stiffness: 400,
      damping: 40,
    },
  },
};

const Path = (props) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    {...props}
  />
);

export const MenuToggle = ({ toggle }) => (
  <button
    onClick={toggle}
    className="absolute mt-[30px] mr-[28px] top-0 right-0 "
  >
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" },
        }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" },
        }}
      />
    </svg>
  </button>
);

export default function Navburger() {
  const router = useRouter();
  const [isOpen, toggleOpen] = useCycle(false, true);
  const containerRef = useRef(null);

  // function handleHome() {
  //   toggleOpen(false);
  //   router.push("/");
  // }
  // function handleAbout() {
  //   router.push("/about");
  //   toggleOpen(false);
  // }
  // function handleLogin() {
  //   toggleOpen(false);
  //   router.push("/login");
  // }
  return (
    <motion.nav
      initial={false}
      animate={isOpen ? "open" : "closed"}
      custom={1000}
      ref={containerRef}
      className="w-screen flex flex-row justify-end absolute"
    >
      <motion.div
        variants={sidebarVariants}
        className="bg-[#D9D9D9]  opacity-80 h-screen w-1/2 absolute top-0 right-0"
      >
        <div className="h-full w-full opacity-100">
          <div className="mt-[5rem] flex flex-col ml-[2rem] text-[#474545] text-3xl">
            <a href="/">
              <button className="text-left mt-2 mb-2">Home</button>{" "}
            </a>
            <a href="/about">
              <button className="text-left mt-2 mb-2">About</button>
            </a>
            {/* <a href="/login">
              <button className="text-left mt-2 mb-2">Login</button>
            </a> */}
          </div>
        </div>
      </motion.div>
      <MenuToggle toggle={toggleOpen} />
    </motion.nav>
  );
}
