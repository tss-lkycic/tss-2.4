"use client";

import { useChat } from "ai/react";
import logo from "/public/logo.svg";
import new_logo from "/public/new_logo.svg";
import translate from "/public/translate.svg";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import OpenAI from "openai";
import CircularProgress from "@mui/material/CircularProgress";
import html2canvas from "html2canvas";

export default function Chat() {
  const { messages, append, input, handleInputChange, handleSubmit, setInput } =
    useChat();

  const [inputtype, setInputType] = useState("Text");
  const [queryURL, setQueryURl] = useState(false);
  const [queryText, setQueryText] = useState(true);
  const [queryPDF, setQueryPDF] = useState(false);
  const [queryJob, setQueryJob] = useState(false);
  const [queryHobbies, setQueryHobbies] = useState(false);
  const [job, setJob] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [text, setText] = useState("");
  const [url, setURL] = useState("");
  const [response, setResponse] = useState([]);
  const [IWAs, setIWAs] = useState([]);
  const responseRef = useRef(null);
  const [user, setUser] = useState(generateID());
  const [completed, setCompleted] = useState(false);
  const [sentRequest, setSentRequest] = useState(false);

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
    const length = 7;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      id += characters.charAt(randomIndex);
    }

    return id;
  }

  function handleSelectItem(value) {
    setInputType(value);
    if (value === "URL") {
      setQueryURl(true);
      setQueryText(false);
      setQueryPDF(false);
      setQueryJob(false);
      setQueryHobbies(false);
    } else if (value === "Text") {
      setQueryURl(false);
      setQueryText(true);
      setQueryPDF(false);
      setQueryJob(false);
      setQueryHobbies(false);
    } else if (value === "PDF") {
      setQueryURl(false);
      setQueryText(false);
      setQueryPDF(true);
      setQueryJob(false);
      setQueryHobbies(false);
    } else if (value === "Job") {
      setQueryURl(false);
      setQueryText(false);
      setQueryPDF(false);
      setQueryJob(true);
      setQueryHobbies(false);
    } else if (value === "Hobbies") {
      setQueryURl(false);
      setQueryText(false);
      setQueryPDF(false);
      setQueryJob(false);
      setQueryHobbies(true);
    }
    setIWAs([]);
    setUser(generateID());
  }

  const hiddenFileInput = useRef(null);

  const handleUpload = (event) => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    handleFile(fileUploaded);
  };

  function handleGenerate() {
    setSentRequest(true);
    if (inputtype === "Text") {
      getTasksFromText();
    } else if (inputtype === "URL") {
    } else if (inputtype === "File") {
    } else if (inputtype === "Job") {
      getTasksFromJob();
    } else if (inputtype === "Hobbies") {
      getTasksFromHobbies();
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
  function handleURLChange(e) {
    const urlLink = e.target.value;
    setURL(urlLink);
  }

  function handleReset() {
    setIWAs([]);
    setHobbies("");
    setText("");
    setURL("");
    setJob("");
    generateID();
    setCompleted(false);
    setSentRequest(false);
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
    setIWAs(iwa_list);
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
        } else {
          console.log("No tasks in queue. Exiting loop.");
          console.log("process remainder");
          const iwas = data.body;
          const iwa_arr = JSON.parse(iwas);
          processIWA(iwa_arr);
          setCompleted(true);
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

  // const downloadImage = () => {
  //   // Capture the entire document
  //   html2canvas(document.body, { scrollY: -window.scrollY }).then(function (
  //     canvas
  //   ) {
  //     const link = document.createElement("a");
  //     link.download = "entire_page.png";
  //     link.href = canvas.toDataURL("image/png");
  //     link.click();
  //   });
  // };

  function getTasksFromFile() {}
  function getTasksFromURL() {}

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
  function getTasksFromHobbies() {
    const userHobbies = hobbies;
    append({
      role: "user",
      content:
        // userHobbies +
        "For each hobby or daily activity in this list:" +
        userHobbies +
        ",convert them into tasks sentences and return them such that each task is numbered. e.g. Choreograph dances or performances for events.",
    });
  }

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
    <div
      className="bg-[#F6F6F6] w-screen h-screen flex flex-col overflow-scroll"
      id="results"
    >
      <div className=" bg-[#474545] h-[3.5rem] flex justify-center items-center">
        <Image src={new_logo} width={40} alt="Logo" className="m-2"></Image>
        <p className="ml-5 text-xl tracking-[0.5rem]">S T A K</p>
      </div>

      <div className="flex flex-row w-full h-full  text-[#555555] ">
        <div className="flex flex-col w-1/2 h-full  tracking-[0.10rem]">
          <div className="w-full h-2/5">
            <div className="px-10 pt-5 w-2/3">
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
              </div>{" "}
              <p className="text-xs tracking-[0.10rem]">
                Translate your daily tasks into industry-recognized activities
                to provide a clear, standardized representation of your
                professional contributions.
              </p>
            </div>
            <div className="px-10 pt-5 pb-5  justify-between ">
              <button
                className={` pr-2 tracking-[0.10rem] ${
                  queryText ? "text-md text-[#555555]" : "text-sm text-gray-400"
                }`}
                onClick={() => handleSelectItem("Text")}
              >
                Paste Text
              </button>
              |
              <button
                className={` px-2 tracking-[0.10rem] ${
                  queryURL ? "text-md text-[#555555]" : "text-sm text-gray-400"
                }`}
                onClick={() => handleSelectItem("URL")}
              >
                Link URL
              </button>
              |
              <button
                className={` px-2 tracking-[0.10rem] ${
                  queryPDF ? "text-md text-[#555555]" : "text-sm text-gray-400"
                }`}
                onClick={() => handleSelectItem("PDF")}
              >
                Upload CV
              </button>
              |
              <button
                className={` px-2 tracking-[0.10rem] ${
                  queryJob ? "text-md text-[#555555]" : "text-sm text-gray-400"
                }`}
                onClick={() => handleSelectItem("Job")}
              >
                Input Job
              </button>
              |
              <button
                className={` px-2 tracking-[0.10rem] ${
                  queryHobbies
                    ? "text-md text-[#555555]"
                    : "text-sm text-gray-400"
                }`}
                onClick={() => handleSelectItem("Hobbies")}
              >
                Input Hobbies
              </button>
            </div>
            {queryText ? (
              <p className="px-10 text-xs pb-5">
                Please submit the text you wish to convert into standardized
                task activities. This can be a job description, course
                description, or your resume content.
              </p>
            ) : null}
            {queryURL ? (
              <p className="px-10 text-xs pb-5">
                Please submit the URL with content that can be translated into
                standardized task activities. This can be a link to a job
                description, course description, or your resume.
              </p>
            ) : null}
            {queryPDF ? (
              <p className="px-10 text-xs pb-5">
                Please upload the file that has content that can be translated
                into standardized task activities. This can be a job
                description, course description, or your resume.
              </p>
            ) : null}
            {queryJob ? (
              <p className="px-10 text-xs pb-5">
                Please input a job title to generate a list of its standardized
                task activities.
              </p>
            ) : null}
            {queryHobbies ? (
              <p className="px-10 text-xs pb-5">
                Please input a list of hobbies and/or daily activities to
                generate a list of its standardized task activities.
              </p>
            ) : null}
          </div>

          {queryText ? (
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
          {queryURL ? (
            <div className="px-10 text-black flex flex-col">
              <input
                value={url}
                type="text"
                className=" tracking-[0.10rem] w-full p-2 bg-[#D9D9D9] text-[#555555] rounded-md "
                placeholder="Enter a URL here..."
                onChange={handleURLChange}
              ></input>
            </div>
          ) : null}
          {queryPDF ? (
            <div className="px-10 text-black  flex flex-col">
              <button
                onClick={handleUpload}
                className="bg-[#D9D9D9] text-[#555555] rounded-md tracking-[0.10rem] w-full h-[15rem] p-2 flex flex-col justify-center items-center"
              >
                Select File Here
              </button>
              <input
                type="file"
                id="file"
                className="hidden"
                onChange={handleChange}
                // onChange={handleFileChange}
                ref={hiddenFileInput}
              ></input>
            </div>
          ) : null}
          {queryJob ? (
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
          {queryHobbies ? (
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
          <div className="px-10 flex gap-5">
            <button
              onClick={handleGenerate}
              className=" bg-[#474545] py-2 px-5 text-white w-1/4 tracking-[0.10rem] rounded-md mt-5"
            >
              Generate
            </button>
            <button
              onClick={handleReset}
              className=" bg-[#474545] py-2 px-5 text-white w-1/4 tracking-[0.10rem] rounded-md mt-5"
            >
              Reset
            </button>
            <button
              onClick={downloadImage}
              className=" bg-[#474545] py-2 px-5 w-1/4 text-white tracking-[0.10rem] rounded-md mt-5"
            >
              Save
            </button>
          </div>
        </div>

        <div className="flex flex-col w-1/2 h-full p-5">
          <div className="w-full h-2/5 "></div>
          {!completed && sentRequest && (
            <div className="w-full  flex">
              <CircularProgress color="inherit" />
            </div>
          )}
          <div className="w-full h-3/5 pb-10">
            {IWAs.map((iwa) => (
              <div className="flex flex-row items-center" key={iwa.id}>
                <p className=" ml-2 pb-2 tracking-[0.10rem]">{iwa}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
