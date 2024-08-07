"use client";

import { useChat } from "ai/react";
import compare_logo from "/public/compare.svg";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";
import Image from "next/image";
import DownloadIcon from "@mui/icons-material/Download";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { useEffect, useState, useRef } from "react";
import ErrorModal from "../components/ErrorModal";

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
      content:
        userText +
        // "Summarise the tasks from the text into a set of task sentences. It is very important that each task sentence itself should not have any comma inside. Each task sentence should also begin with a capital letter. Return all task sentences in a single string where each task sentence is separated by a comma. ",
        "Extract and summarise the tasks from the text into a set of sentences and return them such that each task is numbered. Keep each text to less than 10 words.",
    });
  }

  function getTasksFromJob(job) {
    const userJob = job;
    append({
      role: "user",
      content:
        "Create a list of tasks for the job," +
        userJob +
        "," +
        "  even if the job does not exist yet, into a set of sentences and return them such that each task is numbered. Keep each sentence shorter than 10 words.",
    });
  }

  function getTasksFromHobbies(hobbies) {
    const userHobbies = hobbies;
    append({
      role: "user",
      content:
        "For each hobby or daily activity in this list:" +
        userHobbies +
        ",convert them into tasks sentences and return them such that each task is numbered. e.g. Choreograph dances or performances for events. Keep each sentence shorter than 10 words.",
    });
  }

  function handleReset() {
    setHobbies1("");
    setText1("");
    setJob1("");
    setHobbies2("");
    setText2("");
    setJob2("");
    generateID();
    setSimilarTasks([]);
    setDifferentTasks1([]);
    setDifferentTasks2([]);
    setCompleted1(false);
    setCompleted2(false);
    location.reload();
    setIWAs1([]);
    setIWAs2([]);
    setCallTo1Done(false);
    setiwa1ID("");
    setiwa2ID("");
  }

  function handleSave() {}

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
    <div className="flex flex-col" id="results">
      <div className="w-screen flex flex-col ">
        <div className="flex flex-col md:flex-row w-full text-[#555555]">
          <div className="flex flex-col md:w-1/2  h-full tracking-[0.10rem]">
            <div className="w-full ">
              <div className="px-10 pt-5 w-5/6">
                <div className="flex flex-row items-center py-2 font-medium">
                  <Image
                    src={compare_logo}
                    width={30}
                    alt="Logo"
                    className=""
                  ></Image>{" "}
                  <h3 className="ml-5 text-xl tracking-[0.10rem]">
                    Task STAK Compare
                  </h3>
                </div>{" "}
                <p className="text-xs tracking-[0.10rem]">
                  Compare and evaluate your career activities against other task
                  portfolios, identifying overlaps and gaps. Infer strategic
                  insights into your career development and gain clarity on how
                  your experiences can align with various industry roles.
                </p>
              </div>
              <div className="px-10 pt-5 pb-5  justify-between ">
                <button
                  className={` pr-2 tracking-[0.10rem] ${
                    input1 == "text"
                      ? "text-md text-[#555555]"
                      : "text-sm text-gray-400"
                  }`}
                  onClick={() => handleSelectInput1("text")}
                >
                  Paste Text
                </button>
                |
                <button
                  className={` px-2 tracking-[0.10rem] ${
                    input1 == "job"
                      ? "text-md text-[#555555]"
                      : "text-sm text-gray-400"
                  }`}
                  onClick={() => handleSelectInput1("job")}
                >
                  Input Job
                </button>{" "}
                |
                <button
                  className={` px-2 tracking-[0.10rem] ${
                    input1 == "hobbies"
                      ? "text-md text-[#555555]"
                      : "text-sm text-gray-400"
                  }`}
                  onClick={() => handleSelectInput1("hobbies")}
                >
                  Input Hobbies
                </button>
              </div>
              {input1 == "text" ? (
                <>
                  <p className="px-10 text-xs pb-5">
                    Please submit the text you wish to convert into standardized
                    task activities. This can be a job description, course
                    description, or your resume content.
                  </p>
                  <div className="px-10 text-black w-full flex flex-col">
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
                  <p className="px-10 text-xs pb-5">
                    Please input a job title to generate a list of its
                    standardized task activities.
                  </p>
                  <div className="pl-10 pr-5 text-black flex flex-col">
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
                  <p className="px-10 text-xs pb-5">
                    Please input a list of hobbies and/or daily activities to
                    generate a list of its standardized task activities.
                  </p>
                  <div className="px-10 text-black flex flex-col">
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
          </div>

          <div className="flex flex-col md:w-1/2  h-full tracking-[0.10rem]">
            <div className="w-full ">
              <div className=" h-36"></div>
              <div className="px-10 pt-5 pb-5  justify-between ">
                <button
                  className={` pr-2 tracking-[0.10rem] ${
                    input2 == "text"
                      ? "text-md text-[#555555]"
                      : "text-sm text-gray-400"
                  }`}
                  onClick={() => handleSelectInput2("text")}
                >
                  Paste Text
                </button>
                |
                <button
                  className={` px-2 tracking-[0.10rem] ${
                    input2 == "job"
                      ? "text-md text-[#555555]"
                      : "text-sm text-gray-400"
                  }`}
                  onClick={() => handleSelectInput2("job")}
                >
                  Input Job
                </button>{" "}
                |
                <button
                  className={` px-2 tracking-[0.10rem] ${
                    input2 == "hobbies"
                      ? "text-md text-[#555555]"
                      : "text-sm text-gray-400"
                  }`}
                  onClick={() => handleSelectInput2("hobbies")}
                >
                  Input Hobbies
                </button>
              </div>
              {input2 == "text" ? (
                <>
                  <p className="px-10 text-xs pb-5">
                    Please submit the text you wish to convert into standardized
                    task activities. This can be a job description, course
                    description, or your resume content.
                  </p>
                  <div className="px-10 text-black w-full flex flex-col">
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
                  <p className="px-10 text-xs pb-5">
                    Please input a job title to generate a list of its
                    standardized task activities.
                  </p>
                  <div className="pl-10 pr-5 text-black flex flex-col">
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
                  <p className="px-10 text-xs pb-5">
                    Please input a list of hobbies and/or daily activities to
                    generate a list of its standardized task activities.
                  </p>
                  <div className="px-10 text-black flex flex-col">
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
      <div className="w-full text-[#555555] flex my-2 justify-center ">
        <button
          onClick={handleReset}
          className="tracking-[0.10rem] bg-[#737171] mx-2 py-2 px-5 rounded-lg my-5 w-fit text-white"
        >
          <RestartAltIcon className="mr-3 text-[1.5rem]"></RestartAltIcon>
          Reset
        </button>
        <button
          onClick={compareInputs}
          className="tracking-[0.10rem]  bg-[#474545] mx-2 py-2 px-5 rounded-lg my-5 w-fit text-white"
        >
          <RestartAltIcon className="mr-3 text-[1.5rem]"></RestartAltIcon>
          Compare
        </button>
        <button
          onClick={handleSave}
          className="tracking-[0.10rem] bg-[#737171] mx-2 py-2 px-5 rounded-lg my-5 w-fit text-white"
        >
          <DownloadIcon className="mr-3 text-[1.5rem]" />
          Save
        </button>
      </div>
      {completed1 && completed2 && sentRequest ? (
        <div className="w-full  flex flex-row pb-10 text-[#555555]">
          <div className="w-1/2 flex flex-col pl-10 pr-5 pb-10">
            <p className="py-2 font-semibold">Similar Tasks: </p>
            {similarTasks.map((iwa) => (
              <div key={iwa.id}>
                <p className="pb-2">{iwa}</p>
              </div>
            ))}{" "}
            <p className="py-2 font-semibold">Other Tasks from Input 1: </p>
            {differentTasks1.map((iwa) => (
              <div key={iwa.id}>
                <p className=" pb-2 bg-[#9CD1BC]">{iwa}</p>
              </div>
            ))}
          </div>
          <div className="w-1/2 flex flex-col pl-5 pr-10 pb-10">
            <p className="py-2 font-semibold">Similar Tasks:</p>

            {similarTasks.map((iwa) => (
              <div key={iwa.id}>
                <p className=" pb-2">{iwa}</p>
              </div>
            ))}

            <p className="py-2 font-semibold ">Other Tasks from Input 2: </p>

            {differentTasks2.map((iwa) => (
              <div key={iwa.id}>
                <p className="  pb-2 bg-[#F5D3CC]">{iwa}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        loading && (
          <div className="w-full text-gray-400 flex justify-center pb-10">
            <CircularProgress color="inherit" />
          </div>
        )
      )}
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
    </div>
  );
}
