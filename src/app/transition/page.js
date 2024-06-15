"use client";

import { useChat } from "ai/react";
import logo from "/public/logo.svg";
import OpenAI from "openai";
import Link from "next/link";
import new_logo from "/public/new_logo.svg";
import transition from "/public/transition.svg";
import Image from "next/image";
// import { writeFile } from "fs/promises";
// import { createReadStream } from "fs";
import { useEffect, useState, useRef } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CircularProgress from "@mui/material/CircularProgress";
import html2canvas from "html2canvas";
import { common } from "@mui/material/colors";

export default function Chat() {
  const { messages, append, input, handleInputChange, handleSubmit, setInput } =
    useChat();

  const [job, setJob] = useState("");
  const [genjob, setGenJob] = useState("");
  const [genjobIWA, setGenJobIWA] = useState([]);
  const [hobbies, setHobbies] = useState("");
  const [text, setText] = useState("");

  const [response, setResponse] = useState([]);
  const [IWAs, setIWAs] = useState([]);
  const responseRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(generateID());
  const [part1, setPart1] = useState(true);
  const [part2, setPart2] = useState(false);
  const [part3, setPart3] = useState(false);
  const [part4, setPart4] = useState(false);
  const [final, setFinal] = useState(false);
  const [moreTasks, setMoreTasks] = useState("");
  const [newIWAs, setNewIWAs] = useState([]);
  const [part1IWA, setPart1IWA] = useState([]);
  const [part2IWA, setPart2IWA] = useState([]);
  const [part3IWA, setPart3IWA] = useState([]);
  const [considerations, setConsiderations] = useState([]);
  const [getAdjacent, setGetAdjacent] = useState(false);
  const [getEmerging, setGetEmerging] = useState(false);
  const [getGig, setGetGig] = useState(false);
  const [adjacentJobs, setAdjacentJobs] = useState([]);
  const [emergingJobs, setEmergingJobs] = useState([]);
  const [gigJobs, setGigJobs] = useState([]);
  const [same, setSame] = useState("-");
  const [same_list, setSameList] = useState([]);
  const [diff, setDiff] = useState("-");
  const [diff_list, setDiffList] = useState([]);

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
    console.log("iwas", IWAs);
    if (part1 === true) {
      setTimeout(() => {
        setPart1IWA(IWAs);
        console.log(part1IWA, "hello iwas from part 1");
      }, 200);
    }
    if (part3 === true) {
      setTimeout(() => {
        const newiwa = IWAs;
        setNewIWAs(newiwa);
        console.log(newiwa, "hello new iwas from part 3");
      }, 200);
    }
    if (final === true && IWAs.length > 0) {
      setTimeout(() => {
        console.log("genjobiwa", IWAs);
        getSimilar();
      }, 200);
    }
  }, [IWAs]);

  useEffect(() => {
    if (newIWAs.length > 0) {
      const combinedIWAs = new Set([...part1IWA, ...newIWAs]);
      const uniqueIWAs = Array.from(combinedIWAs);
      setPart3IWA(uniqueIWAs);

      setPart3(false);
      setLoading(false);
      setPart4(true);
      setTimeout(() => {
        setIWAs([]);
      }, 3000);
    }
  }, [newIWAs]);

  const dummy = ["job1", "job2", "job3"];

  useEffect(() => {
    if (adjacentJobs.length > 0 && part4 === true) {
      console.log("hello 1");
      generateEmergingJobs();
    }
  }, [getAdjacent]);
  useEffect(() => {
    if (getEmerging === false && part4 === true) {
      console.log("hello 2");
      generateGigJobs();
    }
  }, [getEmerging]);

  useEffect(() => {
    if (getGig === false && part4 === true) {
      console.log("hello 3");
      setPart4(false);
      setLoading(false);
      setFinal(true);
    }
  }, [getGig]);
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
        if (getAdjacent === true) {
          console.log("helloooooo");
          setAdjacentJobs(response);
          setGetAdjacent(false);
          setGetEmerging(true);
        } else if (getEmerging === true) {
          setEmergingJobs(response);
          setGetEmerging(false);

          setGetGig(true);
        } else if (getGig === true) {
          setGigJobs(response);
          setGetGig(false);
        } else if (part4 === false) {
          invokeTask(response);
          setTimeout(() => {
            getIWAs(response);
          }, 3000);
        }
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
      //   handleNext2();
    } else if (part3 === true) {
      handleNext3();
    } else if (part4 === true) {
      handleNext4();
    }
  }

  function handleNext1() {
    setLoading(true);
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

  function restartCompare() {
    setSame("-");
    setDiff("-");
    setGenJob("");
    setSameList([]);
    setDiffList([]);
  }

  function handleNext3() {
    setLoading(true);
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
  function handleNext4() {
    setLoading(true);
    setGetAdjacent(true);
    generateAdjacentJobs();
    // setFinal(true);
  }

  function handleSavePart1IWAs() {
    setPart1(false);
    setLoading(false);
    setPart3(true);
    setTimeout(() => {
      setIWAs([]);
    }, 3000);
  }

  //   function handleAddPart2IWAs() {
  //     // setNewIWAs(IWAs)
  //     // setNewIWAs([...newIWAs, ...IWAs]);
  //     setTimeout(() => {
  //       setIWAs([]);
  //     }, 3000);
  //   }

  //   function handleAddPart3IWAs() {
  //     // setNewIWAs(IWAs)
  //     // setNewIWAs([...newIWAs, ...IWAs]);

  //     console.log(part1IWA, "og iwa");
  //     console.log(IWAs, "new iwa");
  //     console.log(newIWAs, "newiwa");
  //     const combinedIWAs = new Set([...part1IWA, ...newIWAs]);
  //     const uniqueIWAs = Array.from(combinedIWAs);
  //     setPart3IWA(uniqueIWAs);

  //     setPart3(false);
  //     setPart4(true);
  //     setTimeout(() => {
  //       setIWAs([]);
  //     }, 3000);
  //   }
  //   function handleGetFinalIWAs() {
  //     // const jobbiwa = IWAs;
  //     // console.log("new job iwas1", IWAs);
  //     // console.log("new job iwas2", jobbiwa);
  //     // setGenJobIWA(jobbiwa);
  //     setTimeout(() => {
  //       //   getSimilar(jobbiwa);
  //       getSimilar();
  //     }, 3000);
  //   }

  const hiddenFileInput = useRef(null);

  const handleUpload = (event) => {
    hiddenFileInput.current.click();
  };

  //   const [fileContents, setFileContents] = useState("");
  //   const [assistantThreadId, setAssistantThreadId] = useState("");
  //   const [conversation, setConversation] = useState([]);
  //   const [pdfDataUrl, setPdfDataUrl] = useState(null);

  async function handleChange(event) {
    const fileUploaded = event.target.files[0];
    // setFileContents(fileUploaded);
    // console.log("testing");
    const reader = new FileReader();
    reader.onload = (e) => setPdfDataUrl(e.target.result);
    reader.readAsDataURL(fileUploaded);

    console.log(reader, "hello");
  }

  function handleJobChange(e) {
    const jobName = e.target.value;
    setJob(jobName);
  }
  function handleGenJobChange(e) {
    const genjobName = e.target.value;
    setGenJob(genjobName);
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

  const toggleConsideration = (word) => {
    if (considerations.includes(word)) {
      // If the word is already in the array, remove it
      setConsiderations(considerations.filter((item) => item !== word));
    } else {
      // If the word is not in the array, add it
      setConsiderations([...considerations, word]);
    }
  };

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
          // processIWA(iwa_arr);
          setIWAs(iwa_arr);
        } else {
          console.log("process remainder");
          const iwas = data.body;
          const iwa_arr = JSON.parse(iwas);
          // processIWA(iwa_arr);
          setIWAs(iwa_arr);

          console.log("No tasks in queue. Exiting loop.");
          if (part1 === true) {
            // const tasks = IWAs;
            setTimeout(() => {
              handleSavePart1IWAs();
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

  async function getSimilar() {
    try {
      //   let noOfTasksInQueue = Infinity; // Set initially to a large number
      //   while (noOfTasksInQueue > 0) {
      const requestData = {
        user_id: user,
        job_a: part3IWA,
        job_b: IWAs,
      };

      console.log(requestData);

      const response = await fetch("/api/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      const data = await response.json();
      let same_arr = [];
      let diff_arr = [];
      console.log("Response from compare API:", data);
      const common = data.common_iwa_count;
      const train = data.count_iwa_b - common;
      const common_p = ((common * 100) / data.count_iwa_b).toFixed(2);
      const train_p = ((train * 100) / data.count_iwa_b).toFixed(2);
      setSame(common_p);
      setDiff(train_p);

      data["Feature Importance"].forEach((obj) => {
        if (obj.Common_IWA === 1) {
          same_arr.push({
            title: obj["IWA Title"],
            importance: obj.Feature_importance,
          });
        } else {
          diff_arr.push({
            title: obj["IWA Title"],
            importance: obj.Feature_importance,
          });
        }
      });

      // Sort the arrays based on Feature_importance score in descending order
      same_arr.sort((a, b) => b.importance - a.importance);
      diff_arr.sort((a, b) => b.importance - a.importance);

      // Extract only the titles from the sorted arrays
      same_arr = same_arr.map((item) => item.title);
      diff_arr = diff_arr.map((item) => item.title);

      setSameList(same_arr);
      setDiffList(diff_arr);
      // console.log("checking:", data["Feature Importance"]);

      // Optional: Add a delay between API calls to avoid flooding the server
      // await new Promise((resolve) => setTimeout(resolve, 3000)); // 1 second delay
      //   }
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function generateAdjacentJobs() {
    const tasks = part3IWA;
    append({
      role: "user",
      content:
        "Given the following list of general tasks and considerations, tasks:" +
        tasks +
        "considerations," +
        considerations +
        "return only, a numbered list of the top possible jobs suitable for this person, without any descriptions, just the job titles e.g. Frontend Developer.",
    });
  }

  function generateEmergingJobs() {
    const tasks = part3IWA;
    append({
      role: "user",
      content:
        "Given the following list of general tasks and considerations, tasks:" +
        tasks +
        "considerations," +
        considerations +
        "return only, a numbered list of the top emerging jobs that is suitable for this person, without any descriptions, just the job titles e.g. Data Scientist.",
    });
  }

  function generateGigJobs() {
    const tasks = part3IWA;
    append({
      role: "user",
      content:
        "Given the following list of general tasks and considerations, tasks:" +
        tasks +
        "considerations," +
        considerations +
        "return only, a numbered list of the possible gig jobs or internships suitable for this person, without any descriptions, just the job titles e.g. UIUX Intern.",
    });
  }
  function restartPage() {
    location.reload();
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

  function getTasksFromGenJob() {
    const userJob = genjob;
    append({
      role: "user",
      content:
        "Create a list of tasks for the job," +
        userJob +
        "," +
        "  even if the job does not exist yet, into a set of sentences and return them such that each task is numbered. ",
    });
  }

  function handleCompareGenJob() {
    setLoading(true);
    getTasksFromGenJob();
  }

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
      {" "}
      <Link href="/">
        <div className=" bg-[#474545] h-[3.5rem] flex justify-center items-center">
          <Image src={new_logo} width={40} alt="Logo" className="m-2"></Image>

          <p className="ml-5 text-xl text-white tracking-[0.5rem]">S T A K</p>
        </div>
      </Link>
      <div
        className={`flex flex-row w-full  ${
          final ? "h-2/5" : "h-full"
        } text-[#555555] `}
      >
        <div
          className={`flex flex-col w-1/2 ${
            final ? "h-full" : "h-full "
          } tracking-[0.10rem]`}
        >
          <div className={`w-full h-2/5  ${final ? "h-full" : "h-2/5"}`}>
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
              </div>
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
              <div className="flex flex-row px-10 text-sm py-5 font-semibold">
                <p>1. </p>
                <p className=" ">
                  Please list down your current and previous jobs. You may also
                  paste your text CV.
                </p>
              </div>
            ) : null}
            {/* {part2 ? (
              <div className="flex flex-row px-10 text-sm py-5 font-semibold">
                <p>2. </p>
                <p className=" ">
                  The list of standardized task activities are generated based
                  on your input. You may add to the list of standardize task
                  activities below. Once you are satisfied, click 'Next' to
                  proceed to the next step.
                </p>
              </div>
            ) : null} */}
            {part3 ? (
              <div className="flex flex-row px-10 text-sm py-5 font-semibold">
                <p>2. </p>
                <p className=" ">
                  List down your hobbies and leisure activities that you wish to
                  translate to your potential career paths.
                </p>
              </div>
            ) : null}
            {part4 ? (
              <div className="flex flex-row px-10 text-sm py-5 font-semibold">
                <p>3. </p>
                <p className=" ">
                  Would you like the transitions to reflect any special
                  circumstances?
                </p>
              </div>
            ) : null}
            {final ? (
              <div className="flex flex-row px-10 text-sm py-5 font-semibold">
                <p className=" ">Here are your transitions.</p>
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
          {/* {part2 ? (
            <div className="px-10 text-black flex flex-col mt-5">
              <textarea
                type="text"
                onChange={handleTaskChange}
                value={moreTasks}
                placeholder="e.g. Create posters and infographics, organise and plan events..."
                className="p-2 my-2  w-full h-[10rem] bg-[#D9D9D9] text-[#555555] rounded-md tracking-[0.10rem]"
              ></textarea>
            </div>
          ) : null} */}
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
          {part4 ? (
            <div className="px-10 gap-2 text-xs text-white flex flex-row flex-wrap mt-5 mb-10">
              <button
                className={`px-2 py-1  w-fit tracking-[0.10rem] rounded-md ${
                  considerations.includes("Flexible Work Schedule")
                    ? "bg-[#474545]"
                    : "bg-[#9F9E9E]"
                }`}
                onClick={() => toggleConsideration("Flexible Work Schedule")}
              >
                Flexible Work Schedule
              </button>
              <button
                className={`px-2 py-1  w-fit tracking-[0.10rem] rounded-md ${
                  considerations.includes("Workplace Inclusivity")
                    ? "bg-[#474545]"
                    : "bg-[#9F9E9E]"
                }`}
                onClick={() => toggleConsideration("Workplace Inclusivity")}
              >
                Workplace Inclusivity
              </button>
              <button
                className={`px-2 py-1  w-fit tracking-[0.10rem] rounded-md ${
                  considerations.includes("Remote Work")
                    ? "bg-[#474545]"
                    : "bg-[#9F9E9E]"
                }`}
                onClick={() => toggleConsideration("Remote Work")}
              >
                Remote Work
              </button>
              <button
                className={`px-2 py-1  w-fit tracking-[0.10rem] rounded-md ${
                  considerations.includes("Accessibility Constraints")
                    ? "bg-[#474545]"
                    : "bg-[#9F9E9E]"
                }`}
                onClick={() => toggleConsideration("Accessibility Constraints")}
              >
                Accessibility Constraints
              </button>
              <button
                className={`px-2 py-1  w-fit tracking-[0.10rem] rounded-md ${
                  considerations.includes("Health Considerations")
                    ? "bg-[#474545]"
                    : "bg-[#9F9E9E]"
                }`}
                onClick={() => toggleConsideration("Health Considerations")}
              >
                Health Considerations
              </button>
              <button
                className={`px-2 py-1  w-fit tracking-[0.10rem] rounded-md ${
                  considerations.includes("Life Transition")
                    ? "bg-[#474545]"
                    : "bg-[#9F9E9E]"
                }`}
                onClick={() => toggleConsideration("Life Transition")}
              >
                Life Transition
              </button>
            </div>
          ) : null}

          {final ? null : (
            <div className="w-full">
              <button
                onClick={handleNext}
                className=" bg-[#474545] text-xs py-2 px-10 text-white w-fit tracking-[0.10rem] rounded-md ml-10"
              >
                Next
              </button>
            </div>
          )}
        </div>

        <div
          className="flex flex-col w-1/2 justify-center items-center
           tracking-[0.10rem] h-full"
        >
          {loading ? <CircularProgress color="inherit" /> : null}
        </div>
      </div>
      {final ? (
        <div className=" w-full h-fit text-black tracking-[0.1rem]">
          <div className="flex flex-row">
            <div className="flex flex-col w-1/3 pl-10">
              <p className="font-semibold mb-5">Adjacent Job Titles</p>{" "}
              {adjacentJobs.map((j) => (
                <div className="flex flex-row items-center" key={j.id}>
                  <p className=" pb-2 tracking-[0.10rem]">{j}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col w-1/3 px-5">
              <p className="font-semibold mb-5">Emerging Job Titles</p>
              {emergingJobs.map((j) => (
                <div className="flex flex-row items-center" key={j.id}>
                  <p className=" pb-2 tracking-[0.10rem]">{j}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col w-1/3 pr-10">
              <p className="font-semibold mb-5">
                Gigwork/Internship Job Titles
              </p>
              {gigJobs.map((j) => (
                <div className="flex flex-row items-center" key={j.id}>
                  <p className=" pb-2 tracking-[0.10rem]">{j}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
      {final ? (
        <div className="w-full flex flex-col items-center px-10">
          <div className="w-full flex flex-row my-[2rem] justify-center">
            <button className=" bg-[#474545] text-xs py-2 px-8 text-white w-fit tracking-[0.10rem] rounded-md ml-10">
              Save
            </button>
            <button
              onClick={restartPage}
              className=" bg-[#737171] text-xs py-2 px-8 text-white w-fit tracking-[0.10rem] rounded-md ml-10"
            >
              Restart
            </button>
          </div>
          <p className="text-[#555555] text-md mb-[2rem]  text-xl font-medium tracking-[0.10rem] ">
            Find out more about your Generated Job Titles using the Task Compare
            Tool <u>below</u>
          </p>
          <div className="flex flex-row mt-[1rem] w-full  tracking-[0.10rem] ">
            <div className="w-1/2 flex flex-col pr-5">
              <p className="text-md text-[#555555] font-semibold">
                Your Standardized Task Activites
              </p>
              <p className=" text-black mt-[1rem] mb-[5rem]">
                List of Standardized Task Activites translated based on your
                inputs.
              </p>

              <div className="mb-[3rem]">
                {part3IWA.map((j) => (
                  <div className="flex flex-row items-center " key={j.id}>
                    <p className=" pb-2 tracking-[0.10rem] text-black">{j}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-1/2 flex flex-col pl-5">
              <p className="text-md text-[#555555] font-semibold">Input Job</p>
              <p className=" text-black mt-[1rem] mb-[3rem] ">
                Please input a generated job title to compare the list of its
                standardized task activities versus your set of standardized
                task activities.
              </p>
              <input
                type="text"
                className=" tracking-[0.10rem] w-full p-2 bg-[#D9D9D9] text-[#555555] rounded-md "
                value={genjob}
                onChange={handleGenJobChange}
                placeholder="Job title here..."
              ></input>
              <div className="flex flex-row  my-[3rem]">
                <button
                  onClick={handleCompareGenJob}
                  className=" bg-[#474545] text-xs py-1 px-10 text-white w-fit tracking-[0.10rem] rounded-md mr-10"
                >
                  Compare
                </button>
                <button
                  onClick={restartCompare}
                  className=" bg-[#737171] text-xs py-2 px-10 text-white w-fit tracking-[0.10rem] rounded-md mr-10"
                >
                  Restart
                </button>
                <button
                  //   onClick={handleNext}
                  className=" text-xs py-2 px-10 text-white w-fit tracking-[0.10rem] rounded-md "
                >
                  Save
                </button>
              </div>
              {loading ? (
                <div className="flex w-full text-gray-400 fill-gray-300 items-center justify-center">
                  <CircularProgress color="inherit" />
                </div>
              ) : null}
              <div className="w-full flex font-semibold  text-black flex-row mt-[2rem] justify-between  mb-[1rem]">
                <p className=" ">Similar Tasks: {same} %</p>
                <div className="flex flex-row">
                  <p className="">Importance</p>
                  <KeyboardArrowDownIcon />
                </div>
              </div>
              {same_list.map((j) => (
                <div className="flex flex-row items-center " key={j.id}>
                  <p className=" pb-2 tracking-[0.10rem] text-black">{j}</p>
                </div>
              ))}
              <div className="w-full flex font-semibold  text-black flex-row mt-[2rem] justify-between  mb-[1rem]">
                <p className=" ">Tasks to Train: {diff} %</p>
                <div className="flex flex-row">
                  <p className="">Importance</p>
                  <KeyboardArrowDownIcon />
                </div>
              </div>
              <div className="mb-[3rem]">
                {diff_list.map((j) => (
                  <div className="flex flex-row items-center " key={j.id}>
                    <p className=" pb-2 tracking-[0.10rem] text-black bg-[#F5D3CC]">
                      {j}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {part1 ? <div></div> : null}
    </div>
  );
}
