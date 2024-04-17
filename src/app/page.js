"use client";

import { useChat } from "ai/react";
import logo from "/public/logo.svg";
import compare_logo from "/public/compare.svg";
import line from "/public/line.png";
import new_logo from "/public/new_logo.svg";
import translate from "/public/translate.svg";
import transition from "/public/transition.svg";
import temp from "/public/temp.png";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import OpenAI from "openai";
import html2canvas from "html2canvas";
import Link from "next/link";
import translate_gif from "/public/translate2.gif";
import compare_gif from "/public/compare2.gif";
import transition_gif from "/public/transition2.gif";

export default function Page() {
  const [expand, setExpand] = useState(false);
  function handleTranslate() {}
  function handleCompare() {}
  function handleTransition() {}
  function handleExpand() {
    setExpand(true);
  }
  function handleMinimise() {
    setExpand(false);
  }

  return (
    <div className="bg-[#F6F6F6] w-screen h-screen flex flex-col overflow-scroll">
      {" "}
      <div className=" bg-[#474545] h-[3.5rem] w-full flex justify-center items-center"></div>
      <div className="max-w-screen max-h-screen w-screen h-screen flex flex-col items-center text-[#555555] overflow-scroll">
        {" "}
        <div className="w-full flex flex-col mt-[2rem] items-center ">
          <Image src={new_logo} width={100} alt="Logo" className="m-2"></Image>
          <h1 className="text-xl tracking-[1rem] mt-2 text-center font-medium">
            STAK
          </h1>
          {expand ? (
            <div className="flex flex-col ml-[13rem] text-xl tracking-[1rem] text-start mb-[3rem]">
              <h1>Skills</h1> <h1 className="ml-[1.5rem]">Tasks</h1>
              <h1 className="ml-[3rem]">Ai</h1>{" "}
              <h1 className="ml-[4.5rem]">Knowledge</h1>
              <h1 className="ml-[3rem]">Alignment</h1>
              <h1 className="ml-[1.5rem]">Transition</h1>
              <h1>Suite</h1>
            </div>
          ) : null}
        </div>
        <p className="text-lg tracking-[0.15rem] m-2 ">
          Craft Your Career with Task.
        </p>
        <div className="flex flex-col w-1/2 tracking-[0.15rem] ">
          <p className="  text-xs">
            Step forward into a future where your career choices are aligned
            with your distinct skills and aspirations. Translate your daily
            tasks into industry-recognized activities, revealing tailored career
            opportunities that resonate with your professional essence.
          </p>
          {expand ? (
            <div className="flex flex-col mt-[2rem] track-[0.15rem] gap-[1rem] text-xs">
              <p className="font-bold mt-[1rem]"> WHY TASKS?</p>
              <p>
                Tasks are the specific activities and responsibilities that make
                up a job, offering a clear picture of the day-to-day work. This
                approach helps individuals and organizations understand not just
                the skills needed, but how those skills are applied in real work
                situations. It allows for better alignment between a person’s
                capabilities and the job's demands, leading to more effective
                job matching, career development, and workforce planning.
              </p>
              <p className="font-bold mt-[1rem]">
                WHERE DOES AI COMES INTO STAK
              </p>{" "}
              <p>
                STAK uses AI to improve the accuracy of its assessments. We use
                it to study your portfolio and to build an accurate picture of
                your capabilities. AI also powers many of our algorithms for
                planning your career transitions.
              </p>
            </div>
          ) : null}
          {expand ? (
            <button
              onClick={handleMinimise}
              className="self-start underline text-xs font-bold mt-[3rem] tracking-[0.15rem]"
            >
              RETURN
            </button>
          ) : (
            <button
              onClick={handleExpand}
              className="self-start underline  text-xs font-bold mt-5 tracking-[0.15rem]"
            >
              FIND OUT MORE
            </button>
          )}
        </div>
        <div className="w-1/2 flex flex-row mt-5 justify-between">
          <Link href="/translate">
            <div className=" flex flex-col justify-center items-center">
              <Image
                src={translate}
                width={80}
                alt="Logo"
                className="m-2"
              ></Image>
              <h1 className="text-xs tracking-[0.15rem]  text-center ">
                Task Translator
              </h1>
            </div>
          </Link>
          <div className="flex justify-center items-center">
            <Image src={line} width={30} alt="Logo" className="m-2"></Image>
          </div>{" "}
          <Link href="/compare">
            <div className=" flex flex-col justify-center items-center">
              <Image
                src={compare_logo}
                width={70}
                alt="Logo"
                className="m-2"
              ></Image>
              <h1 className="text-xs tracking-[0.15rem]  text-center ">
                Task STAK Compare
              </h1>
            </div>
          </Link>
          <div className="flex justify-center items-center">
            <Image src={line} width={30} alt="Logo" className="m-2"></Image>
          </div>
          <Link href="/transition">
            <div className=" flex flex-col justify-center items-center">
              <Image
                src={transition}
                width={70}
                alt="Logo"
                className="m-2"
              ></Image>
              <h1 className="text-xs tracking-[0.15rem] text-center ">
                Transition Generator
              </h1>
            </div>{" "}
          </Link>
        </div>
        <div className="flex flex-col w-full mt-[8rem] gap-[5rem]">
          <div className="flex flex-row w-full">
            <div className="w-1/2 flex flex-row p-10 justify-center items-center">
              <Image
                src={translate}
                alt="translate"
                className="w-1/4 pr-5"
              ></Image>
              <div className="flex flex-col gap-4 tracking-[0.15rem]">
                <p className="text-lg  font-medium">TASK TRANSLATOR</p>
                <p className="text-xs ">
                  Translate your daily tasks into industry-recognized activities
                  to provide a clear, standardized representation of your
                  professional contributions.
                </p>
                <Link href="/translate">
                  <button className="self-start text-xs  underline font-bold ">
                    TRY NOW
                  </button>{" "}
                </Link>
              </div>
            </div>

            <Image src={translate_gif} alt="gif" className="w-1/2"></Image>
          </div>
          <div className="flex flex-row w-full ">
            <Image src={compare_gif} alt="gif" className="w-1/2"></Image>
            <div className="w-1/2 flex flex-row p-10 justify-center items-center">
              <Image
                src={compare_logo}
                alt="compare"
                className="w-1/4 pr-5"
              ></Image>
              <div className="flex flex-col gap-4 tracking-[0.15rem]">
                <p className="text-lg  font-medium">TASK STAK COMPARE</p>
                <p className="text-xs ">
                  Compare and evaluate your career activities against other task
                  portfolios, identifying overlaps and gaps. Infer strategic
                  insights into your career development and gain clarity on how
                  your experiences can align with various industry roles.
                </p>
                <Link href="/compare">
                  <button className="self-start text-xs underline font-bold ">
                    TRY NOW
                  </button>{" "}
                </Link>
              </div>
            </div>
          </div>{" "}
          <div className="flex flex-row w-full">
            <div className="w-1/2 flex flex-row p-10 justify-center items-center">
              <Image
                src={transition}
                alt="transition"
                className="w-1/4 pr-5"
              ></Image>
              <div className="flex flex-col gap-4 tracking-[0.15rem]">
                <p className="text-lg  font-medium">TRANSITION GENERATOR</p>
                <p className="text-xs ">
                  Uncover potential career paths with our transition generation
                  tool, which leverages your task-based profile to suggest roles
                  that match your skills and experiences. This capability
                  empowers you to make informed decisions about your career
                  trajectory.
                </p>{" "}
                <Link href="/transition">
                  <button className="self-start text-xs  underline font-bold ">
                    TRY NOW
                  </button>{" "}
                </Link>
              </div>
            </div>

            <Image src={transition_gif} alt="gif" className="w-1/2"></Image>
          </div>
        </div>
        <p className="mt-[12rem] text-xs mb-[6rem]">Copyright © 2024.</p>
      </div>
    </div>
  );
}
