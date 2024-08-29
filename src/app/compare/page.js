"use client";

import { useChat } from "ai/react";
import compare_logo from "/public/compare.svg";
import CircularProgress from "@mui/material/CircularProgress";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import ErrorModal from "../components/ErrorModal";
import { comparePrompts } from "@/constants/prompts";

export default function Chat() {
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
        } catch (error) {
          setError("An error occurred while processing the response.");
          setLoading(false);
        }
      },
      onError: (error) => {
        console.log("error", error);
        const { error: errorMessage } = JSON.parse(error.message);
        setError(`Error: ${errorMessage}`);
        setLoading(false);
      },
    });

  const [input1, setInput1] = useState("text");
  const [input2, setInput2] = useState("text");
  const [input1iwa, setInput1IWA] = useState(false);
  const [input2iwa, setInput2IWA] = useState(false);

  const [job1, setJob1] = useState("");
  const [text1, setText1] = useState("");
  const [job2, setJob2] = useState("");
  const [text2, setText2] = useState("");
  const [hobbies2, setHobbies2] = useState("");
  const [hobbies1, setHobbies1] = useState("");
  const [response, setResponse] = useState([]);
  const [IWAs, setIWAs] = useState([]);
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
  const [loading, setLoading] = useState(false);
  const [callTo1Done, setCallTo1Done] = useState(false);
  const [error, setError] = useState(null);

  const timeoutForIWAs = 120;

  function compareInputs() {
    setLoading(true);
    //first input
    queryInput(1);
  }

  function queryInput(inputNum) {
    console.log(`querying ${inputNum == 1 ? "first" : "second"} input`);

    if (inputNum == 1) {
      setiwa1ID(generateID());
      processInput(input1, text1, job1, hobbies1);
    } else {
      setiwa2ID(generateID());
      setInput1IWA(false);
      setInput2IWA(true);
      processInput(input2, text2, job2, hobbies2);
    }
  }

  function processInput(inputType, text, job, hobbies) {
    if (inputType === "text") {
      getTasksFromText(text);
    } else if (inputType === "job") {
      getTasksFromJob(job);
    } else if (inputType === "hobbies") {
      getTasksFromHobbies(hobbies);
    }
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

  async function getIWAsForFirstInput(
    tasklist,
    userID,
    timeout = timeoutForIWAs
  ) {
    try {
      let noOfTasksInQueue = Infinity;

      // Create a timeout promise
      const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error("Operation timed out"));
        }, timeout);
      });

      // Create the IWA processing promise
      const iwaProcessingPromise = new Promise(async (resolve) => {
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
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
        resolve(); // Resolve the promise when done
      });

      // Use Promise.race to race the IWA processing and timeout
      await Promise.race([iwaProcessingPromise, timeoutPromise]);
    } catch (error) {
      if (error.message === "Operation timed out") {
        console.warn(
          "getIWAsForFirstInput timed out. Returning whatever was processed."
        );
      } else {
        console.error("Error in getIWAsForFirstInput:", error);
      }
    }
  }

  async function getIWAsForSecondInput(
    tasklist,
    userID,
    timeout = timeoutForIWAs
  ) {
    try {
      let noOfTasksInQueue = Infinity;

      // Create a timeout promise
      const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error("Operation timed out"));
        }, timeout);
      });

      // Create the IWA processing promise
      const iwaProcessingPromise = new Promise(async (resolve) => {
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
            console.log(
              "No tasks in queue. Exiting loop for the second input."
            );
            const iwas = data.body;
            const iwa_arr = JSON.parse(iwas);
            processIWA(iwa_arr);
            setTimeout(() => setCompleted2(true), 3000);
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
        resolve(); // Resolve the promise when done
      });

      // Use Promise.race to race the IWA processing and timeout
      await Promise.race([iwaProcessingPromise, timeoutPromise]);
    } catch (error) {
      if (error.message === "Operation timed out") {
        console.warn(
          "getIWAsForSecondInput timed out. Returning whatever was processed."
        );
      } else {
        console.error("Error in getIWAsForSecondInput:", error);
      }
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
      setLoading(false);
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

  function getTasksFromText(text) {
    const userText = text;
    append({
      role: "user",
      content: comparePrompts.textPrompt(userText),
    });
  }

  function getTasksFromJob(job) {
    const userJob = job;
    append({
      role: "user",
      content: comparePrompts.jobPrompt(userJob),
    });
  }

  function getTasksFromHobbies(hobbies) {
    const userHobbies = hobbies;
    append({
      role: "user",
      content: comparePrompts.hobbyPrompt(userHobbies),
    });
  }

  function handleSelectInput1(value) {
    setInput1(value);
  }

  function handleSelectInput2(value) {
    setInput2(value);
  }

  function handleJobChange1(e) {
    const jobName = e.target.value;
    setJob1(jobName);
  }

  function handleTextChange1(e) {
    const textContent = e.target.value;
    setText1(textContent);
  }

  function handleJobChange2(e) {
    const jobName = e.target.value;
    setJob2(jobName);
  }

  function handleTextChange2(e) {
    const textContent = e.target.value;
    setText2(textContent);
  }

  function generateID() {
    let id = "";
    const characters = "0123456789";
    const length = 8;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      id += characters.charAt(randomIndex);
    }

    return id;
  }
  return (
    <div className="flex flex-col overflow-x-hidden" id="results">
      <div className="w-screen flex flex-col ">
        <div className="flex flex-col w-full text-[#555555]">
          {/* title and desc section */}
          <div className="flex flex-row">
            <div className="md:w-1/2 md:px-10 px-6">
              <div className="pt-5 w-5/6">
                <div className="flex flex-row items-center py-2 font-medium">
                  <Image
                    src={compare_logo}
                    width={30}
                    alt="Logo"
                    className=""
                  ></Image>
                  <h3 className="ml-5 text-xl tracking-[0.10rem]">
                    Task STAK Compare
                  </h3>
                </div>
                <p className="text-xs tracking-[0.10rem]">
                  Compare and evaluate your career activities against other task
                  portfolios, identifying overlaps and gaps. Infer strategic
                  insights into your career development and gain clarity on how
                  your experiences can align with various industry roles.
                </p>
              </div>
            </div>
            <div className="md:w-1/2"></div>
          </div>
          {/* input sections */}
          <div className="flex md:flex-row flex-col gap-y-4">
            <div className="flex flex-col md:w-1/2 md:px-10 px-6">
              <div className="pt-5 pb-5  justify-between ">
                <button
                  className={` pr-2 tracking-[0.10rem] ${
                    input1 == "text"
                      ? "text-sm text-[#555555]"
                      : "text-xs text-gray-400"
                  }`}
                  onClick={() => handleSelectInput1("text")}
                >
                  Paste Text
                </button>
                |
                <button
                  className={` px-2 tracking-[0.10rem] ${
                    input1 == "job"
                      ? "text-sm text-[#555555]"
                      : "text-xs text-gray-400"
                  }`}
                  onClick={() => handleSelectInput1("job")}
                >
                  Input Job
                </button>
                |
                <button
                  className={` px-2 tracking-[0.10rem] ${
                    input1 == "hobbies"
                      ? "text-sm text-[#555555]"
                      : "text-xs text-gray-400"
                  }`}
                  onClick={() => handleSelectInput1("hobbies")}
                >
                  Input Hobbies
                </button>
              </div>
              {input1 == "text" ? (
                <>
                  <p className="text-xs pb-5">
                    Please submit the text you wish to convert into standardized
                    task activities. This can be a job description, course
                    description, or your resume content.
                  </p>
                  <div className="text-black w-full flex flex-col">
                    <textarea
                      type="text"
                      value={text1}
                      className="tracking-[0.10rem] w-full h-[15rem] p-2 bg-[#D9D9D9] text-[#555555] rounded-md"
                      placeholder="Type or paste your text here..."
                      onChange={handleTextChange1}
                    ></textarea>
                  </div>
                </>
              ) : null}
              {input1 == "job" ? (
                <>
                  <p className="text-xs pb-5">
                    Please input a job title to generate a list of its
                    standardized task activities.
                  </p>
                  <div className=" text-black flex flex-col">
                    <input
                      type="text"
                      className=" tracking-[0.10rem] w-full p-2 bg-[#D9D9D9] text-[#555555] rounded-md "
                      value={job1}
                      onChange={handleJobChange1}
                      placeholder="Enter a job title here..."
                    ></input>
                  </div>
                </>
              ) : null}
              {input1 == "hobbies" ? (
                <>
                  <p className="text-xs pb-5">
                    Please input a list of hobbies and/or daily activities to
                    generate a list of its standardized task activities.
                  </p>
                  <div className="text-black flex flex-col">
                    <textarea
                      type="text"
                      className="tracking-[0.10rem] w-full h-[15rem] p-2 bg-[#D9D9D9] text-[#555555] rounded-md"
                      placeholder="List down your hobbies and/or daily activities"
                      // value={hobbies}
                      // onChange={handleHobbiesChange1}
                    ></textarea>
                  </div>
                </>
              ) : null}
            </div>
            <div className="flex flex-col md:w-1/2 md:px-10 px-6">
              <div className="pt-5 pb-5  justify-between ">
                <button
                  className={` pr-2 tracking-[0.10rem] ${
                    input2 == "text"
                      ? "text-sm text-[#555555]"
                      : "text-xs text-gray-400"
                  }`}
                  onClick={() => handleSelectInput2("text")}
                >
                  Paste Text
                </button>
                |
                <button
                  className={` px-2 tracking-[0.10rem] ${
                    input2 == "job"
                      ? "text-sm text-[#555555]"
                      : "text-xs text-gray-400"
                  }`}
                  onClick={() => handleSelectInput2("job")}
                >
                  Input Job
                </button>
                |
                <button
                  className={` px-2 tracking-[0.10rem] ${
                    input2 == "hobbies"
                      ? "text-sm text-[#555555]"
                      : "text-xs text-gray-400"
                  }`}
                  onClick={() => handleSelectInput2("hobbies")}
                >
                  Input Hobbies
                </button>
              </div>
              {input2 == "text" ? (
                <>
                  <p className="text-xs pb-5">
                    Please submit the text you wish to convert into standardized
                    task activities. This can be a job description, course
                    description, or your resume content.
                  </p>
                  <div className="text-black w-full flex flex-col">
                    <textarea
                      type="text"
                      value={text2}
                      className="tracking-[0.10rem] w-full h-[15rem] p-2 bg-[#D9D9D9] text-[#555555] rounded-md"
                      placeholder="Type or paste your text here..."
                      onChange={handleTextChange2}
                    ></textarea>
                  </div>
                </>
              ) : null}
              {input2 == "job" ? (
                <>
                  <p className="text-xs pb-5">
                    Please input a job title to generate a list of its
                    standardized task activities.
                  </p>
                  <div className="text-black flex flex-col">
                    <input
                      type="text"
                      className=" tracking-[0.10rem] w-full p-2 bg-[#D9D9D9] text-[#555555] rounded-md "
                      value={job2}
                      onChange={handleJobChange2}
                      placeholder="Enter a job title here..."
                    ></input>
                  </div>
                </>
              ) : null}
              {input2 == "hobbies" ? (
                <>
                  <p className="text-xs pb-5">
                    Please input a list of hobbies and/or daily activities to
                    generate a list of its standardized task activities.
                  </p>
                  <div className="text-black flex flex-col">
                    <textarea
                      type="text"
                      className="tracking-[0.10rem] w-full h-[15rem] p-2 bg-[#D9D9D9] text-[#555555] rounded-md"
                      placeholder="List down your hobbies and/or daily activities"
                      // value={hobbies}
                      // onChange={handleHobbiesChange2}
                    ></textarea>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full text-[#555555] flex my-2 justify-center">
        {loading ? (
          <button
            disabled
            className="bg-[#474545] w-36 h-10 bg-opacity-50 rounded-lg my-5 text-white px-8"
          >
            <CircularProgress color="inherit" size="1.5rem" />
          </button>
        ) : (
          <button
            onClick={compareInputs}
            className="tracking-[0.10rem] w-36 h-10 bg-[#474545] rounded-lg my-5 text-white"
          >
            Compare
          </button>
        )}
      </div>

      {completed1 && completed2 && sentRequest ? (
        <div className="flex flex-col pb-10 text-[#555555] items-center md:mx-0 mx-5">
          <div className="md:w-1/2 md:max-w-[450px] w-full flex flex-col mt-3 mb-8">
            <div className="flex justify-center">
              <p className="w-28 text-center py-2 font-semibold bg-[#54BF94] text-white rounded-lg mb-3">
                Similar Tasks
              </p>
            </div>
            {similarTasks.map((iwa, index) => (
              <div
                key={index}
                className={`${
                  index % 2 === 0
                    ? "bg-[#D9D9D9] bg-opacity-40"
                    : "bg-[#D9D9D9]"
                } my-1 rounded-md`}
              >
                <p className="p-2">{iwa}</p>
              </div>
            ))}
          </div>
          <div className="flex md:flex-row flex-col md:items-start items-center gap-8">
            <div className="md:w-1/2 w-full flex flex-col">
              <div className="flex justify-center">
                <p className="w-44 text-center py-2 font-semibold bg-[#A6AED7] text-white rounded-lg mb-3">
                  Input 1 Unique Tasks
                </p>
              </div>
              {differentTasks1.map((iwa, index) => (
                <div
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? "bg-[#D9D9D9] bg-opacity-40"
                      : "bg-[#D9D9D9]"
                  } my-1 py-1.5 rounded-md`}
                >
                  <p className="p-2">{iwa}</p>
                </div>
              ))}
            </div>
            <div className="md:w-1/2 w-full flex flex-col">
              <div className="flex justify-center">
                <p className="w-44 text-center py-2 font-semibold bg-[#A6AED7] text-white rounded-lg mb-3">
                  Input 2 Unique Tasks
                </p>
              </div>
              {differentTasks2.map((iwa, index) => (
                <div
                  key={index}
                  className={`${
                    index % 2 === 0
                      ? "bg-[#D9D9D9] bg-opacity-40"
                      : "bg-[#D9D9D9]"
                  } my-1 py-1.5 rounded-md`}
                >
                  <p className="p-2">{iwa}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
    </div>
  );
}
