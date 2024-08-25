"use client";

import { useChat } from "ai/react";
import transition from "/public/transition.svg";
import Image from "next/image";
// import { writeFile } from "fs/promises";
// import { createReadStream } from "fs";
import { useEffect, useState, useRef } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CircularProgress from "@mui/material/CircularProgress";
import html2canvas from "html2canvas";
import ErrorModal from "../components/ErrorModal";
import StepTracker from "../components/StepTracker";

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

          console.log("Processed response:", sentences);
          setResponse(sentences);
        } catch (error) {
          setError("An error occurred while processing the response.");
          setLoading(false);
        }
      },
      onError: (error) => {
        const { error: errorMessage } = JSON.parse(error.message);
        setError(`Error: ${errorMessage}`);
        setLoading(false);
      },
    });

  const [job, setJob] = useState("");
  const [genjob, setGenJob] = useState("");
  const [genjobIWA, setGenJobIWA] = useState([]);
  const [hobbies, setHobbies] = useState("");
  const [text, setText] = useState("");

  const [response, setResponse] = useState([]);
  const [IWAs, setIWAs] = useState([]);
  const responseRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [compareLoading, setCompareLoading] = useState(false);
  const [user, setUser] = useState(generateID());
  const [stage, setStage] = useState(1);
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
  const [sameList, setSameList] = useState([]);
  const [diff, setDiff] = useState("-");
  const [diffList, setDiffList] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("iwas", IWAs);
    if (stage == 1) {
      setTimeout(() => {
        setPart1IWA(IWAs);
        console.log(part1IWA, "hello iwas from part 1");
      }, 200);
    }
    if (stage == 2) {
      setTimeout(() => {
        const newiwa = IWAs;
        setNewIWAs(newiwa);
        console.log(newiwa, "hello new iwas from part 2");
      }, 200);
    }
    if (stage == 4 && IWAs.length > 0) {
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

      setStage(3);
      setLoading(false);
      setTimeout(() => {
        setIWAs([]);
      }, 3000);
    }
  }, [newIWAs]);

  const dummy = ["job1", "job2", "job3"];

  useEffect(() => {
    if (adjacentJobs.length > 0 && stage === 3) {
      console.log("hello 1");
      generateEmergingJobs();
    }
  }, [getAdjacent]);
  useEffect(() => {
    if (getEmerging === false && stage === 3) {
      console.log("hello 2");
      generateGigJobs();
    }
  }, [getEmerging]);

  useEffect(() => {
    if (getGig === false && stage === 3) {
      console.log("hello 3");
      setStage(4);
      setLoading(false);
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
        } else if (stage !== 3) {
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
    if (stage == 1) {
      handleNext1();
    } else if (stage == 2) {
      handleNext3();
    } else if (stage == 3) {
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
  }

  function handleSavePart1IWAs() {
    setStage(2);
    setLoading(false);
    setTimeout(() => {
      setIWAs([]);
    }, 3000);
  }

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

        console.log(noOfTasksInQueue, "how many more tasks");
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
          if (stage === 1) {
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
      console.log(sameList, "same lust");
      console.log(diffList, "diff lust");

      // Optional: Add a delay between API calls to avoid flooding the server
      // await new Promise((resolve) => setTimeout(resolve, 3000)); // 1 second delay
      //   }
      setCompareLoading(false);
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
    setCompareLoading(true);
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
      className="w-screen min-h-screen flex flex-col overflow-x-hidden"
      id="results"
    >
      <div
        className={`flex flex-col md:flex-row w-full ${
          stage == 4 ? "h-2/5" : "h-full"
        } text-[#555555] `}
      >
        <div
          className={`flex flex-col md:w-1/2  tracking-[0.10rem] md:px-10 px-6`}
        >
          <div className={`w-full  ${stage == 4 ? "md:h-full" : null}`}>
            <div className="pt-5 md:w-2/3">
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
            {stage !== 4 ? (
              <div className="py-5">
                <StepTracker stage={stage} />
              </div>
            ) : null}

            {stage == 1 ? (
              <p className="font-semibold text-sm">
                Please list down your current and previous jobs. You may also
                paste your text CV.
              </p>
            ) : null}
            {stage == 2 ? (
              <p className="font-semibold text-sm">
                List down your hobbies and leisure activities that you wish to
                translate to your potential career paths.
              </p>
            ) : null}
            {stage == 3 ? (
              <p className="font-semibold text-sm">
                Would you like the transitions to reflect any special
                circumstances?
              </p>
            ) : null}
            {stage == 4 ? (
              <p className="font-semibold text-sm py-5">
                Here are your transitions.
              </p>
            ) : null}
          </div>
          {stage == 1 ? (
            <div className="text-black flex flex-col mt-2">
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
          {stage == 2 ? (
            <div className="text-black flex flex-col mt-3">
              <textarea
                type="text"
                onChange={handleHobbiesChange}
                value={hobbies}
                placeholder="e.g. dancing, cooking and meal prep, arts and crafts..."
                className="p-2 my-2  w-full h-[10rem] bg-[#D9D9D9] text-[#555555] rounded-md tracking-[0.10rem]"
              ></textarea>
            </div>
          ) : null}
          {stage == 3 ? (
            <div className="gap-2 text-xs text-white flex flex-row flex-wrap mt-5 mb-3">
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

          {stage == 4 ? null : (
            <div className="flex justify-center md:justify-start">
              {loading == true ? (
                <button
                  disabled
                  className="bg-[#474545] w-36 h-10 bg-opacity-50 rounded-lg my-5 text-white px-8"
                >
                  <CircularProgress color="inherit" size="1.5rem" />
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="tracking-[0.10rem] w-36 h-10 bg-[#474545] rounded-lg my-5 text-white"
                >
                  Next
                </button>
              )}
            </div>
          )}
        </div>

        <div
          className={`flex flex-col w-1/2 justify-center items-center
           tracking-[0.10rem] h-full ${stage == 4 ? null : "md:h-screen"} `}
        >
          {/* {loading ? <CircularProgress color="inherit" /> : null} */}
        </div>
      </div>
      {stage == 4 ? (
        <div className=" w-full h-fit text-black tracking-[0.1rem]">
          <div className="flex flex-col md:flex-row md:px-10 px-6">
            <div className="flex flex-col md:w-1/3 md:px-0 md:pr-2">
              <p className="font-semibold mb-5">Adjacent Job Titles</p>
              {adjacentJobs.map((job, index) => (
                <div
                  key={index}
                  className={` ${
                    index % 2 === 0
                      ? "bg-[#D9D9D9] bg-opacity-40"
                      : "bg-[#D9D9D9]"
                  } my-1 py-1.5 rounded-md`}
                >
                  <p className="mx-2 tracking-[0.10rem]">{job}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col md:w-1/3 md:px-2 md:mt-0 mt-10">
              <p className="font-semibold mb-5">Emerging Job Titles</p>
              {emergingJobs.map((job, index) => (
                <div
                  key={index}
                  className={` ${
                    index % 2 === 0
                      ? "bg-[#D9D9D9] bg-opacity-40"
                      : "bg-[#D9D9D9]"
                  } my-1 py-1.5 rounded-md`}
                >
                  <p className="mx-2 tracking-[0.10rem]">{job}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col md:w-1/3 md:px-0 md:pl-2 md:mt-0 mt-10">
              <p className="font-semibold mb-5">
                Gigwork/Internship Job Titles
              </p>
              {gigJobs.map((job, index) => (
                <div
                  key={index}
                  className={` ${
                    index % 2 === 0
                      ? "bg-[#D9D9D9] bg-opacity-40"
                      : "bg-[#D9D9D9]"
                  } my-1 py-1.5 rounded-md`}
                >
                  <p className="mx-2 tracking-[0.10rem]">{job}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
      {stage == 4 ? (
        <div className="w-full flex flex-col items-center md:px-10 px-6">
          <div className="w-full flex flex-row my-[2rem] justify-center space-x-4">
            <button className=" bg-[#474545] text-xs py-2 px-8 text-white w-fit tracking-[0.10rem] rounded-md">
              Save
            </button>
            <button
              onClick={restartPage}
              className=" bg-[#737171] text-xs py-2 px-8 text-white w-fit tracking-[0.10rem] rounded-md"
            >
              Restart
            </button>
          </div>
          <p className="text-[#555555] text-md mb-2 mt-3 text-xl font-medium tracking-[0.10rem] ">
            Find out more about your Generated Job Titles using the Task Compare
            Tool <u>below</u>
          </p>
          <div className="flex flex-col md:flex-row mt-[1rem] w-full  tracking-[0.10rem] ">
            <div className="md:w-1/2 flex flex-col md:pr-5">
              <p className="text-md text-[#555555] font-semibold">
                Your Standardized Task Activites
              </p>
              <p className=" text-black my-2">
                List of Standardized Task Activites translated based on your
                inputs.
              </p>

              <div className="mb-[3rem]">
                {part3IWA.map((iwa, index) => (
                  <div
                    key={index}
                    className={` ${
                      index % 2 === 0
                        ? "bg-[#D9D9D9] bg-opacity-40"
                        : "bg-[#D9D9D9]"
                    } my-1 py-1.5 rounded-md`}
                  >
                    <p className="mx-2 tracking-[0.10rem]">{iwa}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="md:w-1/2 flex flex-col md:pl-5">
              <p className="text-md text-[#555555] font-semibold">Input Job</p>
              <p className=" text-black my-2">
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
              <div className="flex flex-row justify-center my-4 space-x-2">
                {compareLoading == true ? (
                  <button
                    disabled
                    className="bg-[#474545] w-36 h-10 bg-opacity-50 rounded-lg my-5 text-white px-8"
                  >
                    <CircularProgress color="inherit" size="1.5rem" />
                  </button>
                ) : (
                  <button
                    onClick={handleCompareGenJob}
                    className="tracking-[0.10rem] w-36 h-10 bg-[#474545] rounded-lg my-5 text-white"
                  >
                    Compare
                  </button>
                )}
                <button
                  onClick={restartCompare}
                  className="tracking-[0.10rem] w-36 h-10 bg-[#474545] rounded-lg my-5 text-white"
                >
                  Restart
                </button>
              </div>
              <div className="w-full flex font-semibold  text-black flex-row mt-[2rem] justify-between  mb-[1rem]">
                <p className=" ">
                  Similar Tasks: <br className="md:hidden" />
                  {same} %
                </p>
                <div className="flex flex-row">
                  <p className="">Importance</p>
                  <KeyboardArrowDownIcon />
                </div>
              </div>
              {sameList.map((j) => (
                <div
                  className="my-1 w-full tracking-[0.10rem] text-black bg-[#ccf5ce] py-1.5 px-2 rounded-md"
                  key={j.id}
                >
                  {j}
                </div>
              ))}
              <div className="w-full flex font-semibold  text-black flex-row mt-[2rem] justify-between  mb-[1rem]">
                <p className=" ">
                  Tasks to Train: <br className="md:hidden" />
                  {diff} %
                </p>
                <div className="flex flex-row">
                  <p className="">Importance</p>
                  <KeyboardArrowDownIcon />
                </div>
              </div>
              <div className="mb-[3rem] w-full">
                {diffList.map((j) => (
                  <div
                    className="my-1 w-full tracking-[0.10rem] text-black bg-[#F5D3CC] py-1.5 px-2 rounded-md"
                    key={j.id}
                  >
                    {j}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {stage == 1 ? <div></div> : null}
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
    </div>
  );
}
