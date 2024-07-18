"use client";

import { useChat } from "ai/react";
import translate from "/public/translate.svg";
import Image from "next/image";
import { useState, useRef } from "react";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Link from "next/link";
import CircularProgress from "@mui/material/CircularProgress";
import DownloadIcon from "@mui/icons-material/Download";
import html2canvas from "html2canvas";

export default function Chat() {
  const { messages, append, input, handleInputChange, handleSubmit, setInput } =
    useChat();
  // can be text, job, hobby
  const [inputType, setInputType] = useState("text");
  const [job, setJob] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [text, setText] = useState("");
  const [response, setResponse] = useState([]);
  const [IWAs, setIWAs] = useState([]);
  const responseRef = useRef(null);
  const [user, setUser] = useState(generateID());
  const [loading, setLoading] = useState(false);

  function generateID() {
    let id = "";
    const characters = "0123456789";
    const length = 7;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      id += characters.charAt(randomIndex);
    }

    return id;
  }


  function handleGenerate() {
    setLoading(true);
    if (inputType === "text") {
      getTasks("text", text);
    } else if (inputType === "job") {
      getTasks("job", job);
    } else if (inputType === "hobby") {
      getTasks("hobby", hobbies);
    }
  }

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

  function restartPage() {
    setIWAs([]);
    setHobbies("");
    setText("");
    setJob("");
    generateID();
    location.reload();
  }

  async function invokeTask(tasklist) {
    try {
      // Data to send in the request body

      const requestData = {
        user_id: user,
        task: tasklist,
      };
      console.log(requestData);
      // Call the first API with data in the request body
      const response1 = await fetch("/api/invokeTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
        // body: requestData,
      });
      const data1 = await response1.json();
      console.log("Response from first API:", data1);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function getIWAs(tasklist) {
    try {
      let noOfTasksInQueue = Infinity; // Set initially to a large number
      while (noOfTasksInQueue > 0) {
        const requestData = {
          user_id: user,
          task: tasklist,
        };
        console.log(requestData);

        const response = await fetch("/api/tasktoIWA", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
        const data = await response.json();
        console.log("Response from API:", data);

        noOfTasksInQueue = data.no_of_tasks_in_queue; // Update the variable

        if (noOfTasksInQueue > 0) {
          const iwas = data.body;
          const iwa_arr = JSON.parse(iwas);
          setIWAs(iwa_arr);
        } else {
          console.log("No tasks in queue. Exiting loop.");
          console.log("process remainder");
          const iwas = data.body;
          const iwa_arr = JSON.parse(iwas);
          setIWAs(iwa_arr);
          setLoading(false);
        }

        // Optional: Add a delay between API calls to avoid flooding the server
        await new Promise((resolve) => setTimeout(resolve, 3000)); // 1 second delay
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  const downloadImage = async () => {
    const resultsDiv = document.getElementById("results");

    // Get the full scroll height of the div
    const fullHeight = resultsDiv.scrollHeight;

    // Set the div height to its full scrollable height
    resultsDiv.style.height = fullHeight + "px";

    try {
      // Use html2canvas to capture the entire contents of the div
      const canvas = await html2canvas(resultsDiv);

      // Reset the div height to its original size
      resultsDiv.style.height = "";

      // Create a download link for the captured image
      const link = document.createElement("a");
      link.download = "translate_tasks.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Error capturing image:", error);
    }
  };

  async function getTasks(type, content) {
    let userMessage;
    if (type === "text") {
      userMessage = `${content} Extract and summarize the tasks from the text into a set of sentences and return them such that each task is numbered. Keep each sentence shorter than 10 words.`;
    } else if (type === "job") {
      userMessage = `Create a list of tasks for the job: ${content}, even if the job does not exist yet, into a set of sentences and return them such that each task is numbered. Keep each sentence shorter than 10 words.`;
    } else if (type === "hobby") {
      userMessage = `For each hobby or daily activity in this list: ${content}, convert them into task sentences, each shorter than 10 words and return them such that each task is numbered.`;
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: userMessage,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      console.log("Raw response text:", responseText);

      const sentences = responseText
        .split(/\d+\.\s/)
        .map((sentence) => sentence.replace(/\n/g, ""))
        .filter((sentence) => sentence.trim() !== "");

      setResponse(sentences);
      console.log(sentences);

      invokeTask(sentences);
      setTimeout(() => {
        getIWAs(sentences);
      }, 3000);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="flex flex-col md:flex-row w-full md:h-full ">
      <div className="flex flex-col w-full md:w-1/2 h-full  tracking-[0.10rem]">
        <div className="w-full">
          <div className="px-10 pt-5 md:w-2/3">
            <div className="flex flex-row items-center py-2 font-medium">
              <Image
                src={translate}
                width={40}
                alt="Logo"
                className="text-lg"
              ></Image>
              <h3 className="ml-5 text-xl tracking-[0.10rem]">
                Task Translator
              </h3>
            </div>
            <p className="text-xs tracking-[0.10rem]">
              Translate your daily tasks into industry-recognized activities to
              provide a clear, standardized representation of your professional
              contributions.
            </p>
          </div>
          <div className="px-10 pt-5 pb-5 justify-between">
            <button
              className={` pr-2 tracking-[0.10rem] ${
                inputType == 'text' ? "text-md text-[#555555]" : "text-sm text-gray-400"
              }`}
              onClick={() => setInputType("text")}
            >
              Paste Text
            </button>
            |
            <button
              className={` px-2 tracking-[0.10rem] ${
                inputType == 'job' ? "text-md text-[#555555]" : "text-sm text-gray-400"
              }`}
              onClick={() => setInputType("job")}
            >
              Input Job
            </button>
            |
            <button
              className={` px-2 tracking-[0.10rem] ${
                inputType == 'hobby'
                  ? "text-md text-[#555555]"
                  : "text-sm text-gray-400"
              }`}
              onClick={() => setInputType("hobby")}
            >
              Input Hobbies
            </button>
          </div>
          { inputType == 'text' ? (
            <p className="px-10 text-xs mb-5">
              Please submit the text you wish to convert into standardized task
              activities. This can be a job description, course description, or
              your resume content.
            </p>
          ) : null}
          {inputType == 'job' ? (
            <p className="px-10 text-xs  mb-5">
              Please input a job title to generate a list of its standardized
              task activities.
            </p>
          ) : null}
          {inputType == 'hobby' ? (
            <p className="px-10 text-xs  mb-5">
              Please input a list of hobbies and/or daily activities to generate
              a list of its standardized task activities.
            </p>
          ) : null}
        </div>

        {inputType == 'text' ? (
          <div className="px-10 text-black w-full flex flex-col">
            <textarea
              type="text"
              value={text}
              className="tracking-[0.10rem] w-full h-[15rem] p-2 bg-[#D9D9D9] text-[#555555] rounded-md"
              placeholder="Type or paste your text here..."
              onChange={handleTextChange}
            ></textarea>
          </div>
        ) : null}
        {inputType == 'job' ? (
          <div className="px-10 text-black flex flex-col">
            <input
              type="text"
              className=" tracking-[0.10rem] w-full p-2 bg-[#D9D9D9] text-[#555555] rounded-md "
              value={job}
              onChange={handleJobChange}
              placeholder="Enter a job title here..."
            ></input>
          </div>
        ) : null}
        {inputType == 'hobby' ? (
          <div className="px-10 text-black flex flex-col">
            <textarea
              type="text"
              className="tracking-[0.10rem] w-full h-[15rem] p-2 bg-[#D9D9D9] text-[#555555] rounded-md"
              placeholder="List down your hobbies and/or daily activities"
              value={hobbies}
              onChange={handleHobbiesChange}
            ></textarea>
          </div>
        ) : null}
        <div className="px-10 flex justify-between">
          <button
            onClick={handleGenerate}
            className=" bg-[#474545] py-2 text-white w-1/4 tracking-[0.10rem] rounded-md mt-5 text-center"
          >
            Generate
          </button>
          <button
            onClick={restartPage}
            className=" bg-[#737171] py-2 px-5 text-white w-1/4 tracking-[0.10rem] rounded-md mt-5 text-center"
          >
            <RestartAltIcon className="mr-3 text-[1.5rem]"></RestartAltIcon>
            Reset
          </button>
          <button
            onClick={downloadImage}
            className=" bg-[#737171] py-2 px-5 w-1/4 text-white tracking-[0.10rem] rounded-md mt-5 text-center"
          >
            <DownloadIcon className="mr-3 text-[1.5rem]" />
            Save
          </button>
        </div>
      </div>

      <div className="flex flex-col w-full md:w-1/2 md:h-full m-5">
        <div className="w-full md:h-2/5 "></div>
        {loading ? (
          <div className="w-full  flex">
            <CircularProgress color="inherit" />
          </div>
        ) : null}

        <div className="w-full h-3/5 pb-10 " id="results">
          {IWAs.map((iwa, index) => (
            <div className="flex flex-row items-center" key={index}>
              <p className=" ml-2 pb-2 tracking-[0.10rem]">{iwa}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
