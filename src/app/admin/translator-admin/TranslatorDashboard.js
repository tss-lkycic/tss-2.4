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
import { translatePrompts } from "@/constants/prompts";
import { FaExpandAlt } from "react-icons/fa";
import { FaLock } from "react-icons/fa6";

export default function Chat() {

  // can be text, job, hobby
  const [inputType, setInputType] = useState("text");
  const [job, setJob] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startActive, setStartActive] = useState(false)
  const [startPlayground, setStartPlayground] = useState(false)


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
            Please input a job title to generate a list of its standardized
            task activities.
          </p>
        ) : null}
        {inputType == "hobby" ? (
          <p className="my-2 text-xs">
            Please input a list of hobbies and/or daily activities to generate
            a list of its standardized task activities.
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
        <ActivePromptOutput {...{ startActive, inputType, setLoading, text, job, hobbies, setStartActive, loading }} />
        <PlaygroundPromptOutput {...{ startPlayground, inputType, setLoading, text, job, hobbies, setStartPlayground, loading }} />

      </div>


      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
    </div>
  );
}


function ActivePromptOutput({
  startActive, inputType, setLoading, text, job, hobbies, setStartActive, loading
}) {
  const [activeOpenAIOutput, setActiveOpenAIOutput] = useState()
  const [IWAs, setIWAs] = useState([]);
  const [user, setUser] = useState(generateID());

  const { messages, append, input, handleInputChange, handleSubmit, setInput } =
    useChat({
      onResponse: async (response) => {
        try {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const responseText = await response.clone().text();
          console.log(responseText, "responseText");
          const sentences = responseText
            .split(/\d+\.\s/)
            .map((sentence) => sentence.replace(/\n/g, ""))
            .filter((sentence) => sentence.trim() !== "");

          console.log("Processed response:", sentences);
          //setActiveOpenAIOutput(sentences)
          // This is a non-recommended way of using ref instead of state due to some strange rendering logic interfering with the calls to openAI
          if (outputRef.current) {
            outputRef.current.textContent = sentences.join("\r\n");
          }
          setStartActive(false)
          invokeTask(sentences);
          setTimeout(() => {
            getIWAs(sentences);
          }, 3000);
        } catch (error) {
          setError("An error occurred while processing the response.");
          setLoading(false);
        }
      },
      onError: (error) => {
        try {
          const { error: errorMessage } = JSON.parse(error.message);
          setError(`Error: ${errorMessage}`);
        } catch (parseError) {
          setError(`Error: ${error.message}`);
        }
        setLoading(false);
      },
    });

  const outputRef = useRef(null);

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
    let userMessage;
    if (inputType === "text") {
      userMessage = translatePrompts.textPrompt(text);
    } else if (inputType === "job") {
      userMessage = translatePrompts.jobPrompt(job);
    } else if (inputType === "hobby") {
      userMessage = translatePrompts.hobbyPrompt(hobbies);
    }
    append({
      role: "user",
      content: userMessage,
    });
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

  useEffect(() => {
    if (startActive) {
      handleGenerate()
    }
  }, [startActive])

  return (
    <div className="mb-4">
      <h3 className="font-bold text-lg mb-3">Active Prompt-In-Use</h3>
      <div className="rounded-md bg-lockgray py-2 px-4 mb-4 flex items-center w-full">
        <FaLock className="mr-2 text-lg" />
        <p className="truncate overflow-hidden whitespace-nowrap text-sm">{translatePrompts.textPrompt("")}</p>
        <FaExpandAlt className=" text-2xl ml-2" />
      </div>
      <div className="max-w-full w-full flex items-start gap-2 h-[30vh] text-xs text-white">
        <div className="bg-black flex-1 p-4 h-full">
          <p className="font-semibold text-white text-xs mb-2">OpenAI Output</p>
          <p ref={outputRef} className="h-4/5 py-2 overflow-y-auto whitespace-pre-wrap "></p>
        </div>
        <div className="bg-black flex-1 p-4 h-full">
          <p className="font-semibold text-white text-xs mb-2">IWA Output</p>
          <p className="h-4/5 py-2 overflow-y-auto whitespace-pre-wrap">
            {(!loading) ? IWAs.map((iwa, index) => (
              <div
                key={index}
              >
                <>{iwa}<br /></>
              </div>
            )) : <></>}
          </p>
        </div>
      </div>
    </div>
  );
}

