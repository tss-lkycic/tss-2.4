"use client";

import { useChat } from "ai/react";
import logo from "/public/logo.svg";
import new_logo from "/public/new_logo.svg";
import translate from "/public/translate.svg";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import OpenAI from "openai";
import html2canvas from "html2canvas";

export default function Page() {
  return (
    <div className="bg-[#F6F6F6] w-screen h-screen flex flex-col overflow-scroll"></div>
  );
}
