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
import { comparePrompts } from "@/constants/prompts";
import { FaExpandAlt } from "react-icons/fa";
import { FaLock } from "react-icons/fa6";

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


function ActivePromptOutput({
  startActive, inputAType, inputBType, setLoadingActive, textA, jobA, hobbiesA, textB, jobB, hobbiesB, setStartActive, loadingActive
}) {
  const [openAIOutputADone, setOpenAIOutputADone] = useState(false)
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

          setResponse(sentences);

          if (openAIOutputADone === false) {
            outputARef.current.textContent = sentences.join("\r\n");
            setOpenAIOutputADone(true)
          } else {
            outputBRef.current.textContent = sentences.join("\r\n");
          }

        } catch (error) {
          setError("An error occurred while processing the response.");
          setLoadingActive(false);
        }
      },
      onError: (error) => {
        console.log("error", error);
        const { error: errorMessage } = JSON.parse(error.message);
        setError(`Error: ${errorMessage}`);
        setLoadingActive(false);
      },
    });

  const [input1iwa, setInput1IWA] = useState(false);
  const [input2iwa, setInput2IWA] = useState(false);
  const [response, setResponse] = useState([]);
  const [IWAs1, setIWAs1] = useState([]);
  const [IWAs2, setIWAs2] = useState([]);
  const [similarTasks, setSimilarTasks] = useState([]);
  const [differentTasks1, setDifferentTasks1] = useState([]);
  const [differentTasks2, setDifferentTasks2] = useState([]);
  const responseRef = useRef(null);
  const [user, setUser] = useState();
  const [completed1, setCompleted1] = useState(false);
  const [completed2, setCompleted2] = useState(false);
  const [sentRequest, setSentRequest] = useState(false);
  const [iwa1ID, setiwa1ID] = useState("");
  const [iwa2ID, setiwa2ID] = useState("");
  const [callTo1Done, setCallTo1Done] = useState(false);
  const [error, setError] = useState(null);

  function compareInputs() {
    setLoadingActive(true);
    //first input
    queryInput(1);
  }

  function queryInput(inputNum) {
    console.log(`querying ${inputNum == 1 ? "first" : "second"} input`);

    if (inputNum == 1) {
      setiwa1ID(generateID());
      processInput(inputAType, textA, jobA, hobbiesA);
    } else {
      setiwa2ID(generateID());
      setInput1IWA(false);
      setInput2IWA(true);
      processInput(inputBType, textB, jobB, hobbiesB);
    }
  }

  function processInput(inputType, text, job, hobbies) {
    handleGenerate(inputType, text, job, hobbies)
  }

  async function invokeTask(tasklist, userID) {
    try {
      // Data to send in the request body

      const requestData = {
        user_id: userID,
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
        if (callTo1Done === false) {
          setCallTo1Done(true);
          console.log("this is for query 1");
          queryInput(2);
          invokeTask(response, iwa1ID);
          setTimeout(() => {
            getIWAsForFirstInput(response, iwa1ID);
            console.log("polling 1st iwas");
          }, 3000);
        } else {
          console.log("this is for query 2");
          invokeTask(response, iwa2ID);
          setTimeout(() => {
            getIWAsForSecondInput(response, iwa2ID);
            console.log("polling 2nd iwas");
          }, 3000);
        }
        setSentRequest(true);
      }
    }, 1500); // Adjust the delay time as needed

    // Cleanup the timeout if response changes before the delay ends
    return () => clearTimeout(timeout);
  }, [response]);

  async function getIWAsForFirstInput(tasklist, userID) {
    try {
      let noOfTasksInQueue = Infinity;
      while (noOfTasksInQueue > 0) {
        const requestData = { user_id: userID, task: tasklist };
        const response = await fetch("/api/tasktoIWA", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        });
        const data = await response.json();
        noOfTasksInQueue = data.no_of_tasks_in_queue;

        if (noOfTasksInQueue > 0) {
          const iwas = data.body;
          const iwa_arr = JSON.parse(iwas);
          processIWA(iwa_arr, 1);
        } else {
          console.log("No tasks in queue. Exiting loop for the first input.");
          const iwas = data.body;
          const iwa_arr = JSON.parse(iwas);
          processIWA(iwa_arr);
          setTimeout(() => setCompleted1(true), 3000);
        }
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error("Error in getIWAsForFirstInput:", error);
    }
  }

  async function getIWAsForSecondInput(tasklist, userID) {
    try {
      let noOfTasksInQueue = Infinity;
      while (noOfTasksInQueue > 0) {
        const requestData = { user_id: userID, task: tasklist };
        const response = await fetch("/api/tasktoIWA", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        });
        const data = await response.json();
        noOfTasksInQueue = data.no_of_tasks_in_queue;

        if (noOfTasksInQueue > 0) {
          const iwas = data.body;
          const iwa_arr = JSON.parse(iwas);
          processIWA(iwa_arr);
        } else {
          console.log("No tasks in queue. Exiting loop for the second input.");
          const iwas = data.body;
          const iwa_arr = JSON.parse(iwas);
          processIWA(iwa_arr);
          setTimeout(() => setCompleted2(true), 3000);
        }
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error("Error in getIWAsForSecondInput:", error);
    }
  }

  function processIWA(array, inputNum) {
    let iwa_list = [];
    for (let i = 0; i < array.length; i++) {
      const iwa_item = array[i];
      iwa_list.push(iwa_item);
    }
    iwa_list = Array.from(new Set(iwa_list));
    console.log(iwa_list, "IWAs");
    if (inputNum === 1) {
      setIWAs1(iwa_list);
      setInput1IWA(false);
    } else {
      setIWAs2(iwa_list);
      setInput2IWA(false);
    }
  }
  useEffect(() => {
    console.log("IWAs 1: ", IWAs1);
  }, [IWAs1]);
  useEffect(() => {
    console.log("IWAs 2: ", IWAs2);
    handleSplitTasks(IWAs1, IWAs2);
  }, [IWAs2]);

  useEffect(() => {
    if (completed1 && completed2 && sentRequest) {
      setLoadingActive(false);
    }
  }, [completed1, completed2, sentRequest]);

  function handleSplitTasks(list1, list2) {
    // Initialize arrays to store similar and different strings
    const similarStrings = [];
    const differentStrings1 = [];
    const differentStrings2 = [];

    // Iterate over each string in list1
    list1.forEach((string1) => {
      // Check if the string exists in list2
      if (list2.includes(string1)) {
        // If it does, add it to the similarStrings array
        similarStrings.push(string1);
      } else {
        // If it doesn't, add it to the differentStrings array
        differentStrings1.push(string1);
      }
    });
    list2.forEach((string1) => {
      // Check if the string exists in list2
      if (list1.includes(string1)) {
        // If it does, add it to the similarStrings array
      } else {
        // If it doesn't, add it to the differentStrings array
        differentStrings2.push(string1);
      }
    });

    setSimilarTasks(similarStrings);
    setDifferentTasks1(differentStrings1);
    setDifferentTasks2(differentStrings2);
  }


  const outputARef = useRef(null);
  const outputBRef = useRef(null);

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


  function handleGenerate(inputType, text, job, hobbies) {
    setLoadingActive(true);
    let userMessage;
    if (inputType === "text") {
      userMessage = comparePrompts.textPrompt(text);
    } else if (inputType === "job") {
      userMessage = comparePrompts.jobPrompt(job);
    } else if (inputType === "hobby") {
      userMessage = comparePrompts.hobbyPrompt(hobbies);
    }
    append({
      role: "user",
      content: userMessage,
    });
  }

  
  useEffect(() => {
    if (startActive) {
      outputARef.current.textContent = "";
      outputBRef.current.textContent = "";

      compareInputs()
    }
  }, [startActive])

  function choosePrompt(type) {
    if (type === "text") {
      return comparePrompts.textPrompt("");
    } else if (type === "job") {
      return comparePrompts.jobPrompt("___");
    } else {
      return comparePrompts.hobbyPrompt("");
    }
  }

  return (
    <div className="mb-4">
      <h3 className="font-bold text-lg mb-3">Active Prompt-In-Use</h3>
      <h4 className="font-bold text-base mb-3">Prompt A</h4>
      <div className="rounded-md bg-lockgray py-2 px-4 mb-4 flex items-center w-full">
        <FaLock className="mr-2 text-lg" />
        <p className="truncate overflow-hidden whitespace-nowrap text-sm">
          {choosePrompt(inputAType)}
        </p>
        <FaExpandAlt className=" text-2xl ml-2" />
      </div>
      <h4 className="font-bold text-base mb-3">Prompt B</h4>

      <div className="rounded-md bg-lockgray py-2 px-4 mb-4 flex items-center w-full">
        <FaLock className="mr-2 text-lg" />
        <p className="truncate overflow-hidden whitespace-nowrap text-sm">
          {choosePrompt(inputBType)}
        </p>
        <FaExpandAlt className=" text-2xl ml-2" />
      </div>
      <div className="max-w-full w-full flex items-start gap-2 h-[30vh] text-xs text-white">
        <div className="bg-black flex-1 p-4 h-full">
          <p className="font-semibold text-white text-xs mb-2">OpenAI Output A</p>
          <p ref={outputARef} className="h-4/5 py-2 overflow-y-auto whitespace-pre-wrap "></p>
        </div>
        <div className="bg-black flex-1 p-4 h-full">
          <p className="font-semibold text-white text-xs mb-2">IWA Output A</p>
          <p className="h-4/5 py-2 overflow-y-auto whitespace-pre-wrap">
            {(!loadingActive) ? IWAs1.map((iwa, index) => (
              <div
                key={index}
              >
                <>{iwa}<br /></>
              </div>
            )) : <></>}
          </p>
        </div>
      </div>
      <div className="max-w-full w-full flex items-start gap-2 h-[30vh] text-xs text-white mt-4">
        <div className="bg-black flex-1 p-4 h-full">
          <p className="font-semibold text-white text-xs mb-2">OpenAI Output B</p>
          <p ref={outputBRef} className="h-4/5 py-2 overflow-y-auto whitespace-pre-wrap "></p>
        </div>
        <div className="bg-black flex-1 p-4 h-full">
          <p className="font-semibold text-white text-xs mb-2">IWA Output B</p>
          <p className="h-4/5 py-2 overflow-y-auto whitespace-pre-wrap">
            {(!loadingActive) ? IWAs2.map((iwa, index) => (
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
  startPlayground, inputAType, inputBType, setLoadingPlayground, textA, jobA, hobbiesA, textB, jobB, hobbiesB, setStartPlayground, loadingPlayground 
}) {
  const [openAIOutputADone, setOpenAIOutputADone] = useState(false)
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

          setResponse(sentences);

          if (openAIOutputADone === false) {
            outputAPlaygroundRef.current.textContent = sentences.join("\r\n");
            setOpenAIOutputADone(true)
          } else {
            outputBPlaygroundRef.current.textContent = sentences.join("\r\n");
          }

        } catch (error) {
          setError("An error occurred while processing the response.");
          setLoadingPlayground(false);
        }
      },
      onError: (error) => {
        console.log("error", error);
        const { error: errorMessage } = JSON.parse(error.message);
        setError(`Error: ${errorMessage}`);
        setLoadingPlayground(false);
      },
    });

  const [input1iwa, setInput1IWA] = useState(false);
  const [input2iwa, setInput2IWA] = useState(false);
  const [response, setResponse] = useState([]);
  const [IWAs1, setIWAs1] = useState([]);
  const [IWAs2, setIWAs2] = useState([]);
  const [similarTasks, setSimilarTasks] = useState([]);
  const [differentTasks1, setDifferentTasks1] = useState([]);
  const [differentTasks2, setDifferentTasks2] = useState([]);
  const responseRef = useRef(null);
  const [user, setUser] = useState();
  const [completed1, setCompleted1] = useState(false);
  const [completed2, setCompleted2] = useState(false);
  const [sentRequest, setSentRequest] = useState(false);
  const [iwa1ID, setiwa1ID] = useState("");
  const [iwa2ID, setiwa2ID] = useState("");
  const [callTo1Done, setCallTo1Done] = useState(false);
  const [error, setError] = useState(null);
  function choosePrompt(type) {
    if (type === "text") {
      return comparePrompts.textPrompt("");
    } else if (type === "job") {
      return comparePrompts.jobPrompt("___");
    } else {
      return comparePrompts.hobbyPrompt("");
    }
  }
  
  const [playgroundAPrompt, setPlaygroundAPrompt] = useState(choosePrompt(inputAType));
  const [playgroundBPrompt, setPlaygroundBPrompt] = useState(choosePrompt(inputBType));

  function compareInputs() {
    setLoadingPlayground(true);
    //first input
    queryInput(1);
  }

  function queryInput(inputNum) {
    console.log(`querying ${inputNum == 1 ? "first" : "second"} input`);

    if (inputNum == 1) {
      setiwa1ID(generateID());
      processInput(inputAType, textA, jobA, hobbiesA, playgroundAPrompt);
    } else {
      setiwa2ID(generateID());
      setInput1IWA(false);
      setInput2IWA(true);
      processInput(inputBType, textB, jobB, hobbiesB, playgroundBPrompt);
    }
  }

  function processInput(inputType, text, job, hobbies, prompt) {
    handleGenerate(inputType, text, job, hobbies, prompt)
  }

  async function invokeTask(tasklist, userID) {
    try {
      // Data to send in the request body

      const requestData = {
        user_id: userID,
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
        if (callTo1Done === false) {
          setCallTo1Done(true);
          console.log("this is for query 1");
          queryInput(2);
          invokeTask(response, iwa1ID);
          setTimeout(() => {
            getIWAsForFirstInput(response, iwa1ID);
            console.log("polling 1st iwas");
          }, 3000);
        } else {
          console.log("this is for query 2");
          invokeTask(response, iwa2ID);
          setTimeout(() => {
            getIWAsForSecondInput(response, iwa2ID);
            console.log("polling 2nd iwas");
          }, 3000);
        }
        setSentRequest(true);
      }
    }, 1500); // Adjust the delay time as needed

    // Cleanup the timeout if response changes before the delay ends
    return () => clearTimeout(timeout);
  }, [response]);

  async function getIWAsForFirstInput(tasklist, userID) {
    try {
      let noOfTasksInQueue = Infinity;
      while (noOfTasksInQueue > 0) {
        const requestData = { user_id: userID, task: tasklist };
        const response = await fetch("/api/tasktoIWA", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        });
        const data = await response.json();
        noOfTasksInQueue = data.no_of_tasks_in_queue;

        if (noOfTasksInQueue > 0) {
          const iwas = data.body;
          const iwa_arr = JSON.parse(iwas);
          processIWA(iwa_arr, 1);
        } else {
          console.log("No tasks in queue. Exiting loop for the first input.");
          const iwas = data.body;
          const iwa_arr = JSON.parse(iwas);
          processIWA(iwa_arr);
          setTimeout(() => setCompleted1(true), 3000);
        }
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error("Error in getIWAsForFirstInput:", error);
    }
  }

  async function getIWAsForSecondInput(tasklist, userID) {
    try {
      let noOfTasksInQueue = Infinity;
      while (noOfTasksInQueue > 0) {
        const requestData = { user_id: userID, task: tasklist };
        const response = await fetch("/api/tasktoIWA", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        });
        const data = await response.json();
        noOfTasksInQueue = data.no_of_tasks_in_queue;

        if (noOfTasksInQueue > 0) {
          const iwas = data.body;
          const iwa_arr = JSON.parse(iwas);
          processIWA(iwa_arr);
        } else {
          console.log("No tasks in queue. Exiting loop for the second input.");
          const iwas = data.body;
          const iwa_arr = JSON.parse(iwas);
          processIWA(iwa_arr);
          setTimeout(() => setCompleted2(true), 3000);
        }
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error("Error in getIWAsForSecondInput:", error);
    }
  }

  function processIWA(array, inputNum) {
    let iwa_list = [];
    for (let i = 0; i < array.length; i++) {
      const iwa_item = array[i];
      iwa_list.push(iwa_item);
    }
    iwa_list = Array.from(new Set(iwa_list));
    console.log(iwa_list, "IWAs");
    if (inputNum === 1) {
      setIWAs1(iwa_list);
      setInput1IWA(false);
    } else {
      setIWAs2(iwa_list);
      setInput2IWA(false);
    }
  }
  useEffect(() => {
    console.log("IWAs 1: ", IWAs1);
  }, [IWAs1]);
  useEffect(() => {
    console.log("IWAs 2: ", IWAs2);
    handleSplitTasks(IWAs1, IWAs2);
  }, [IWAs2]);

  useEffect(() => {
    if (completed1 && completed2 && sentRequest) {
      setLoadingPlayground(false);
    }
  }, [completed1, completed2, sentRequest]);

  function handleSplitTasks(list1, list2) {
    // Initialize arrays to store similar and different strings
    const similarStrings = [];
    const differentStrings1 = [];
    const differentStrings2 = [];

    // Iterate over each string in list1
    list1.forEach((string1) => {
      // Check if the string exists in list2
      if (list2.includes(string1)) {
        // If it does, add it to the similarStrings array
        similarStrings.push(string1);
      } else {
        // If it doesn't, add it to the differentStrings array
        differentStrings1.push(string1);
      }
    });
    list2.forEach((string1) => {
      // Check if the string exists in list2
      if (list1.includes(string1)) {
        // If it does, add it to the similarStrings array
      } else {
        // If it doesn't, add it to the differentStrings array
        differentStrings2.push(string1);
      }
    });

    setSimilarTasks(similarStrings);
    setDifferentTasks1(differentStrings1);
    setDifferentTasks2(differentStrings2);
  }


  const outputAPlaygroundRef = useRef(null);
  const outputBPlaygroundRef = useRef(null);

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

  function handleGenerate(inputType, text, job, hobbies, prompt) {
    setLoadingActive(true);
    let userMessage;
    if (inputType === "text") {
      userMessage = text + " " + prompt
    } else if (inputType === "job") {
      userMessage = job + " " + prompt
    } else if (inputType === "hobby") {
      userMessage = hobbies + " " + prompt
    }
    append({
      role: "user",
      content: userMessage,
    });
  }
  function handleGenerate(inputType, text, job, hobbies, prompt) {
    setLoadingPlayground(true);
    let userMessage;
    if (inputType === "text") {
      userMessage = text + " " + prompt
    } else if (inputType === "job") {
      userMessage = job + " " + prompt
    } else if (inputType === "hobby") {
      userMessage = hobbies + " " + prompt
    }
    append({
      role: "user",
      content: userMessage,
    });
  }

  
  useEffect(() => {
    if (startPlayground) {
      outputAPlaygroundRef.current.textContent = "";
      outputBPlaygroundRef.current.textContent = "";
      compareInputs()

    }
  }, [startPlayground])

  

  return (
    <div className="mb-4">
      <h3 className="font-bold text-lg mb-3">Prompt Playground</h3>
      <h4 className="font-bold text-base mb-3">Prompt A</h4>
      <div className="rounded-md bg-graylt py-2 px-4 mb-4 flex items-center w-full">
        <input value={playgroundAPrompt} onChange={(e) => setPlaygroundAPrompt(e.target.value)} className="truncate overflow-hidden whitespace-nowrap text-sm bg-graylt outline-none w-full" placeholder="Insert New Prompt"></input>
        <FaExpandAlt className=" text-2xl ml-2" />
      </div>
      <h4 className="font-bold text-base mb-3">Prompt B</h4>

      <div className="rounded-md bg-graylt py-2 px-4 mb-4 flex items-center w-full">
        <input value={playgroundBPrompt} onChange={(e) => setPlaygroundBPrompt(e.target.value)} className="truncate overflow-hidden whitespace-nowrap text-sm bg-graylt outline-none w-full" placeholder="Insert New Prompt"></input>
        <FaExpandAlt className=" text-2xl ml-2" />
      </div>
      <div className="max-w-full w-full flex items-start gap-2 h-[30vh] text-xs text-white">
        <div className="bg-black flex-1 p-4 h-full">
          <p className="font-semibold text-white text-xs mb-2">OpenAI Output A</p>
          <p ref={outputAPlaygroundRef} className="h-4/5 py-2 overflow-y-auto whitespace-pre-wrap "></p>
        </div>
        <div className="bg-black flex-1 p-4 h-full">
          <p className="font-semibold text-white text-xs mb-2">IWA Output A</p>
          <p className="h-4/5 py-2 overflow-y-auto whitespace-pre-wrap">
            {(!loadingPlayground) ? IWAs1.map((iwa, index) => (
              <div
                key={index}
              >
                <>{iwa}<br /></>
              </div>
            )) : <></>}
          </p>
        </div>
      </div>
      <div className="max-w-full w-full flex items-start gap-2 h-[30vh] text-xs text-white mt-4">
        <div className="bg-black flex-1 p-4 h-full">
          <p className="font-semibold text-white text-xs mb-2">OpenAI Output B</p>
          <p ref={outputBPlaygroundRef} className="h-4/5 py-2 overflow-y-auto whitespace-pre-wrap "></p>
        </div>
        <div className="bg-black flex-1 p-4 h-full">
          <p className="font-semibold text-white text-xs mb-2">IWA Output B</p>
          <p className="h-4/5 py-2 overflow-y-auto whitespace-pre-wrap">
            {(!loadingPlayground) ? IWAs2.map((iwa, index) => (
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

