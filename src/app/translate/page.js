"use client";

import { useChat } from "ai/react";
import logo from "/public/logo.svg";
import new_logo from "/public/new_logo.svg";
import translate from "/public/translate.svg";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import OpenAI from "openai";
import Link from "next/link";
import CircularProgress from "@mui/material/CircularProgress";
import DownloadIcon from "@mui/icons-material/Download";
import html2canvas from "html2canvas";

export default function Chat() {
  const { messages, append, input, handleInputChange, handleSubmit, setInput } =
    useChat();
  const [queryType, setQueryType] = useState("Text");
  const [job, setJob] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [text, setText] = useState("");
  const [url, setURL] = useState("");
  const [response, setResponse] = useState([]);
  const [IWAs, setIWAs] = useState([]);
  const responseRef = useRef(null);
  const [user, setUser] = useState(generateID());
  const [loading, setLoading] = useState(false);

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
    console.log("useeffect log of IWA", IWAs);
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
        }, 3000);
      }
    }, 1500); // Adjust the delay time as needed

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

  function handleItemSelect(queryOption) {
    setQueryType(queryOption);
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
    setLoading(true);
    if (queryType === "Text") {
      getTasksFromText();
    } else if (queryType === "URL") {
    } else if (queryType === "File") {
    } else if (queryType === "Job") {
      getTasksFromJob();
    } else if (queryType === "Hobbies") {
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

  function handleFileChange(e) {
    console.log(e.target);
  }

  function restartPage() {
    setIWAs([]);
    setHobbies("");
    setText("");
    setURL("");
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

  const getButtonClass = (type) => {
    return queryType === type
      ? "px-2 tracking-[0.10rem] text-md text-[#555555]"
      : "px-2 tracking-[0.10rem] text-sm text-gray-400";
  };

  function DescAndInput({ queryType }) {
    const content = {
      text: {
        description:
          "Please submit the text you wish to convert into standardized task activities. This can be a job description, course description, or your resume content.",
        input: (
          <textarea
            type="text"
            value={text}
            className="tracking-[0.10rem] w-full h-[15rem] p-2 bg-[#D9D9D9] text-[#555555] rounded-md"
            placeholder="Type or paste your text here..."
            onChange={handleTextChange}
          ></textarea>
        ),
      },
      url: {
        description:
          "Please submit the URL with content that can be translated into standardized task activities. This can be a link to a job description, course description, or your resume.",
        input: (
          <input
            value={url}
            type="text"
            className=" tracking-[0.10rem] w-full p-2 bg-[#D9D9D9] text-[#555555] rounded-md "
            placeholder="Enter a URL here..."
            onChange={handleURLChange}
          ></input>
        ),
      },
      pdf: {
        description:
          "Please upload the file that has content that can be translated into standardized task activities. This can be a job description, course description, or your resume.",
        input: (
          <input
            type="file"
            id="file"
            className="hidden"
            onChange={handleChange}
            ref={hiddenFileInput}
          ></input>
        ),
      },
      job: {
        description:
          "Please input a job title to generate a list of its standardized task activities.",
        input: (
          <input
            type="text"
            className=" tracking-[0.10rem] w-full p-2 bg-[#D9D9D9] text-[#555555] rounded-md "
            value={job}
            onChange={handleJobChange}
            placeholder="Enter a job title here..."
          ></input>
        ),
      },
      hobbies: {
        description:
          "Please input a list of hobbies and/or daily activities to generate a list of its standardized task activities.",
        input: (
          <textarea
            type="text"
            className="tracking-[0.10rem] w-full h-[15rem] p-2 bg-[#D9D9D9] text-[#555555] rounded-md"
            placeholder="List down your hobbies and/or daily activities"
            value={hobbies}
            onChange={handleHobbiesChange}
          ></textarea>
        ),
      },
    };
    const query = queryType.toLowerCase();

    return (
      <div>
        <p className="px-10 text-xs pb-5">{content[query].description}</p>
        <div className="px-10 text-black w-full flex flex-col">
          {content[query].input}
        </div>
        <div className="px-10 flex gap-5">
          <button
            onClick={handleGenerate}
            className=" bg-[#474545] py-2 px-5 text-white w-1/4 tracking-[0.10rem] rounded-md mt-5"
          >
            Generate
          </button>
          <button
            onClick={restartPage}
            className=" bg-[#737171] py-2 px-5 text-white w-1/4 tracking-[0.10rem] rounded-md mt-5"
          >
            <RestartAltIcon className="mr-3 text-[1.5rem]"></RestartAltIcon>
            Reset
          </button>
          <button
            onClick={downloadImage}
            className=" bg-[#737171] py-2 px-5 w-1/4 text-white tracking-[0.10rem] rounded-md mt-5"
          >
            <DownloadIcon className="mr-3 text-[1.5rem]" />
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-[#F6F6F6] w-screen h-screen flex flex-col overflow-scroll"
      id="results"
    >
      <Link href="/">
        <div className=" bg-[#474545] h-[3.5rem] flex justify-center items-center">
          <Image src={new_logo} width={40} alt="Logo" className="m-2"></Image>
          <p className="ml-5 text-xl  text-white tracking-[0.5rem]">S T A K</p>
        </div>
      </Link>

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
              </div>
              <p className="text-xs tracking-[0.10rem]">
                Translate your daily tasks into industry-recognized activities
                to provide a clear, standardized representation of your
                professional contributions.
              </p>
            </div>
            <div className="px-8 pt-5 pb-5 justify-between">
              <button
                className={getButtonClass("Text")}
                onClick={() => handleItemSelect("Text")}
              >
                Paste Text
              </button>
              |
              <button
                className={getButtonClass("URL")}
                onClick={() => handleItemSelect("URL")}
              >
                Link URL
              </button>
              |
              <button
                className={getButtonClass("PDF")}
                onClick={() => handleItemSelect("PDF")}
              >
                Upload CV
              </button>
              |
              <button
                className={getButtonClass("Job")}
                onClick={() => handleItemSelect("Job")}
              >
                Input Job
              </button>
              |
              <button
                className={getButtonClass("Hobbies")}
                onClick={() => handleItemSelect("Hobbies")}
              >
                Input Hobbies
              </button>
            </div>

            <DescAndInput queryType={queryType} />
          </div>
        </div>

        <div className="flex flex-col w-1/2 h-full p-5">
          <div className="w-full h-2/5 "></div>
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
    </div>
  );
}
