"use client";
import { useChat } from "ai/react";
import logo from "/public/logo.svg";
import new_logo from "/public/new_logo.svg";
import translate from "/public/translate.svg";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import html2canvas from "html2canvas";
import ErrorModal from "../../components/ErrorModal";
import ActivePromptOutput from "./TranslatorActive";
import PlaygroundPromptOutput from "./TranslatorPlayground";



export default function TranslatorDashboard() {
  const [inputType, setInputType] = useState("text");
  const [job, setJob] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startActive, setStartActive] = useState(false);
  const [startPlayground, setStartPlayground] = useState(false);

  function handleJobChange(e) {
    const jobName = e.target.value;
    setJob(jobName);
  }

  function handleTextChange(e) {
    const textContent = e.target.value;
    setText(textContent);
  }

  function handleHobbiesChange(e) {
    const hobbiesContent = e.target.value;
    setHobbies(hobbiesContent);
  }

  return (
    <div className="flex items-start gap-10 max-w-full box-border">
      <div className="w-[30%] flex-none">
        <h3 className="font-bold text-lg mb-3">Input Type</h3>

        <select
          className="w-full p-2 bg-graylt rounded-md cursor-pointer mb-4 text-sm"
          id="optionsDropdown"
          value={inputType}
          onChange={(e) => setInputType(e.target.value)}
        >
          <option value="text">Paste Text</option>
          <option value="job">Input Job</option>
          <option value="hobby">Input Hobbies</option>
        </select>
        <h3 className="font-bold text-lg">Input</h3>
        {inputType == "text" ? (
          <p className="my-2 text-xs">
            Please submit the text you wish to convert into standardized task
            activities. This can be a job description, course description, or
            your resume content.
          </p>
        ) : null}
        {inputType == "job" ? (
          <p className="my-2 text-xs">
            Please input a job title to generate a list of its standardized task
            activities.
          </p>
        ) : null}
        {inputType == "hobby" ? (
          <p className="my-2 text-xs">
            Please input a list of hobbies and/or daily activities to generate a
            list of its standardized task activities.
          </p>
        ) : null}

        {inputType == "text" ? (
          <div className="text-black w-full flex flex-col">
            <textarea
              type="text"
              value={text}
              className="w-full p-2 bg-graylt rounded-md cursor-text mb-6 overflow-y-auto h-[50vh] text-sm"
              placeholder="Type or paste your text here..."
              onChange={handleTextChange}
            ></textarea>
          </div>
        ) : null}
        {inputType == "job" ? (
          <div className="text-black flex flex-col">
            <input
              type="text"
              className="w-full p-2 bg-graylt rounded-md cursor-text mb-6 overflow-y-auto  text-sm"
              value={job}
              onChange={handleJobChange}
              placeholder="Enter a job title here..."
            ></input>
          </div>
        ) : null}
        {inputType == "hobby" ? (
          <div className="text-black flex flex-col">
            <textarea
              type="text"
              className="w-full p-2 bg-graylt rounded-md cursor-text mb-6 overflow-y-auto h-[50vh] text-sm"
              placeholder="List down your hobbies and/or daily activities"
              value={hobbies}
              onChange={handleHobbiesChange}
            ></textarea>
          </div>
        ) : null}
        <div className="flex justify-center md:justify-start">
          {loading == true ? (
            <button
              disabled
              className="bg-[#474545] w-36 h-10 bg-opacity-50 rounded-lg my-5 text-white px-8"
            >
              <CircularProgress color="inherit" size="1.5rem" />
            </button>
          ) : (
            <button
              onClick={() => {
                setStartActive(true);
                setStartPlayground(true);
              }}
              className="tracking-[0.10rem] w-36 h-10 bg-[#474545] rounded-lg my-5 text-white"
            >
              Generate
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <ActivePromptOutput
          {...{
            startActive,
            inputType,
            setLoading,
            text,
            job,
            hobbies,
            setStartActive,
            loading,
          }}
        />
        <PlaygroundPromptOutput
          {...{
            startPlayground,
            inputType,
            setLoading,
            text,
            job,
            hobbies,
            setStartPlayground,
            loading,
          }}
        />
      </div>

      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
    </div>
  );
}

