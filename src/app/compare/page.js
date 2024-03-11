"use client";

import { useChat } from "ai/react";
import logo from "/public/logo.svg";
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
  const [queryJob1, setQueryJob1] = useState(false);
  const [queryURL2, setQueryURl2] = useState(false);
  const [queryText2, setQueryText2] = useState(true);
  const [queryPDF2, setQueryPDF2] = useState(false);
  const [queryJob2, setQueryJob2] = useState(false);
  const [job1, setJob1] = useState("");
  const [text1, setText1] = useState("");
  const [job2, setJob2] = useState("");
  const [text2, setText2] = useState("");
  const [response, setResponse] = useState([]);
  const [IWAs, setIWAs] = useState([]);
  const [IWAs1, setIWAs1] = useState([]);
  const [IWAs2, setIWAs2] = useState([]);
  const [similarTasks, setSimilarTasks] = useState([]);
  const [differentTasks, setDifferentTasks] = useState([]);
  const [s_score, setSScore] = useState(0);
  const [d_score, setDScore] = useState(0);
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
    console.log("IWAs 1: ", IWAs1);
  }, [IWAs1]);
  useEffect(() => {
    console.log("IWAs 2: ", IWAs2);
    if (IWAs2.length !== 0) {
      console.log("passed");
      handleSplitTasks(IWAs1, IWAs2);
    }
  }, [IWAs2]);

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
    }, 500); // Adjust the delay time as needed

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

  function handleSplitTasks(list1, list2) {
    // Initialize arrays to store similar and different strings
    const similarStrings = [];
    const differentStrings = [];

    // Iterate over each string in list1
    list1.forEach((string1) => {
      // Check if the string exists in list2
      if (list2.includes(string1)) {
        // If it does, add it to the similarStrings array
        similarStrings.push(string1);
      } else {
        // If it doesn't, add it to the differentStrings array
        differentStrings.push(string1);
      }
    });

    // // Iterate over each string in list2
    // list2.forEach((string2) => {
    //   // Check if the string exists in list1 (to avoid duplicates)
    //   if (!list1.includes(string2)) {
    //     // Add it to the differentStrings array
    //     differentStrings.push(string2);
    //   }
    // });
    console.log("similar", similarStrings);
    console.log("diff", differentStrings);

    setSimilarTasks(similarStrings);
    setDifferentTasks(differentStrings);
    getScores(similarStrings, IWAs2);
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

  function handleSelectInput1(value) {
    setInput1(value);
    if (value === "URL") {
      setQueryURl1(true);
      setQueryText1(false);
      setQueryPDF1(false);
      setQueryJob1(false);
    } else if (value === "Text") {
      setQueryURl1(false);
      setQueryText1(true);
      setQueryPDF1(false);
      setQueryJob1(false);
    } else if (value === "PDF") {
      setQueryURl1(false);
      setQueryText1(false);
      setQueryPDF1(true);
      setQueryJob1(false);
    } else if (value === "Job") {
      setQueryURl1(false);
      setQueryText1(false);
      setQueryPDF1(false);
      setQueryJob1(true);
    }
  }
  function handleSelectInput2(value) {
    setInput2(value);
    if (value === "URL") {
      setQueryURl2(true);
      setQueryText2(false);
      setQueryPDF2(false);
      setQueryJob2(false);
    } else if (value === "Text") {
      setQueryURl2(false);
      setQueryText2(true);
      setQueryPDF2(false);
      setQueryJob2(false);
    } else if (value === "PDF") {
      setQueryURl2(false);
      setQueryText2(false);
      setQueryPDF2(true);
      setQueryJob2(false);
    } else if (value === "Job") {
      setQueryURl2(false);
      setQueryText2(false);
      setQueryPDF2(false);
      setQueryJob2(true);
    }
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
  function handleURLChange(e) {
    const urlLink = e.target.value;
    setURL(urlLink);
  }
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
    } else if (input2iwa === true) {
      setIWAs2(iwa_list);
      setInput2IWA(false);
    }
  }

  async function compareInputs() {
    setInput1IWA(true);
    if (input1 === "Text") {
      console.log("input 1 is text");
      getTasksFromText1();
    } else if (input1 === "URL") {
      console.log("input 1 is url");
    } else if (input1 === "File") {
      console.log("input 1 is file");
    } else if (input1 === "Job") {
      console.log("input 1 is job");
      getTasksFromJob1();
    }
    setTimeout(() => {
      setInput1IWA(false);
      setInput2IWA(true);
      if (input2 === "Text") {
        console.log("input 2 is text");
        getTasksFromText2();
      } else if (input2 === "URL") {
        console.log("input 2 is url");
      } else if (input2 === "File") {
        console.log("input 2 is url");
      } else if (input2 === "Job") {
        console.log("input 2 is job");
        getTasksFromJob2();
      }
    }, 5000);
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
  function getTasksFromJob1() {
    const userJob = job1;
    append({
      role: "user",
      content:
        "Create a list of tasks for the job," +
        userJob +
        "," +
        "  even if the job does not exist yet, into a set of 8 short sentences and return them such that each task is numbered. ",
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
        "  even if the job does not exist yet, into a set of 8 short sentences and return them such that each task is numbered. ",
    });
  }

  return (
    <div className="bg-gradient-to-b from-[#464444] to-black w-screen h-screen flex flex-col">
      <Image src={logo} width={60} alt="Logo" className="m-5"></Image>
      <div className="flex flex-row w-full h-full">
        <div className="flex flex-col w-1/2 h-full">
          <h3 className="pl-5 pt-10 font-semibold">Select input 1</h3>
          <div className="p-5">
            <button
              className={` pr-2 ${
                queryText1 ? "text-xl text-white" : "text-md text-gray-400"
              }`}
              onClick={() => handleSelectInput1("Text")}
            >
              Text
            </button>
            |
            <button
              className={` px-2 ${
                queryURL1 ? "text-xl text-white" : "text-md text-gray-400"
              }`}
              onClick={() => handleSelectInput1("URL")}
            >
              URL
            </button>
            |
            <button
              className={` px-2 ${
                queryPDF1 ? "text-xl text-white" : "text-md text-gray-400"
              }`}
              onClick={() => handleSelectInput1("PDF")}
            >
              PDF
            </button>
            |
            <button
              className={` px-2 ${
                queryJob1 ? "text-xl text-white" : "text-md text-gray-400"
              }`}
              onClick={() => handleSelectInput1("Job")}
            >
              Job
            </button>
          </div>
          {queryText1 ? (
            <div className="pl-5 text-black w-full flex flex-col">
              <textarea
                type="text"
                className="w-full h-[20rem] p-2"
                placeholder="Type or paste your text here..."
                onChange={handleTextChange1}
                value={text1}
              ></textarea>
            </div>
          ) : null}
          {queryURL1 ? (
            <div className="pl-5 text-black flex flex-col">
              <input
                type="text"
                className="w-full p-2"
                placeholder="Enter a URL here..."
                onChange={handleURLChange}
              ></input>
            </div>
          ) : null}
          {queryPDF1 ? (
            <div className="pl-5 text-black  flex flex-col">
              <input
                type="file"
                className="text-white"
                onChange={handleFileChange}
              ></input>
            </div>
          ) : null}
          {queryJob1 ? (
            <div className="pl-5 text-black flex flex-col">
              <input
                type="text"
                className="w-1/2 p-2"
                value={job1}
                onChange={handleJobChange1}
                placeholder="Enter a job title here..."
              ></input>
            </div>
          ) : null}
          <h3 className="pl-5 pt-5 font-semibold">Select input 2</h3>
          <div className="p-5">
            <button
              className={` pr-2 ${
                queryText2 ? "text-xl text-white" : "text-md text-gray-400"
              }`}
              onClick={() => handleSelectInput2("Text")}
            >
              Text
            </button>
            |
            <button
              className={` px-2 ${
                queryURL2 ? "text-xl text-white" : "text-md text-gray-400"
              }`}
              onClick={() => handleSelectInput2("URL")}
            >
              URL
            </button>
            |
            <button
              className={` px-2 ${
                queryPDF2 ? "text-xl text-white" : "text-md text-gray-400"
              }`}
              onClick={() => handleSelectInput2("PDF")}
            >
              PDF
            </button>
            |
            <button
              className={` px-2 ${
                queryJob2 ? "text-xl text-white" : "text-md text-gray-400"
              }`}
              onClick={() => handleSelectInput2("Job")}
            >
              Job
            </button>
          </div>
          {queryText2 ? (
            <div className="pl-5 text-black w-full flex flex-col">
              <textarea
                type="text"
                className="w-full h-[20rem] p-2"
                placeholder="Type or paste your text here..."
                onChange={handleTextChange2}
                value={text2}
              ></textarea>
            </div>
          ) : null}
          {queryURL2 ? (
            <div className="pl-5 text-black flex flex-col">
              <input
                type="text"
                className="w-full p-2"
                placeholder="Enter a URL here..."
                onChange={handleURLChange}
              ></input>
            </div>
          ) : null}
          {queryPDF2 ? (
            <div className="pl-5 text-black  flex flex-col">
              <input
                type="file"
                className="text-white"
                onChange={handleFileChange}
              ></input>
            </div>
          ) : null}
          {queryJob2 ? (
            <div className="pl-5 text-black flex flex-col">
              <input
                type="text"
                className="w-1/2 p-2"
                value={job2}
                onChange={handleJobChange2}
                placeholder="Enter a job title here..."
              ></input>
            </div>
          ) : null}
          <button
            onClick={compareInputs}
            className=" bg-gray-500 p-2 my-5 w-fit text-white self-end"
          >
            Compare
          </button>
        </div>

        <div className="flex flex-col w-1/2 h-full p-5">
          {/* <p className=" text-3xl font-bold mb-2">Tasks from text: </p> */}
          {/* {response.map((r) => (
            <div key={r.id}>
              <p className="text-white text-xl pb-1">•{r}</p>
            </div>
          ))} */}
          <p className="text-3xl font-bold mb-2">IWAs from input 1: </p>
          {IWAs1.map((iwa) => (
            <div key={iwa.id}>
              <p className="text-white text-xl pb-1">•{iwa}</p>
            </div>
          ))}{" "}
          <p className="text-3xl font-bold mb-2">IWAs from input 2: </p>
          {IWAs2.map((iwa) => (
            <div key={iwa.id}>
              <p className="text-white text-xl pb-1">•{iwa}</p>
            </div>
          ))}
          <p className="text-3xl font-bold mb-2">Similar Tasks: {s_score}%</p>
          {similarTasks.map((iwa) => (
            <div key={iwa.id}>
              <p className="text-white text-xl pb-1">•{iwa}</p>
            </div>
          ))}
          <p className="text-3xl font-bold mb-2">Task Gap: {d_score}%</p>
          {differentTasks.map((iwa) => (
            <div key={iwa.id}>
              <p className="text-white text-xl pb-1">•{iwa}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
