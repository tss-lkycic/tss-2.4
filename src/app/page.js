"use client";

import { useChat } from "ai/react";
import logo from "/public/logo.svg";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import OpenAI from "openai";

export default function Chat() {
  const { messages, append, input, handleInputChange, handleSubmit, setInput } =
    useChat();

  const [dropdownLabel, setDropdownLabel] = useState("Text");
  const [queryURL, setQueryURl] = useState(false);
  const [queryText, setQueryText] = useState(true);
  const [queryPDF, setQueryPDF] = useState(false);
  const [queryJob, setQueryJob] = useState(false);
  const [job, setJob] = useState("");
  const [text, setText] = useState("");
  const [response, setResponse] = useState([]);
  const [IWAs, setIWAs] = useState([]);
  const responseRef = useRef(null);
  useEffect(() => {
    const latestResponse = Object.values(messages).pop();

    if (latestResponse) {
      const role = latestResponse.role;
      if (role !== "user") {
        // const sentences = latestResponse.content.split(", ");
        const sentences = latestResponse.content
          .split(/\d+\.\s/)
          .map((sentence) => sentence.replace(/\n/g, ""))
          .filter((sentence) => sentence.trim() !== "");
        setResponse(sentences);
        // fetchData(sentences);
      } else {
        setResponse([]);
      }
    }
  }, [messages]);

  useEffect(() => {
    console.log(IWAs);
  }, [IWAs]);

  useEffect(() => {
    // Store the current response in a ref
    responseRef.current = response;

    // Set a timeout to trigger fetchData after a short delay
    const timeout = setTimeout(() => {
      // Check if both response and responseRef are not empty lists and the response is stable (i.e., not changed during the delay)
      if (
        responseRef.current !== null &&
        responseRef.current.length > 0 &&
        responseRef.current === response
      ) {
        // If response is stable and not empty, call fetchData
        console.log("This is the latest response:", response);
        fetchData(response);
      }
    }, 3000); // Adjust the delay time as needed

    // Cleanup the timeout if response changes before the delay ends
    return () => clearTimeout(timeout);
  }, [response]);

  function generateID() {
    let id = "";
    const characters = "0123456789";
    const length = 5;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      id += characters.charAt(randomIndex);
    }

    return id;
  }

  function handleSelectItem(value) {
    setDropdownLabel(value);
    if (value === "URL") {
      setQueryURl(true);
      setQueryText(false);
      setQueryPDF(false);
      setQueryJob(false);
    } else if (value === "Text") {
      setQueryURl(false);
      setQueryText(true);
      setQueryPDF(false);
      setQueryJob(false);
    } else if (value === "PDF") {
      setQueryURl(false);
      setQueryText(false);
      setQueryPDF(true);
      setQueryJob(false);
    } else if (value === "Job") {
      setQueryURl(false);
      setQueryText(false);
      setQueryPDF(false);
      setQueryJob(true);
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
  function handleURLChange(e) {
    const urlLink = e.target.value;
    setURL(urlLink);
  }
  function handleFileChange(e) {
    console.log(e.target);
  }
  function processIWA(array) {
    console.log(array);
    let iwa_list = [];
    for (let i = 0; i < array.length; i++) {
      const iwa_pair = array[i];
      const result_iwa = iwa_pair[1];
      iwa_list.push(result_iwa);
    }
    console.log(iwa_list, "helo");
    iwa_list = Array.from(new Set(iwa_list));
    console.log(iwa_list, "helo2");
    setIWAs(iwa_list);
  }

  function getTasksFromText() {
    const userText = text;
    append({
      role: "user",
      content:
        userText +
        // "Summarise the tasks from the text into a set of task sentences. It is very important that each task sentence itself should not have any comma inside. Each task sentence should also begin with a capital letter. Return all task sentences in a single string where each task sentence is separated by a comma. ",
        "Extract and summarise the tasks from the text into a set of sentences and return them such that each task is numbered. ",
    });
  }

  const [result1, setResult1] = useState("");
  const [result2, setResult2] = useState("");

  async function fetchData(tasklist) {
    try {
      // Data to send in the request body

      const requestData = {
        user_id: generateID(),
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
      console.log("helo, Response from first API:", data1);

      // Call the second API with data in the request body
      const response2 = await fetch("/api/tasktoIWA", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      const data2 = await response2.json();
      console.log("Response from second API:", data2);
      const iwas = data2.body;
      const iwa_arr = JSON.parse(iwas);
      processIWA(iwa_arr);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function getTasksFromFile() {}
  function getTasksFromURL() {}
  function getTasksFromJob() {
    const userJob = job;
    append({
      role: "user",
      content:
        "Create a list of tasks for the job," +
        userJob +
        "," +
        "  even if the job does not exist yet, into a set of sentences and return them such that each task is numbered. ",
    });
  }

  return (
    <div className="bg-gradient-to-b from-[#464444] to-black w-screen h-screen flex flex-col">
      <Image src={logo} width={60} alt="Logo" className="m-5"></Image>
      <div className="flex flex-row w-full h-full">
        <div className="flex flex-col w-1/2 h-full">
          <h3 className="pl-5 pt-10 font-semibold">Select type</h3>
          <div className="p-5">
            <button
              className={` pr-2 ${
                queryText ? "text-xl text-white" : "text-md text-gray-400"
              }`}
              onClick={() => handleSelectItem("Text")}
            >
              Text
            </button>
            |
            <button
              className={` px-2 ${
                queryURL ? "text-xl text-white" : "text-md text-gray-400"
              }`}
              onClick={() => handleSelectItem("URL")}
            >
              URL
            </button>
            |
            <button
              className={` px-2 ${
                queryPDF ? "text-xl text-white" : "text-md text-gray-400"
              }`}
              onClick={() => handleSelectItem("PDF")}
            >
              PDF
            </button>
            |
            <button
              className={` px-2 ${
                queryJob ? "text-xl text-white" : "text-md text-gray-400"
              }`}
              onClick={() => handleSelectItem("Job")}
            >
              Job
            </button>
          </div>
          {queryText ? (
            <div className="pl-5 text-black w-full flex flex-col">
              <textarea
                type="text"
                className="w-full h-[20rem] p-2"
                placeholder="Type or paste your text here..."
                onChange={handleTextChange}
              ></textarea>
              <button
                onClick={getTasksFromText}
                className=" bg-gray-500 p-2 mt-2  w-fit text-white self-end"
              >
                Get Tasks from Text
              </button>
            </div>
          ) : null}
          {queryURL ? (
            <div className="pl-5 text-black flex flex-col">
              <input
                type="text"
                className="w-full p-2"
                placeholder="Enter a URL here..."
                onChange={handleURLChange}
              ></input>
              <button
                onClick={getTasksFromURL}
                className=" bg-gray-500 p-2 mt-2  w-fit text-white self-end"
              >
                Get Tasks from URL
              </button>
            </div>
          ) : null}
          {queryPDF ? (
            <div className="pl-5 text-black  flex flex-col">
              <input
                type="file"
                className="text-white"
                onChange={handleFileChange}
              ></input>
              <button
                onClick={getTasksFromFile}
                className=" bg-gray-500 p-2 mt-2  w-fit text-white self-end"
              >
                Get Tasks from File
              </button>
            </div>
          ) : null}
          {queryJob ? (
            <div className="pl-5 text-black flex flex-col">
              <input
                type="text"
                className="w-1/2 p-2"
                value={job}
                onChange={handleJobChange}
                placeholder="Enter a job title here..."
              ></input>
              <button
                onClick={getTasksFromJob}
                className=" bg-gray-500 p-2 mt-2  w-fit text-white self-end"
              >
                Get Tasks from Job
              </button>
            </div>
          ) : null}
        </div>

        <div className="flex flex-col w-1/2 h-full p-5">
          <p className=" text-3xl font-bold mb-2">Tasks from text: </p>
          {response.map((r) => (
            <div key={r.id}>
              <p className="text-white text-xl pb-1">•{r}</p>
            </div>
          ))}
          <p className="text-3xl font-bold mb-2">IWAs from tasks: </p>
          {IWAs.map((iwa) => (
            <div key={iwa.id}>
              <p className="text-white text-xl pb-1">•{iwa}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
