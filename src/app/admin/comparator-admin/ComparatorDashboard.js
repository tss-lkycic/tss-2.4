"use client";

import { useChat } from "ai/react";
import logo from "/public/logo.svg";
import new_logo from "/public/new_logo.svg";
import compare from "/public/compare.svg";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import html2canvas from "html2canvas";
import ErrorModal from "../../components/ErrorModal";
import ActivePromptOutput from "./ComparatorActive";
import PlaygroundPromptOutput from "./ComparatorPlayground";

export default function ComparatorDashboard() {

  // can be text, job, hobby
  const [inputAType, setInputAType] = useState("text");
  const [inputBType, setInputBType] = useState("text");

  const [jobA, setJobA] = useState("");
  const [hobbiesA, setHobbiesA] = useState("");
  const [textA, setTextA] = useState("");

  const [jobB, setJobB] = useState("");
  const [hobbiesB, setHobbiesB] = useState("");
  const [textB, setTextB] = useState("");

  const [loadingActive, setLoadingActive] = useState(false);
  const [loadingPlayground, setLoadingPlayground] = useState(false);

  const [error, setError] = useState(null);
  const [startActive, setStartActive] = useState(false)
  const [startPlayground, setStartPlayground] = useState(false)


  function handleJobAChange(e) {
    const jobName = e.target.value;
    setJobA(jobName);
  }

  function handleTextAChange(e) {
    const textContent = e.target.value;
    setTextA(textContent);
  }

  function handleHobbiesAChange(e) {
    const hobbiesContent = e.target.value;
    setHobbiesA(hobbiesContent);
  }

  function handleJobBChange(e) {
    const jobName = e.target.value;
    setJobB(jobName);
  }

  function handleTextBChange(e) {
    const textContent = e.target.value;
    setTextB(textContent);
  }

  function handleHobbiesBChange(e) {
    const hobbiesContent = e.target.value;
    setHobbiesB(hobbiesContent);
  }


  return (
    <div className="flex items-start gap-10 max-w-full box-border">
      <div className="w-[30%] flex-none">
        <h3 className="font-bold text-lg mb-3">Input A Type</h3>

        <select
          className="w-full p-2 bg-graylt rounded-md cursor-pointer mb-4 text-sm"
          id="optionsDropdown"
          value={inputAType}
          onChange={(e) => setInputAType(e.target.value)}
        >
          <option value="text">Paste Text</option>
          <option value="job">Input Job</option>
          <option value="hobby">Input Hobbies</option>
        </select>
        <h3 className="font-bold text-lg">Input A</h3>
        {inputAType == "text" ? (
          <p className="my-2 text-xs">
            Please submit the text you wish to convert into standardized task
            activities. This can be a job description, course description, or
            your resume content.
          </p>
        ) : null}
        {inputAType == "job" ? (
          <p className="my-2 text-xs">
            Please input a job title to generate a list of its standardized
            task activities.
          </p>
        ) : null}
        {inputAType == "hobby" ? (
          <p className="my-2 text-xs">
            Please input a list of hobbies and/or daily activities to generate
            a list of its standardized task activities.
          </p>
        ) : null}

        {inputAType == "text" ? (
          <div className="text-black w-full flex flex-col">
            <textarea
              type="text"
              value={textA}
              className="w-full p-2 bg-graylt rounded-md cursor-text mb-6 overflow-y-auto h-[30vh] text-sm"
              placeholder="Type or paste your text here..."
              onChange={handleTextAChange}
            ></textarea>
          </div>
        ) : null}
        {inputAType == "job" ? (
          <div className="text-black flex flex-col">
            <input
              type="text"
              className="w-full p-2 bg-graylt rounded-md cursor-text mb-6 overflow-y-auto  text-sm"
              value={jobA}
              onChange={handleJobAChange}
              placeholder="Enter a job title here..."
            ></input>
          </div>
        ) : null}
        {inputAType == "hobby" ? (
          <div className="text-black flex flex-col">
            <textarea
              type="text"
              className="w-full p-2 bg-graylt rounded-md cursor-text mb-6 overflow-y-auto h-[30vh] text-sm"
              placeholder="List down your hobbies and/or daily activities"
              value={hobbiesA}
              onChange={handleHobbiesAChange}
            ></textarea>
          </div>
        ) : null}
        <div className="w-full h-[1px] bg-graylt mb-2"></div>
        <h3 className="font-bold text-lg mb-3">Input B Type</h3>

        <select
          className="w-full p-2 bg-graylt rounded-md cursor-pointer mb-4 text-sm"
          id="optionsDropdown"
          value={inputBType}
          onChange={(e) => setInputBType(e.target.value)}
        >
          <option value="text">Paste Text</option>
          <option value="job">Input Job</option>
          <option value="hobby">Input Hobbies</option>
        </select>
        <h3 className="font-bold text-lg">Input B</h3>
        {inputBType == "text" ? (
          <p className="my-2 text-xs">
            Please submit the text you wish to convert into standardized task
            activities. This can be a job description, course description, or
            your resume content.
          </p>
        ) : null}
        {inputBType == "job" ? (
          <p className="my-2 text-xs">
            Please input a job title to generate a list of its standardized
            task activities.
          </p>
        ) : null}
        {inputBType == "hobby" ? (
          <p className="my-2 text-xs">
            Please input a list of hobbies and/or daily activities to generate
            a list of its standardized task activities.
          </p>
        ) : null}

        {inputBType == "text" ? (
          <div className="text-black w-full flex flex-col">
            <textarea
              type="text"
              value={textB}
              className="w-full p-2 bg-graylt rounded-md cursor-text mb-6 overflow-y-auto h-[50vh] text-sm"
              placeholder="Type or paste your text here..."
              onChange={handleTextBChange}
            ></textarea>
          </div>
        ) : null}
        {inputBType == "job" ? (
          <div className="text-black flex flex-col">
            <input
              type="text"
              className="w-full p-2 bg-graylt rounded-md cursor-text mb-6 overflow-y-auto  text-sm"
              value={jobB}
              onChange={handleJobBChange}
              placeholder="Enter a job title here..."
            ></input>
          </div>
        ) : null}
        {inputBType == "hobby" ? (
          <div className="text-black flex flex-col">
            <textarea
              type="text"
              className="w-full p-2 bg-graylt rounded-md cursor-text mb-6 overflow-y-auto h-[50vh] text-sm"
              placeholder="List down your hobbies and/or daily activities"
              value={hobbiesB}
              onChange={handleHobbiesBChange}
            ></textarea>
          </div>
        ) : null}
        <div className="flex justify-center md:justify-start">
          {loadingActive && loadingPlayground ? (
            <button
              disabled
              className="bg-[#474545] w-36 h-10 bg-opacity-50 rounded-lg my-5 text-white px-8"
            >
              <CircularProgress color="inherit" size="1.5rem" />
            </button>
          ) : (
            <button
              onClick={() => {
                setStartActive(true)
                setStartPlayground(true)
              }}
              className="tracking-[0.10rem] w-36 h-10 bg-[#474545] rounded-lg my-5 text-white"
            >
              Generate
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <ActivePromptOutput {...{ startActive, inputAType, inputBType, setLoadingActive, textA, jobA, hobbiesA, textB, jobB, hobbiesB, setStartActive, loadingActive }} />
        <PlaygroundPromptOutput {...{ startPlayground, inputAType, inputBType, setLoadingPlayground, textA, jobA, hobbiesA, textB, jobB, hobbiesB, setStartPlayground, loadingPlayground }} />

      </div>


      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
    </div>
  );
}





