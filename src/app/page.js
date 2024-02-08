"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import BallBG from "./components/ball";
// import Image from "next/image";
// import tesa from "public/TESA_text.svg";
// import tesalogo from "public/TESSA_FINAL.svg";
import Navburger from "./components/navburger";
import { FiChevronDown } from "react-icons/fi";
// import tssinfo from "public/Information Output.svg";
// import tssinteract from "public/Interact_new.svg";
// import tssmental from "public/Mental.svg";
// import tsswork from "public/Work Output.svg";
// import tsswheel from "public/wheel.gif";
// import Carousel from "./components/carousel";
// import LoadingPage from "./loading";
// import axios from "axios";

async function warmup() {
  try {
    const res = await axios("api/warmup", {
      method: "POST",
    });
    console.log(res);
  } catch (error) {
    console.error("Error during warm-up:", error);
  }
}

export default function Page() {
  useEffect(() => {
    console.log("warm up initiated");
    warmup();
  }, []);
  const router = useRouter();

  const images = [
    "tss_light.svg",
    "Mutli-Stage Tool.svg",
    "Dream Stack.svg",
    "Future PlanTool.svg",
    "International Operability.svg",
    "Peronality Map Tool.svg",
    "Stack Tool.svg",
    "Well-being Matrix Tool.svg",
    "Multivitamin Tool.svg",
  ];
  const image_labels = [
    "Task Skills Stack",
    "Multi-Stage Transition",
    "Dream Stack",
    "Future Plan",
    "International Operability",
    "Personality Map",
    "Stack Skills",
    "Well-being Matrix",
    "Multivitamin Strategy",
  ];

  const image_description = [
    "You are what you do. You are more than what you do at work. Stack your hobbies with work, and re-imagine more career options.",
    "Take a look at your career progression three steps ahead",
    "Re-imagine your career possibilities based on your occupation(s)and hobbies",
    "Re-imagine your career possibilities based on your occupation(s)and hobbies",
    "Re-imagine your career possibilities based on your occupation(s)and hobbies",
    "Re-imagine your career possibilities based on your occupation(s)and hobbies",
    "Re-imagine your career possibilities based on your occupation(s)and hobbies",
    "Re-imagine your career possibilities based on your occupation(s)and hobbies",
    "Diversify and re-design your career pathways",
  ];
  function handleJourney() {
    router.push("/journey/occupations");
  }
  // const [text, setText] = useState(words[0]);
  const [scrollUp, setScrollUp] = useState(false);
  const [removeDiv, setRemoveDiv] = useState(false);
  const [appear, setAppear] = useState(false);
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setText((prevText) => {
  //       const nextIndex = (words.indexOf(prevText) + 1) % words.length;
  //       return words[nextIndex];
  //     });
  //   }, 2800);

  //   return () => clearInterval(interval);
  // }, []);

  function handleScroll() {
    setScrollUp(true);
    setInterval(() => {
      setRemoveDiv(true);
    }, 2000);
  }
  return (
    <div className="h-screen max-w-screen max-h-screen w-screen flex flex-col items-center overflow-x-hidden">
      <motion.div
        style={{
          backgroundImage: "linear-gradient(to bottom, #010101 50%, #474545)",
        }}
        className="h-screen max-w-screen max-h-screen w-screen flex flex-col justify-center overflow-x-hidden "
        // fallback={<Loading />}
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: scrollUp ? -700 : 0 }}
        transition={{
          ease: "easeInOut",
          type: "spring",
          stiffness: 15,
          duration: 1,
        }}
      >
        <div className="w-screen h-screen flex flex-col justify-between">
          <div className="flex w-full flex-col items-center">
            {/* <Image
              src={tesa}
              width={60}
              alt="TESA Logo"
              className="mt-[2.5rem]"
            ></Image> */}
          </div>
          {/* <Suspense fallback={<LoadingPage />}> */}
          <BallBG />
          {/* </Suspense> */}
          <div className=" flex mb-[6rem] flex-col items-center z-10">
            <p className="text-white text-center  font-semibold italic w-2/3 text-[0.9rem]">
              AI-powered tool to explore your career future.
            </p>
            <button
              onClick={handleScroll}
              className="w-[2rem] h-[2rem] mt-[1rem] bg-[#908F8F] rounded-full flex justify-center items-center"
            >
              <FiChevronDown className="w-[1.5rem] h-[1.5rem] text-[#474545]" />
            </button>
          </div>
        </div>
      </motion.div>
      {removeDiv ? (
        <motion.div
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            ease: "easeInOut",
            type: "spring",
            stiffness: 10,
            duration: 1,
          }}
          className="flex flex-col w-full p-5"
        >
          {/* <Image
            src={tesalogo}
            width={80}
            alt="TESA Logo"
            className="sticky"
          ></Image> */}
          <div className="w-7/8  overflow-scroll  flex flex-col text-center items-center text-[1.2rem] mt-[4rem] over">
            <p className="font-bold italic">
              TESA is an AI-powered tool to explore your career future.
            </p>
            <p className="mt-[1rem]">
              We are more than what we think. Your future is not pre-determined
              nor unchangeable.
            </p>
            <p className="mt-[1rem] mb-[2rem]">
              Let
              <b>
                <i> TESA </i>
              </b>
              guide you and expand your options, empowering you to craft
              <b>
                <i> multi-futures</i>
              </b>
              .
            </p>
            {/* <Image
              src={tsswheel}
              width="250"
              className="object-cover"
              alt="TESA Ring"
              // style={{ objectFit: "cover" }}
            ></Image> */}
            <p className="font-bold italic text-[2.2rem] mt-[2rem] mb-[1rem]">
              100 Tools to Craft Your Career.
            </p>
            <p>
              Make use of these different techniques to unlock possibilities.
            </p>
            {/* <div className="h-[10rem]">

            </div> */}{" "}
            {/* <Suspense fallback={<LoadingPage />}> */}
            <div className="w-full flex justify-center items-center  h-fit">
              {/* <Carousel
                images={images}
                image_labels={image_labels}
                image_description={image_description}
              ></Carousel> */}
            </div>
            {/* </Suspense> */}
            <p className="font-bold italic text-[2.2rem] mt-[2rem] mb-[1rem]">
              Discover Your Career Strengths through Task.
            </p>
            <p>
              Understand more about yourself. Find your <i>task persona.</i>
            </p>{" "}
            {/* <Suspense fallback={<LoadingPage />}> */}
            {/* <div className="flex flex-row justify-between items-center w-full p-[2rem]">
              <Image
                src={tssinfo}
                width={30}
                height={30}
                alt="Icon for Info Category"
              ></Image>
              <Image
                src={tssmental}
                width={30}
                height={30}
                alt="Icon for Mental Category"
              ></Image>
              <Image
                src={tssinteract}
                width={30}
                height={30}
                alt="Icon for Interact Category"
              ></Image>{" "}
              <Image
                src={tsswork}
                width={30}
                height={30}
                alt="Icon for Work Category"
              ></Image>
            </div>{" "} */}
            {/* </Suspense> */}
            <div
              className="w-full h-[1px]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #EFAB9D, #EFD19F, #A1D6C1, #ABB3DC)",
              }}
            ></div>
            <p className=" font-semibold mt-[2rem] mb-[2rem] italic ">
              So, are you ready to embark on your very own voyage?
            </p>
            <button
              // onClick={handleJourney}
              className="w-full p-[1rem] rounded-full font-bold mb-[4rem]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #EFAB9D, #EFD19F, #A1D6C1, #ABB3DC)",
              }}
            >
              <a href="/tools">Begin Journey</a>
            </button>
          </div>
        </motion.div>
      ) : null}

      {removeDiv ? <Navburger></Navburger> : null}
    </div>
  );
}
