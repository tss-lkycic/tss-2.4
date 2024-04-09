"use client";

import { useChat } from "ai/react";
import logo from "/public/logo.svg";
import OpenAI from "openai";
import new_logo from "/public/new_logo.svg";
import transition from "/public/transition.svg";
import Image from "next/image";
// import { writeFile } from "fs/promises";
// import { createReadStream } from "fs";
import { useEffect, useState, useRef } from "react";

import CircularProgress from "@mui/material/CircularProgress";
import html2canvas from "html2canvas";

export default function Chat() {
  const { messages, append, input, handleInputChange, handleSubmit, setInput } =
    useChat();

  const [job, setJob] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [text, setText] = useState("");

  const [response, setResponse] = useState([]);
  const [IWAs, setIWAs] = useState([]);
  const responseRef = useRef(null);
  //   const [openai, setOpenai] = useState(null);
  const [user, setUser] = useState(generateID());
  const [part1, setPart1] = useState(true);
  const [part2, setPart2] = useState(false);
  const [part3, setPart3] = useState(false);
  const [part4, setPart4] = useState(false);
  const [moreTasks, setMoreTasks] = useState("");
  const [newIWAs, setNewIWAs] = useState([]);
  const [part1IWA, setPart1IWA] = useState([]);
  const [part2IWA, setPart2IWA] = useState([]);

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

  //   const openai = new OpenAI({
  //     apiKey: process.env.OPENAI_API_KEY,
  //   });

  useEffect(() => {
    console.log(IWAs);
    if (part1 === true) {
      setTimeout(() => {
        setPart1IWA(IWAs);
        console.log(part1IWA, "hello iwas from part 1");
      }, 200);
    } else if (part2 === true && IWAs.length > 0) {
      //   setNewIWAs([...newIWAs, ...IWAs]);
      setTimeout(() => {
        setNewIWAs(IWAs);
        console.log(newIWAs, "hello new iwas");
      }, 200);
    }
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
  function handleNext() {
    if (part1 === true) {
      handleNext1();
    } else if (part2 === true) {
      handleNext2();
    } else if (part3 === true) {
      handleNext3();
    } else if (part4 === true) {
      handleNext4();
    }
  }

  function handleNext1() {
    console.log("these are the jobs inputted: ", job);
    console.log("this is the resume: ", text);

    const userText = text;
    const userJobs = job;
    append({
      role: "user",
      content:
        "These are the the jobs I have done before: " +
        userJobs +
        "And this is my resume:" +
        userText +
        "Please extract and summarise tasks from my past jobs and resume into a set of sentences return them such that they are numbered. ",
    });
  }

  function handleNext2() {
    setPart2IWA([...newIWAs, ...part1IWA]);
    setPart2(false);
    setPart3(true);
  }
  function handleNext3() {
    const userHobby = hobbies;
    append({
      role: "user",
      content:
        // userHobbies +
        "For each hobby or daily activity in this list:" +
        userHobby +
        ",convert them into tasks sentences and return them such that each task is numbered. e.g. Choreograph dances or performances for events.",
    });
  }
  function handleNext4() {}

  function handleSavePart1IWAs() {
    setPart1(false);
    setPart2(true);
    setTimeout(() => {
      setIWAs([]);
    }, 3000);
  }

  function handleAddPart2IWAs() {
    // setNewIWAs(IWAs)
    // setNewIWAs([...newIWAs, ...IWAs]);
    setTimeout(() => {
      setIWAs([]);
    }, 3000);
  }
  const hiddenFileInput = useRef(null);

  const handleUpload = (event) => {
    hiddenFileInput.current.click();
  };

  const [fileContents, setFileContents] = useState("");
  const [assistantThreadId, setAssistantThreadId] = useState("");
  const [conversation, setConversation] = useState([]);
  const [pdfDataUrl, setPdfDataUrl] = useState(null);

  async function handleChange(event) {
    const fileUploaded = event.target.files[0];
    // setFileContents(fileUploaded);
    // console.log("testing");
    const reader = new FileReader();
    reader.onload = (e) => setPdfDataUrl(e.target.result);
    reader.readAsDataURL(fileUploaded);

    console.log(reader, "hello");
  }

  async function handleTest() {
    // const formData = new FormData();
    // console.log(fileContents, "helloooo");
    // formData.append("file", fileContents, fileContents.name);
    // console.log(formData, "this is formdata");
    // const response = await fetch("/api/uploadFile", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "multipart/form-data",
    //   },
    //   body: formData,
    // });
    // if (!response.ok) {
    //   console.error("Error uploading file:", response.statusText);
    //   return;
    // }
    // // Check content type for JSON or handle other formats as needed
    // const contentType = response.headers.get("Content-Type");
    // if (contentType && contentType.includes("application/json")) {
    //   const data = await response.json(); // Parse as JSON
    //   console.log("Response from API:", data);
    // } else {
    //   // Handle non-JSON response (e.g., display error message or parse differently)
    //   console.error("Unexpected response format:", contentType);
    // }
  }

  //   function createAssistant() {

  //   }

  function handleJobChange(e) {
    const jobName = e.target.value;
    setJob(jobName);
  }

  function handleTextChange(e) {
    const textContent = e.target.value;
    setText(textContent);
  }

  function handleTaskChange(e) {
    const textContent = e.target.value;
    setMoreTasks(textContent);
  }

  function handleHobbiesChange(e) {
    const hobbiesContent = e.target.value;
    setHobbies(hobbiesContent);
  }
  function handleURLChange(e) {
    const urlLink = e.target.value;
    setURL(urlLink);
  }

  function handleAdd() {
    const task = moreTasks;
    console.log(task);
    append({
      role: "user",
      content:
        task +
        // "Summarise the tasks from the text into a set of task sentences. It is very important that each task sentence itself should not have any comma inside. Each task sentence should also begin with a capital letter. Return all task sentences in a single string where each task sentence is separated by a comma. ",
        "Extract and summarise the tasks from the prior text into a set of sentences and return them such that each task is numbered. ",
    });
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
          console.log("process remainder");
          const iwas = data.body;
          const iwa_arr = JSON.parse(iwas);
          processIWA(iwa_arr);
          //   setCompleted(true);
          console.log("No tasks in queue. Exiting loop.");
          if (part1 === true) {
            // const tasks = IWAs;
            setTimeout(() => {
              handleSavePart1IWAs();
            }, 3000);
          }
          if (part2 === true) {
            setTimeout(() => {
              handleAddPart2IWAs();
            }, 3000);
          }
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
                  src={transition}
                  width={40}
                  alt="Logo"
                  className="text-lg"
                ></Image>
                <h3 className="ml-5 text-xl tracking-[0.10rem]">
                  Transition Generator
                </h3>
              </div>{" "}
              <p className="text-xs tracking-[0.10rem]">
                Utilize our transition generation capability to explore new
                career opportunities that match your unique task profile. By
                understanding the nuances of your work activities, we can
                suggest potential roles that align with your skills and
                experience, facilitating a smoother and more informed career
                transition.
              </p>
            </div>
            {part1 ? (
              <div className="flex flex-row px-10 text-xs py-5 font-semibold">
                <p>1. </p>
                <p className=" ">
                  Please list down your current and previous jobs.
                  Alternatively, you can upload your CV.
                </p>
              </div>
            ) : null}
            {part2 ? (
              <div className="flex flex-row px-10 text-xs py-5 font-semibold">
                <p>2. </p>
                <p className=" ">
                  The list of standardized task activities are generated based
                  on your input. You may add to the list of standardize task
                  activities below. Once you are satisfied, click 'Next' to
                  proceed to the next step.
                </p>
              </div>
            ) : null}
            {part3 ? (
              <div className="flex flex-row px-10 text-xs py-5 font-semibold">
                <p>3. </p>
                <p className=" ">
                  List down your hobbies and leisure activities that you wish to
                  translate to your potential career paths.
                </p>
              </div>
            ) : null}
            {part4 ? (
              <div className="flex flex-row px-10 text-xs py-5 font-semibold">
                <p>4. </p>
                <p className=" ">
                  Are there anything you want to add? (Placeholder for
                  life-balance indicator)
                </p>
              </div>
            ) : null}
          </div>
          {part1 ? (
            <div className="px-10 text-black flex flex-col mt-5">
              <input
                type="text"
                className=" tracking-[0.10rem] w-full p-2 bg-[#D9D9D9] text-[#555555] rounded-md "
                value={job}
                onChange={handleJobChange}
                placeholder="E.g. Frontend Developer, Project Manager, UIUX Intern..."
              ></input>
              <textarea
                type="text"
                onChange={handleTextChange}
                value={text}
                placeholder="Paste your Resume/CV here..."
                className="p-2 my-2  w-full h-[10rem] bg-[#D9D9D9] text-[#555555] rounded-md tracking-[0.10rem]"
              ></textarea>
            </div>
          ) : null}
          {part2 ? (
            <div className="px-10 text-black flex flex-col mt-5">
              <textarea
                type="text"
                onChange={handleTaskChange}
                value={moreTasks}
                placeholder="e.g. Create posters and infographics, organise and plan events..."
                className="p-2 my-2  w-full h-[10rem] bg-[#D9D9D9] text-[#555555] rounded-md tracking-[0.10rem]"
              ></textarea>
            </div>
          ) : null}
          {part3 ? (
            <div className="px-10 text-black flex flex-col mt-5">
              <textarea
                type="text"
                onChange={handleHobbiesChange}
                value={hobbies}
                placeholder="e.g. dancing, cooking and meal prep, arts and crafts..."
                className="p-2 my-2  w-full h-[10rem] bg-[#D9D9D9] text-[#555555] rounded-md tracking-[0.10rem]"
              ></textarea>
            </div>
          ) : null}

          {/* <div className="px-10 py-10 text-black  flex flex-col">
            <button
              onClick={handleUpload}
              className="bg-[#D9D9D9] text-[#555555] rounded-md tracking-[0.10rem] w-full h-[10rem] p-2 flex flex-col justify-center items-center"
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
          </div>{" "} */}
          {part2 ? (
            <div className="w-full flex justify-end px-10">
              <button
                onClick={handleAdd}
                className=" bg-[#737171] py-1 px-12 text-white w-fit tracking-[0.10rem] rounded-md ml-10"
              >
                Add
              </button>
            </div>
          ) : null}

          <div className="w-full">
            <button
              onClick={handleNext}
              className=" bg-[#474545] py-1 px-12 text-white w-fit tracking-[0.10rem] rounded-md ml-10"
            >
              Next
            </button>
          </div>
        </div>

        <div className="flex flex-col w-1/2 h-full p-5">
          <div className="w-full h-2/5 "></div>
          {/* {!completed && sentRequest && (
            <div className="w-full  flex">
              <CircularProgress color="inherit" />
            </div>
          )} */}
          {part2 && (
            <div className="w-full h-3/5 pb-10">
              {part1IWA.map((p1iwa) => (
                <div className="flex flex-row items-center" key={p1iwa.id}>
                  <p className="ml-2 pb-2 tracking-[0.10rem]">{p1iwa}</p>
                </div>
              ))}
              {newIWAs.length > 0 && (
                <div className="mt-[1rem]">
                  <p>New Standard Work Activities</p>
                  {newIWAs.map((niwa) => (
                    <div className="flex flex-row items-center" key={niwa.id}>
                      <p className="ml-2 pb-2 tracking-[0.10rem]">{niwa}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
