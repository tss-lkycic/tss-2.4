"use client";

import { useChat } from "ai/react";
import new_logo from "/public/new_logo.svg";
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
  const [job2, setJob2] = useState("");
  const [text2, setText2] = useState("");
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

    // if (IWAs2.length !== 0) {
    //   console.log("passed");
    handleSplitTasks(IWAs1, IWAs2);
    // }
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

        invokeTask(response);
        setTimeout(() => {
          getIWAs(response);
        }, 4000);
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
    console.log(1, list1);
    console.log(2, list2);
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
    } else {
      setIWAs2(iwa_list);
      setInput2IWA(false);
    }
  }

  async function compareInputs() {
    setInput1IWA(true);
    // setCompare(true);
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
      setUser(generateID());
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
    }, 11000);
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

  //   async function getIWAs(tasklist) {
  //     try {
  //       // Data to send in the request body

  //       const requestData = {
  //         user_id: user,
  //         task: tasklist,
  //       };
  //       console.log(requestData);

  //       // Call the second API with data in the request body
  //       const response2 = await fetch("/api/tasktoIWA", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(requestData),
  //       });
  //       const data2 = await response2.json();
  //       console.log("Response from second API:", data2);
  //       const iwas = data2.body;
  //       const iwa_arr = JSON.parse(iwas);
  //       processIWA(iwa_arr);
  //     } catch (error) {
  //       console.error("Error:", error);
  //     }
  //   }

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
        } else {
          console.log("No tasks in queue. Exiting loop.");
        }

        // Optional: Add a delay between API calls to avoid flooding the server
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
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

  return (
    <div className="bg-[#F6F6F6]  w-screen h-screen flex flex-col overflow-scroll ">
      <div className=" bg-[#474545] h-[3.5rem] flex justify-center items-center">
        <Image src={new_logo} width={40} alt="Logo" className="text-lg"></Image>
        <p className="ml-2 text-xl">S T A K</p>
      </div>
      <div className="flex flex-row w-full h-[70vh] text-[#555555]">
        <div className="flex flex-col w-1/2 h-full">
          <div className="pl-10 h-1/3 w-full flex flex-col justify-center">
            <div className="flex flex-row items-center py-2 font-medium">
              <Image
                src={new_logo}
                width={40}
                alt="Logo"
                className="text-lg"
              ></Image>
              <h3 className="ml-5 text-xl">Task STAK Compare</h3>
            </div>
            <p className="text-xs w-2/3 pt-5 pb-5 tracking-[0.10rem]">
              Task Translator explanation. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua.
            </p>
          </div>
          {/* <div className="flex flex-col h-1/4 bg-cyan-50"> */}
          <div className="px-10 h-fit flex w-full justify-between pb-5">
            <button
              className={` pr-2 ${
                queryText1 ? "text-md text-[#555555]" : "text-sm text-gray-400"
              }`}
              onClick={() => handleSelectInput1("Text")}
            >
              Paste Text
            </button>
            |
            <button
              className={` px-2 ${
                queryURL1 ? "text-md text-[#555555]" : "text-sm text-gray-400"
              }`}
              onClick={() => handleSelectInput1("URL")}
            >
              Link URL
            </button>
            |
            <button
              className={` px-2 ${
                queryPDF1 ? "text-md text-[#555555]" : "text-sm text-gray-400"
              }`}
              onClick={() => handleSelectInput1("PDF")}
            >
              Upload CV
            </button>
            |
            <button
              className={` px-2 ${
                queryJob1 ? "text-md text-[#555555]" : "text-sm text-gray-400"
              }`}
              onClick={() => handleSelectInput1("Job")}
            >
              Input Job
            </button>{" "}
            |
            <button
              className={` px-2 ${
                queryHobbies1
                  ? "text-xl text-[#555555]"
                  : "text-md text-gray-400"
              }`}
              onClick={() => handleSelectItem("Hobbies")}
            >
              Input Hobbies
            </button>
          </div>
          {queryText1 ? (
            <div className="pl-10 pr-5  text-black w-full flex flex-col">
              <textarea
                type="text"
                className="w-full h-[20rem] p-2 bg-[#D9D9D9]  text-[#555555] rounded-md"
                placeholder="Type or paste your text here..."
                onChange={handleTextChange1}
                value={text1}
              ></textarea>
            </div>
          ) : null}
          {queryURL1 ? (
            <div className="pl-10 pr-5  text-[#555555] flex flex-col">
              <input
                type="text"
                className="w-full p-2 bg-[#D9D9D9] text-black rounded-md"
                placeholder="Enter a URL here..."
                onChange={handleURLChange}
              ></input>
            </div>
          ) : null}
          {queryPDF1 ? (
            <div className="pl-10 pr-5  text-black  flex flex-col">
              <input
                type="file"
                className="text-white"
                onChange={handleFileChange}
              ></input>
            </div>
          ) : null}
          {queryJob1 ? (
            <div className="pl-10 pr-5 text-black flex flex-col">
              <input
                type="text"
                className="w-1/2 p-2 bg-[#D9D9D9] text-[#555555] rounded-md"
                value={job1}
                onChange={handleJobChange1}
                placeholder="Enter a job title here..."
              ></input>
            </div>
          ) : null}
          {/* </div> */}
        </div>

        <div className="flex flex-col w-1/2 h-full">
          <div className=" h-1/3 w-full flex flex-col justify-center">
            <div></div>
          </div>

          <div className="pl-5 pr-10 h-fit pb-5 flex justify-between w-full">
            <button
              className={` pr-2 ${
                queryText2 ? "text-md text-[#555555]" : "text-sm text-gray-400"
              }`}
              onClick={() => handleSelectInput2("Text")}
            >
              Paste Text
            </button>
            |
            <button
              className={` px-2 ${
                queryURL2 ? "text-md text-[#555555]" : "text-sm text-gray-400"
              }`}
              onClick={() => handleSelectInput2("URL")}
            >
              Link URL
            </button>
            |
            <button
              className={` px-2 ${
                queryPDF2 ? "text-md text-[#555555]" : "text-sm text-gray-400"
              }`}
              onClick={() => handleSelectInput2("PDF")}
            >
              Upload CV
            </button>
            |
            <button
              className={` px-2 ${
                queryJob2 ? "text-md text-[#555555]" : "text-sm text-gray-400"
              }`}
              onClick={() => handleSelectInput2("Job")}
            >
              Input Job
            </button>
            |
            <button
              className={` px-2 ${
                queryHobbies2
                  ? "text-xl text-[#555555]"
                  : "text-md text-gray-400"
              }`}
              onClick={() => handleSelectItem("Hobbies")}
            >
              Input Hobbies
            </button>
          </div>
          {queryText2 ? (
            <div className="pr-10 pl-5 text-black w-full flex flex-col">
              <textarea
                type="text"
                className="w-full h-[20rem] p-2 bg-[#D9D9D9] text-[#555555] rounded-md"
                placeholder="Type or paste your text here..."
                onChange={handleTextChange2}
                value={text2}
              ></textarea>
            </div>
          ) : null}
          {queryURL2 ? (
            <div className="pr-10 pl-5 text-black flex flex-col">
              <input
                type="text"
                className="w-full p-2 bg-[#D9D9D9]  text-[#555555] rounded-md"
                placeholder="Enter a URL here..."
                onChange={handleURLChange}
              ></input>
            </div>
          ) : null}
          {queryPDF2 ? (
            <div className="pr-10 pl-5 text-black  flex flex-col">
              <input
                type="file"
                className="text-white"
                onChange={handleFileChange}
              ></input>
            </div>
          ) : null}
          {queryJob2 ? (
            <div className="pr-10 pl-5  text-black flex flex-col">
              <input
                type="text"
                className="w-1/2 p-2 bg-[#D9D9D9]  text-[#555555] rounded-md"
                value={job2}
                onChange={handleJobChange2}
                placeholder="Enter a job title here..."
              ></input>
            </div>
          ) : null}
        </div>
      </div>
      {/* {compare ? (
        <div role="status" className="w-full flex my-2 justify-center">
          <svg
            aria-hidden="true"
            class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span class="sr-only">Loading...</span>
        </div>
      ) : (
        <div className="w-full flex justify-center my-2 text-[#555555]">
          <button
            onClick={compareInputs}
            className="tracking-[0.10rem] bg-[#474545] py-2 px-5 rounded-lg my-5 w-fit text-white"
          >
            Compare
          </button>
        </div>
      )} */}
      <div className="w-full text-[#555555] flex my-2 justify-center ">
        <button className="tracking-[0.10rem] bg-[#474545] mx-2 py-2 px-5 rounded-lg my-5 w-fit text-white">
          Reset
        </button>
        <button
          onClick={compareInputs}
          className="tracking-[0.10rem]  bg-[#474545] mx-2 py-2 px-5 rounded-lg my-5 w-fit text-white"
        >
          Compare
        </button>
        <button className="tracking-[0.10rem] bg-[#474545] mx-2 py-2 px-5 rounded-lg my-5 w-fit text-white">
          Save
        </button>
      </div>

      <div className="w-full bg-slate-100 flex flex-row pb-10 text-[#555555]">
        <div className="w-1/2 flex flex-col pl-10 pr-5">
          {similarTasks.map((iwa) => (
            <div key={iwa.id}>
              <p className="pb-2">{iwa}</p>
            </div>
          ))}
          {differentTasks1.map((iwa) => (
            <div key={iwa.id}>
              <p className=" pb-2 bg-[#9CD1BC]">{iwa}</p>
            </div>
          ))}
        </div>
        <div className="w-1/2 flex flex-col pl-5 pr-10">
          {similarTasks.map((iwa) => (
            <div key={iwa.id}>
              <p className=" pb-2">{iwa}</p>
            </div>
          ))}
          {differentTasks2.map((iwa) => (
            <div key={iwa.id}>
              <p className="  pb-2 bg-[#F5D3CC]">{iwa}</p>
            </div>
          ))}
        </div>
      </div>
      {/* <p className="text-3xl font-bold mb-2">Similar Tasks: {s_score}%</p> */}
      {/* <p className="text-3xl font-bold mb-2">Task Gap: {d_score}%</p> */}
    </div>
  );
}
