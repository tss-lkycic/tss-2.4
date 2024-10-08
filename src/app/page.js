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
    <div className="flex flex-col">
      <div className="flex flex-col items-center">
        <div className="w-full flex flex-col mt-[2rem] items-center">
          <Image src={new_logo} width={100} alt="Logo" className="m-2"></Image>
          <h1 className="text-xl tracking-[1rem] mt-2 text-center font-medium">
            STAK
          </h1>
        </div>
        <p className="text-lg tracking-[0.15rem] px-6 text-center mt-4">
          Craft Your Career with Task.
        </p>
        <div className="flex flex-col md:w-1/2 w-full px-6 tracking-[0.15rem] ">
          <p className="text-xs mb-4">
            Step forward into a future where your career choices are aligned
            with your distinct skills and aspirations. Translate your daily
            tasks into industry-recognized activities, revealing tailored career
            opportunities that resonate with your professional essence.
          </p>
          {expand ? (
            <>
              <div className="flex justify-center">
                <div className="flex flex-col text-xl tracking-[1rem] text-start my-3 md:w-1/2 w-full">
                  <h1>
                    <b>S</b>kills
                  </h1>
                  <h1 className="ml-[1.5rem]">
                    <b>T</b>asks
                  </h1>
                  <h1 className="ml-[3rem]">
                    <b>A</b>i
                  </h1>
                  <h1 className="ml-[4.5rem]">
                    <b>K</b>nowledge
                  </h1>
                  <h1 className="ml-[3rem]">
                    <b>A</b>lignment
                  </h1>
                  <h1 className="ml-[1.5rem]">
                    <b>T</b>ransition
                  </h1>
                  <h1>
                    <b>S</b>uite
                  </h1>
                </div>
              </div>
              <div className="flex flex-col md:mt-4 track-[0.15rem] gap-y-4 mb-6 mt-5 text-xs">
                <div>
                  <p className="font-bold"> WHY TASKS?</p>
                  <p>
                    Tasks are the specific activities and responsibilities that
                    make up a job, offering a clear picture of the day-to-day
                    work. This approach helps individuals and organizations
                    understand not just the skills needed, but how those skills
                    are applied in real work situations. It allows for better
                    alignment between a person’s capabilities and the job's
                    demands, leading to more effective job matching, career
                    development, and workforce planning.
                  </p>
                </div>
                <div>
                  <p className="font-bold">WHERE DOES AI COMES INTO STAK</p>
                  <p className="">
                    STAK uses AI to improve the accuracy of its assessments. We
                    use it to study your portfolio and to build an accurate
                    picture of your capabilities. AI also powers many of our
                    algorithms for planning your career transitions.
                  </p>
                </div>
              </div>
            </>
          ) : null}
          {expand ? (
            <button
              onClick={handleMinimise}
              className="md:self-start self-center underline text-xs font-bold tracking-[0.15rem]"
            >
              RETURN
            </button>
          ) : (
            <button
              onClick={handleExpand}
              className="md:self-start self-center underline  text-xs font-bold tracking-[0.15rem]"
            >
              FIND OUT MORE
            </button>
          )}
        </div>

        {/* nav icons */}
        <div className="sm:w-1/2 flex flex-row mt-5 justify-between md:gap-x-2 px-2 md:px-0">
          <Link href="/translate">
            <div className=" flex flex-col justify-center items-center h-24 w-24">
              <Image
                src={translate}
                alt="Logo"
                className="m-2 w-10 md:w-16"
              ></Image>
              <h1 className="md:text-xs text-[10px] tracking-[0.15rem]  text-center ">
                Task Translator
              </h1>
            </div>
          </Link>
          <div className="flex justify-center items-center ">
            <Image src={line} alt="Logo" className="m-2 w-3 md:w-6"></Image>
          </div>
          <Link href="/compare">
            <div className=" flex flex-col justify-center items-center h-24 w-24">
              <Image
                src={compare_logo}
                alt="Logo"
                className="m-2 w-10 md:w-14"
              ></Image>
              <h1 className="md:text-xs text-[10px] tracking-[0.15rem] text-center ">
                Task STAK Compare
              </h1>
            </div>
          </Link>
          <div className="flex justify-center items-center ">
            <Image src={line} alt="Logo" className="m-2 w-3 md:w-6"></Image>
          </div>
          <Link href="/transition">
            <div className=" flex flex-col justify-center items-center h-24 w-24">
              <Image
                src={transition}
                alt="Logo"
                className="m-2 w-9 md:w-14"
              ></Image>
              <h1 className="md:text-xs text-[10px] tracking-[0.15rem] text-center ">
                Transition Generator
              </h1>
            </div>
          </Link>
        </div>

        {/* landing pages */}
        <div className="flex flex-col w-full md:mt-20 mt-3 md:gap-y-20 gap-y-10">
          <div className="flex flex-col md:flex-row w-full justify-center items-center">
            <div className="w-full md:w-1/2 flex flex-row md:p-10 px-6 py-8 justify-center items-center">
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
                  </button>
                </Link>
              </div>
            </div>
            <Image
              src={translate_gif}
              alt="gif"
              className=" w-3/4 md:w-1/2"
            ></Image>
          </div>
          <div className="flex flex-col md:flex-row w-full justify-center items-center">
            <Image
              src={compare_gif}
              alt="gif"
              className="w-1/2 md:block hidden"
            ></Image>
            <div className="w-full md:w-1/2 flex flex-row md:p-10 px-6 py-8 justify-center items-center">
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
                  </button>
                </Link>
              </div>
            </div>
            <Image
              src={compare_gif}
              alt="gif"
              className="w-3/4 md:hidden"
            ></Image>
          </div>
          <div className="flex flex-col md:flex-row w-full justify-center items-center">
            <div className="w-full md:w-1/2 flex flex-row md:p-10 px-6 py-8 justify-center items-center">
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
                </p>
                <Link href="/transition">
                  <button className="self-start text-xs  underline font-bold ">
                    TRY NOW
                  </button>
                </Link>
              </div>
            </div>
            <Image
              src={transition_gif}
              alt="gif"
              className="w-3/4 md:w-1/2"
            ></Image>
          </div>
        </div>
        <p className="text-xs mb-6 mt-20">Copyright © 2024.</p>
      </div>
    </div>
  );
}
