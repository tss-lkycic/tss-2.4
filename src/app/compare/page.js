"use client";

import { useChat } from "ai/react";
import new_logo from "/public/new_logo.svg";
import compare_logo from "/public/compare.svg";
import CircularProgress from "@mui/material/CircularProgress";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import OpenAI from "openai";

export default function Chat() {
  const { messages, append, input, handleInputChange, handleSubmit, setInput } =
    useChat();
  const [input1, setInput1] = useState("Text");
  const [input2, setInput2] = useState("Text");
  const [input1iwa, setInput1IWA] = useState(false);
  const [input2iwa, setInput2IWA] = useState(false);
  const [queryURL1, setQueryURl1] = useState(false);
  const [queryText1, setQueryText1] = useState(true);
  const [queryPDF1, setQueryPDF1] = useState(false);
  const [queryHobbies1, setQueryHobbies1] = useState(false);
  const [queryJob1, setQueryJob1] = useState(false);
  const [queryURL2, setQueryURl2] = useState(false);
  const [queryText2, setQueryText2] = useState(true);
  const [queryPDF2, setQueryPDF2] = useState(false);
  const [queryJob2, setQueryJob2] = useState(false);
  const [queryHobbies2, setQueryHobbies2] = useState(false);
  const [compare, setCompare] = useState(false);
  //   const [queryHobbies2, setQueryJob2] = useState(false);
  const [job1, setJob1] = useState("");
  const [text1, setText1] = useState("");
  const [url1, setURL1] = useState("");
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
  const [s_score, setSScore] = useState(0);
  const [d_score, setDScore] = useState(0);
  const responseRef = useRef(null);
  const [user, setUser] = useState(generateID);
  const [completed1, setCompleted1] = useState(false);
  const [completed2, setCompleted2] = useState(false);
  const [sentRequest, setSentRequest] = useState(false);
  const [iwa1ID, setiwa1ID] = useState("");
  const [iwa2ID, setiwa2ID] = useState("");

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
    console.log("IWAs 1: ", IWAs1);
  }, [IWAs1]);
  useEffect(() => {
    console.log("IWAs 2: ", IWAs2);
    handleSplitTasks(IWAs1, IWAs2);
  }, [IWAs2]);

  useEffect(() => {
    if (completed1 === true && IWAs1.length > 0) {
      queryInput2();
    }
  }, [completed1]);
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
        if (user === iwa1ID) {
          console.log("this is for query 1");
        } else console.log("this is for query 2");
        setSentRequest(true);
        invokeTask(response);
        setTimeout(() => {
          getIWAs(response);
        }, 4000);
      }
    }, 1000); // Adjust the delay time as needed

    // Cleanup the timeout if response changes before the delay ends
    return () => clearTimeout(timeout);
  }, [response]);

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
    // setDifferentTasks2(differentStrings);
    // getScores(similarStrings, IWAs2);
  }

  function getScores(similarlist, list2) {
    // Calculate the length of the second list
    const totalStrings = list2.length;

    // Calculate the number of different strings between list1 and list2
    const differentStrings = totalStrings - similarlist.length;

    // Calculate the scores as percentages
    const similarScore = (similarlist.length / totalStrings) * 100;
    const differentScore = (differentStrings / totalStrings) * 100;
    console.log(s_score, d_score);
    if (similarScore === NaN) {
      setSScore(0);
    } else setSScore(similarScore.toFixed(1));
    if (differentScore === NaN) {
      setDScore(0);
    } else setDScore(differentScore.toFixed(1));
  }

  function handleReset() {
    setIWAs([]);
    setHobbies1("");
    setText1("");
    setURL1("");
    setJob1("");
    setHobbies2("");
    setText2("");
    // setURL2("");
    setJob2("");
    generateID();
    setSimilarTasks([]);
    setDifferentTasks1([]);
    setDifferentTasks2([]);
    setCompleted1(false);
    setCompleted2(false);
  }
  function handleSave() {}
  function handleSelectInput1(value) {
    setInput1(value);
    if (value === "URL") {
      setQueryURl1(true);
      setQueryText1(false);
      setQueryPDF1(false);
      setQueryJob1(false);
      setQueryHobbies1(false);
    } else if (value === "Text") {
      setQueryURl1(false);
      setQueryText1(true);
      setQueryPDF1(false);
      setQueryJob1(false);
      setQueryHobbies1(false);
    } else if (value === "PDF") {
      setQueryURl1(false);
      setQueryText1(false);
      setQueryPDF1(true);
      setQueryJob1(false);
      setQueryHobbies1(false);
    } else if (value === "Job") {
      setQueryURl1(false);
      setQueryText1(false);
      setQueryPDF1(false);
      setQueryJob1(true);
      setQueryHobbies1(false);
    } else if (value === "Hobbies") {
      setQueryURl1(false);
      setQueryText1(false);
      setQueryPDF1(false);
      setQueryJob1(false);
      setQueryHobbies1(true);
    }
    setIWAs([]);
    setUser(generateID());
  }
  function handleSelectInput2(value) {
    setInput2(value);
    if (value === "URL") {
      setQueryURl2(true);
      setQueryText2(false);
      setQueryPDF2(false);
      setQueryJob2(false);
      setQueryHobbies2(false);
    } else if (value === "Text") {
      setQueryURl2(false);
      setQueryText2(true);
      setQueryPDF2(false);
      setQueryJob2(false);
      setQueryHobbies2(false);
    } else if (value === "PDF") {
      setQueryURl2(false);
      setQueryText2(false);
      setQueryPDF2(true);
      setQueryJob2(false);
      setQueryHobbies2(false);
    } else if (value === "Job") {
      setQueryURl2(false);
      setQueryText2(false);
      setQueryPDF2(false);
      setQueryJob2(true);
      setQueryHobbies2(false);
    } else if (value === "Hobbies") {
      setQueryURl2(false);
      setQueryText2(false);
      setQueryPDF2(false);
      setQueryJob2(false);
      setQueryHobbies2(true);
    }
    setIWAs([]);
    setUser(generateID());
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
  //   function handleURLChange(e) {
  //     const urlLink = e.target.value;
  //     setURL(urlLink);
  //   }
  function handleFileChange(e) {
    console.log(e.target);
  }
  function processIWA(array) {
    let iwa_list = [];
    for (let i = 0; i < array.length; i++) {
      const iwa_pair = array[i];
      const result_iwa = iwa_pair[1];
      iwa_list.push(result_iwa);
    }
    iwa_list = Array.from(new Set(iwa_list));
    console.log(iwa_list, "IWAs");
    setIWAs(iwa_list);
    if (input1iwa === true) {
      setIWAs1(iwa_list);
      setInput1IWA(false);
    } else {
      setIWAs2(iwa_list);
      setInput2IWA(false);
    }
  }

  function compareInputs() {
    console.log("querying first input");
    setInput1IWA(true);
    setiwa1ID(user);
    if (input1 === "Text") {
      getTasksFromText1();
    } else if (input1 === "URL") {
    } else if (input1 === "File") {
    } else if (input1 === "Job") {
      getTasksFromJob1();
    } else if (input1 === "Hobbies") {
      getTasksFromHobbies1();
    }
  }
  function queryInput2() {
    console.log("querying second input");
    const new_id = generateID();
    setUser(new_id);
    setiwa2ID(new_id);
    setInput1IWA(false);
    setInput2IWA(true);
    if (input2 === "Text") {
      getTasksFromText2();
    } else if (input2 === "URL") {
    } else if (input2 === "File") {
    } else if (input2 === "Job") {
      getTasksFromJob2();
    } else if (input2 === "Hobbies") {
      getTasksFromHobbies2();
    }
  }

  function getTasksFromText1() {
    const userText = text1;
    append({
      role: "user",
      content:
        userText +
        // "Summarise the tasks from the text into a set of task sentences. It is very important that each task sentence itself should not have any comma inside. Each task sentence should also begin with a capital letter. Return all task sentences in a single string where each task sentence is separated by a comma. ",
        "Extract and summarise the tasks from the text into a set of sentences and return them such that each task is numbered. ",
    });
  }

  function getTasksFromText2() {
    const userText = text2;
    append({
      role: "user",
      content:
        userText +
        // "Summarise the tasks from the text into a set of task sentences. It is very important that each task sentence itself should not have any comma inside. Each task sentence should also begin with a capital letter. Return all task sentences in a single string where each task sentence is separated by a comma. ",
        "Extract and summarise the tasks from the text into a set of sentences and return them such that each task is numbered. ",
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
          processIWA(iwa_arr);
        } else if (iwa1ID === user) {
          setCompleted1(true);
          console.log("no more tasks for input 1");
        } else if (iwa2ID === user) {
          setCompleted2(true);
          console.log("no more tasks for input 2");
        }

        // Optional: Add a delay between API calls to avoid flooding the server
        await new Promise((resolve) => setTimeout(resolve, 4000)); // 1 second delay
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function getTasksFromFile() {}
  function getTasksFromURL() {}
  function getTasksFromJob1() {
    const userJob = job1;
    append({
      role: "user",
      content:
        "Create a list of tasks for the job," +
        userJob +
        "," +
        "  even if the job does not exist yet, into a set of 3 short sentences and return them such that each task is numbered. ",
    });
  }

  function getTasksFromJob2() {
    const userJob = job2;
    append({
      role: "user",
      content:
        "Create a list of tasks for the job," +
        userJob +
        "," +
        "  even if the job does not exist yet, into a set of 3 short sentences and return them such that each task is numbered. ",
    });
  }
  function getTasksFromHobbies1() {
    const userHobbies = hobbies1;
    append({
      role: "user",
      content:
        userHobbies +
        "Based on this list of activities, create some possible tasks for each activity in sentences and return them such that each task is numbered. ",
    });
  }
  function getTasksFromHobbies2() {
    const userHobbies = hobbies2;
    append({
      role: "user",
      content:
        userHobbies +
        "Based on this list of activities, create some possible tasks for each activity in sentences and return them such that each task is numbered. ",
    });
  }

  return (
    <div
      className="bg-[#F6F6F6] min-w-screen min-h-screen xflex flex-col overflow-scroll"
      id="results"
    >
      <div className="bg-[#F6F6F6] w-screen h-[80vh]  flex flex-col ">
        <div className=" bg-[#474545] h-[3.5rem] flex justify-center items-center">
          <Image src={new_logo} width={40} alt="Logo" className="m-2"></Image>
          <p className="ml-5 text-xl tracking-[0.5rem]">S T A K</p>
        </div>
        <div className="flex flex-row w-full h-full text-[#555555]">
          <div className="flex flex-col w-1/2  h-full tracking-[0.10rem]">
            <div className="w-full h-1/2">
              <div className="px-10 pt-5 w-2/3">
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
                  Compare Stack explanation. Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit, sed do eiusmod tempor incididunt
                  ut labore et dolore magna aliqua.
                </p>
              </div>
              <div className="px-10 pt-5 pb-5  justify-between ">
                <button
                  className={` pr-2 tracking-[0.10rem] ${
                    queryText1
                      ? "text-md text-[#555555]"
                      : "text-sm text-gray-400"
                  }`}
                  onClick={() => handleSelectInput1("Text")}
                >
                  Paste Text
                </button>
                |
                <button
                  className={` px-2 tracking-[0.10rem] ${
                    queryURL1
                      ? "text-md text-[#555555]"
                      : "text-sm text-gray-400"
                  }`}
                  onClick={() => handleSelectInput1("URL")}
                >
                  Link URL
                </button>
                |
                <button
                  className={` px-2 tracking-[0.10rem] ${
                    queryPDF1
                      ? "text-md text-[#555555]"
                      : "text-sm text-gray-400"
                  }`}
                  onClick={() => handleSelectInput1("PDF")}
                >
                  Upload CV
                </button>
                |
                <button
                  className={` px-2 tracking-[0.10rem] ${
                    queryJob1
                      ? "text-md text-[#555555]"
                      : "text-sm text-gray-400"
                  }`}
                  onClick={() => handleSelectInput1("Job")}
                >
                  Input Job
                </button>{" "}
                |
                <button
                  className={` px-2 tracking-[0.10rem] ${
                    queryHobbies1
                      ? "text-md text-[#555555]"
                      : "text-sm text-gray-400"
                  }`}
                  onClick={() => handleSelectInput1("Hobbies")}
                >
                  Input Hobbies
                </button>
              </div>
              {queryText1 ? (
                <p className="px-10 text-xs pb-5">
                  Please submit the text you wish to convert into standardized
                  task activities. This can be a job description, course
                  description, or your resume content.
                </p>
              ) : null}
              {queryURL1 ? (
                <p className="px-10 text-xs pb-5">
                  Please submit the URL with content that can be translated into
                  standardized task activities. This can be a link to a job
                  description, course description, or your resume.
                </p>
              ) : null}
              {queryPDF1 ? (
                <p className="px-10 text-xs pb-5">
                  Please upload the file that has content that can be translated
                  into standardized task activities. This can be a job
                  description, course description, or your resume.
                </p>
              ) : null}
              {queryJob1 ? (
                <p className="px-10 text-xs pb-5">
                  Please input a job title to generate a list of its
                  standardized task activities.
                </p>
              ) : null}
              {queryHobbies1 ? (
                <p className="px-10 text-xs pb-5">
                  Please input a list of hobbies and/or daily activities to
                  generate a list of its standardized task activities.
                </p>
              ) : null}
            </div>
            {queryText1 ? (
              <div className="px-10 text-black w-full flex flex-col">
                <textarea
                  type="text"
                  value={text1}
                  className="tracking-[0.10rem] w-full h-[15rem] p-2 bg-[#D9D9D9] text-[#555555] rounded-md"
                  placeholder="Type or paste your text here..."
                  onChange={handleTextChange1}
                ></textarea>
              </div>
            ) : null}
            {queryURL1 ? (
              <div className="px-10 text-black flex flex-col">
                <input
                  value={url1}
                  type="text"
                  className=" tracking-[0.10rem] w-full p-2 bg-[#D9D9D9] text-[#555555] rounded-md "
                  placeholder="Enter a URL here..."
                  // onChange={handleURLChange}
                ></input>
              </div>
            ) : null}
            {queryPDF1 ? (
              <div className="pl-10 pr-5  text-black  flex flex-col">
                <button
                  // onClick={handleUpload}
                  className="bg-[#D9D9D9] text-[#555555] rounded-md tracking-[0.10rem] w-full h-[15rem] p-2 flex flex-col justify-center items-center"
                >
                  Select File Here
                </button>
                <input
                  type="file"
                  id="file"
                  className="hidden"
                  // onChange={handleChange}
                  // onChange={handleFileChange}
                  // ref={hiddenFileInput}
                ></input>
              </div>
            ) : null}
            {queryJob1 ? (
              <div className="pl-10 pr-5 text-black flex flex-col">
                <input
                  type="text"
                  className=" tracking-[0.10rem] w-full p-2 bg-[#D9D9D9] text-[#555555] rounded-md "
                  value={job1}
                  onChange={handleJobChange1}
                  placeholder="Enter a job title here..."
                ></input>
              </div>
            ) : null}
            {queryHobbies1 ? (
              <div className="px-10 text-black flex flex-col">
                <textarea
                  type="text"
                  className="tracking-[0.10rem] w-full h-[15rem] p-2 bg-[#D9D9D9] text-[#555555] rounded-md"
                  placeholder="List down your hobbies and/or daily activities"
                  // value={hobbies}
                  // onChange={handleHobbiesChange1}
                ></textarea>
              </div>
            ) : null}
            {/* </div> */}
          </div>

          <div className="flex flex-col w-1/2  h-full">
            <div className=" h-1/2  w-full flex flex-col ">
              <div className="px-10 pt-5 w-2/3 opacity-0">
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
                  Compare Stack explanation. Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit, sed do eiusmod tempor incididunt
                  ut labore et dolore magna aliqua.
                </p>
              </div>
              <div className="pl-5 pr-10 h-fit pb-5 pt-5 flex justify-between w-full">
                <button
                  className={` pr-2 tracking-[0.10rem] ${
                    queryText2
                      ? "text-md text-[#555555]"
                      : "text-sm text-gray-400"
                  }`}
                  onClick={() => handleSelectInput2("Text")}
                >
                  Paste Text
                </button>
                |
                <button
                  className={` px-2 tracking-[0.10rem] ${
                    queryURL2
                      ? "text-md text-[#555555]"
                      : "text-sm text-gray-400"
                  }`}
                  onClick={() => handleSelectInput2("URL")}
                >
                  Link URL
                </button>
                |
                <button
                  className={` px-2 tracking-[0.10rem] ${
                    queryPDF2
                      ? "text-md text-[#555555]"
                      : "text-sm text-gray-400"
                  }`}
                  onClick={() => handleSelectInput2("PDF")}
                >
                  Upload CV
                </button>
                |
                <button
                  className={` px-2 tracking-[0.10rem] ${
                    queryJob2
                      ? "text-md text-[#555555]"
                      : "text-sm text-gray-400"
                  }`}
                  onClick={() => handleSelectInput2("Job")}
                >
                  Input Job
                </button>
                |
                <button
                  className={` px-2 tracking-[0.10rem] ${
                    queryHobbies2
                      ? "text-md text-[#555555]"
                      : "text-sm text-gray-400"
                  }`}
                  onClick={() => handleSelectInput2("Hobbies")}
                >
                  Input Hobbies
                </button>
              </div>
              {queryText2 ? (
                <p className="pl-5 pr-10 text-xs pb-5 tracking-[0.10rem]">
                  Please submit the text you wish to convert into standardized
                  task activities. This can be a job description, course
                  description, or your resume content.
                </p>
              ) : null}
              {queryURL2 ? (
                <p className="pl-5 pr-10 text-xs pb-5 tracking-[0.10rem]">
                  Please submit the URL with content that can be translated into
                  standardized task activities. This can be a link to a job
                  description, course description, or your resume.
                </p>
              ) : null}
              {queryPDF2 ? (
                <p className=" pl-5 pr-10 text-xs pb-5 tracking-[0.10rem]">
                  Please upload the file that has content that can be translated
                  into standardized task activities. This can be a job
                  description, course description, or your resume.
                </p>
              ) : null}
              {queryJob2 ? (
                <p className=" pl-5 pr-10  text-xs pb-5 tracking-[0.10rem]">
                  Please input a job title to generate a list of its
                  standardized task activities.
                </p>
              ) : null}
              {queryHobbies2 ? (
                <p className=" pl-5 pr-10 text-xs pb-5 tracking-[0.10rem]">
                  Please input a list of hobbies and/or daily activities to
                  generate a list of its standardized task activities.
                </p>
              ) : null}
            </div>
            {queryText2 ? (
              <div className="pr-10 pl-5 text-black w-full flex flex-col">
                <textarea
                  type="text"
                  value={text2}
                  className="tracking-[0.10rem] w-full h-[15rem] p-2 bg-[#D9D9D9] text-[#555555] rounded-md"
                  placeholder="Type or paste your text here..."
                  onChange={handleTextChange2}
                ></textarea>
              </div>
            ) : null}
            {queryURL2 ? (
              <div className="pr-10 pl-5 text-black flex flex-col">
                <input
                  // value={url}
                  type="text"
                  className=" tracking-[0.10rem] w-full p-2 bg-[#D9D9D9] text-[#555555] rounded-md "
                  placeholder="Enter a URL here..."
                  // onChange={handleURLChange}
                ></input>
              </div>
            ) : null}
            {queryPDF2 ? (
              <div className="pr-10 pl-5 text-black  flex flex-col">
                <button
                  // onClick={handleUpload}
                  className="bg-[#D9D9D9] text-[#555555] rounded-md tracking-[0.10rem] w-full h-[15rem] p-2 flex flex-col justify-center items-center"
                >
                  Select File Here
                </button>
                <input
                  type="file"
                  id="file"
                  className="hidden"
                  // onChange={handleChange}
                  // onChange={handleFileChange}
                  // ref={hiddenFileInput}
                ></input>
              </div>
            ) : null}
            {queryJob2 ? (
              <div className="pr-10 pl-5  text-black flex flex-col">
                <input
                  type="text"
                  className=" tracking-[0.10rem] w-full p-2 bg-[#D9D9D9] text-[#555555] rounded-md "
                  value={job2}
                  onChange={handleJobChange2}
                  placeholder="Enter a job title here..."
                ></input>
              </div>
            ) : null}{" "}
            {queryHobbies2 ? (
              <div className="pr-10 pl-5 text-black flex flex-col">
                <textarea
                  type="text"
                  className="tracking-[0.10rem] w-full h-[15rem] p-2 bg-[#D9D9D9] text-[#555555] rounded-md"
                  placeholder="List down your hobbies and/or daily activities"
                  // value={hobbies}
                  // onChange={handleHobbiesChange}
                ></textarea>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="w-full text-[#555555] flex my-2 justify-center ">
        <button
          onClick={handleReset}
          className="tracking-[0.10rem] bg-[#474545] mx-2 py-2 px-5 rounded-lg my-5 w-fit text-white"
        >
          Reset
        </button>
        <button
          onClick={compareInputs}
          className="tracking-[0.10rem]  bg-[#474545] mx-2 py-2 px-5 rounded-lg my-5 w-fit text-white"
        >
          Compare
        </button>
        <button
          onClick={handleSave}
          className="tracking-[0.10rem] bg-[#474545] mx-2 py-2 px-5 rounded-lg my-5 w-fit text-white"
        >
          Save
        </button>
      </div>{" "}
      {completed1 && completed2 && sentRequest ? (
        <div className="w-full  flex flex-row pb-10 text-[#555555]">
          <div className="w-1/2 flex flex-col pl-10 pr-5">
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
          <div className="w-1/2 flex flex-col pl-5 pr-10">
            <p className="py-2 font-semibold">Similar Tasks: </p>

            {similarTasks.map((iwa) => (
              <div key={iwa.id}>
                <p className=" pb-2">{iwa}</p>
              </div>
            ))}

            <p className="py-2 font-semibold">Other Tasks from Input 2: </p>

            {differentTasks2.map((iwa) => (
              <div key={iwa.id}>
                <p className="  pb-2 bg-[#F5D3CC]">{iwa}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        sentRequest && (
          <div className="w-full flex justify-center pb-10">
            <CircularProgress />
          </div>
        )
      )}
    </div>
  );
}