function PlaygroundPromptOutput({
  startPlayground, inputType, setLoading, text, job, hobbies, setStartPlayground, loading
}) {
  const [playgroundOpenAIOutput, setPlaygroundOpenAIOutput] = useState()
  const [IWAs, setIWAs] = useState([]);
  const [user, setUser] = useState(generateID());
  const [playgroundPrompt, setPlaygroundPrompt] = useState(translatePrompts.textPrompt(""))

  const { messages, append, input, handleInputChange, handleSubmit, setInput } =
    useChat({
      onResponse: async (response) => {
        try {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const responseText = await response.clone().text();
          console.log(responseText, "responseText");
          const sentences = responseText
            .split(/\d+\.\s/)
            .map((sentence) => sentence.replace(/\n/g, ""))
            .filter((sentence) => sentence.trim() !== "");

          console.log("Processed response:", sentences);
          //setPlaygroundOpenAIOutput(sentences)
          // This is a non-recommended way of using ref instead of state due to some strange rendering logic interfering with the calls to openAI
          if (outputRef.current) {
            outputRef.current.textContent = sentences.join("\r\n");
          }
          setStartPlayground(false)
          invokeTask(sentences);
          setTimeout(() => {
            getIWAs(sentences);
          }, 3000);
        } catch (error) {
          setError("An error occurred while processing the response.");
          setLoading(false);
        }
      },
      onError: (error) => {
        try {
          const { error: errorMessage } = JSON.parse(error.message);
          setError(`Error: ${errorMessage}`);
        } catch (parseError) {
          setError(`Error: ${error.message}`);
        }
        setLoading(false);
      },
    });

  const outputRef = useRef(null);

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
    let userMessage;
    if (inputType === "text") {
      userMessage = text + " " + playgroundPrompt
    } else if (inputType === "job") {
      userMessage = job + " " + playgroundPrompt
    } else if (inputType === "hobby") {
      userMessage = hobby + " " + playgroundPrompt
    }
    append({
      role: "user",
      content: userMessage,
    });
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

  useEffect(() => {
    if (startPlayground) {
      handleGenerate()
    }
  }, [startPlayground])

  return (
    <div className="mb-4">
      <h3 className="font-bold text-lg mb-3">Prompt Playground</h3>
      <div className="rounded-md bg-graylt py-2 px-4 mb-4 flex items-center w-full">
        <input value={playgroundPrompt} onChange={(e)=>setPlaygroundPrompt(e.target.value)} className="truncate overflow-hidden whitespace-nowrap text-sm bg-graylt outline-none w-full" placeholder="Insert New Prompt"></input>
        <FaExpandAlt className=" text-2xl ml-2" />
      </div>
      <div className="max-w-full w-full flex items-start gap-2 h-[30vh] text-xs text-white">
        <div className="bg-black flex-1 p-4 h-full">
          <p className="font-semibold text-white text-xs mb-2">OpenAI Output</p>
          <p ref={outputRef} className="h-4/5 py-2 overflow-y-auto whitespace-pre-wrap "></p>
        </div>
        <div className="bg-black flex-1 p-4 h-full">
          <p className="font-semibold text-white text-xs mb-2">IWA Output</p>
          <p className="h-4/5 py-2 overflow-y-auto whitespace-pre-wrap">
            {(!loading) ? IWAs.map((iwa, index) => (
              <div
                key={index}
              >
                <>{iwa}<br /></>
              </div>
            )) : <></>}
          </p>
        </div>
      </div>
    </div>
  );
}

