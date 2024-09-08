import { comparePrompts } from "@/constants/prompts";
import { useChat } from "ai/react";
import { ConfigProvider, Spin } from "antd";
import { useEffect, useRef, useState } from "react";
import { FaLock } from "react-icons/fa";

function ActivePromptOutput({
  startActive,
  inputAType,
  inputBType,
  setLoadingActive,
  textA,
  jobA,
  hobbiesA,
  textB,
  jobB,
  hobbiesB,
  setStartActive,
  loadingActive,
}) {
  const [openAIOutputADone, setOpenAIOutputADone] = useState(false);
  const [isOpenAIResultLoadingA, setIsOpenAIResultLoadingA] = useState(false);
  const [isOpenAIResultLoadingB, setIsOpenAIResultLoadingB] = useState(false);

  const [isIWAResultLoadingA, setIsIWAResultLoadingA] = useState(false);
  const [isIWAResultLoadingB, setIsIWAResultLoadingB] = useState(false);

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

          if (openAIOutputADone === false) {
            outputARef.current.textContent = sentences.join("\r\n");
            setIsOpenAIResultLoadingA(false);
            setOpenAIOutputADone(true);
          } else {
            outputBRef.current.textContent = sentences.join("\r\n");
            setIsOpenAIResultLoadingB(false);
          }
        } catch (error) {
          setError("An error occurred while processing the response.");
          setLoadingActive(false);
          setIsOpenAIResultLoadingA(false);
          setIsOpenAIResultLoadingB(false);
        }
      },
      onError: (error) => {
        console.log("error", error);
        const { error: errorMessage } = JSON.parse(error.message);
        setError(`Error: ${errorMessage}`);
        setLoadingActive(false);
        setIsOpenAIResultLoadingA(false);
        setIsOpenAIResultLoadingB(false);
      },
    });

  const [input1iwa, setInput1IWA] = useState(false);
  const [input2iwa, setInput2IWA] = useState(false);
  const [response, setResponse] = useState([]);
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
  const [callTo1Done, setCallTo1Done] = useState(false);
  const [error, setError] = useState(null);

  function compareInputs() {
    setLoadingActive(true);
    //first input
    queryInput(1);
  }

  function queryInput(inputNum) {
    console.log(`querying ${inputNum == 1 ? "first" : "second"} input`);

    if (inputNum == 1) {
      setiwa1ID(generateID());
      processInput(inputAType, textA, jobA, hobbiesA);
    } else {
      setiwa2ID(generateID());
      setInput1IWA(false);
      setInput2IWA(true);
      processInput(inputBType, textB, jobB, hobbiesB);
    }
  }

  function processInput(inputType, text, job, hobbies) {
    handleGenerate(inputType, text, job, hobbies);
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
          setIsIWAResultLoadingA(false);
        }
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error("Error in getIWAsForFirstInput:", error);
      setIsIWAResultLoadingA(false);
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
          setIsIWAResultLoadingB(false);
          setStartActive(false);
          setTimeout(() => setCompleted2(true), 3000);
        }
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error("Error in getIWAsForSecondInput:", error);
      setIsIWAResultLoadingB(false);
      setStartActive(false);
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
      setLoadingActive(false);
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

  const outputARef = useRef(null);
  const outputBRef = useRef(null);

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

  function handleGenerate(inputType, text, job, hobbies) {
    setLoadingActive(true);

    let userMessage;
    if (inputType === "text") {
      userMessage = comparePrompts.textPrompt(text);
    } else if (inputType === "job") {
      userMessage = comparePrompts.jobPrompt(job);
    } else if (inputType === "hobby") {
      userMessage = comparePrompts.hobbyPrompt(hobbies);
    }
    append({
      role: "user",
      content: userMessage,
    });
  }

  useEffect(() => {
    if (startActive) {
      setIsOpenAIResultLoadingA(true);
      setIsOpenAIResultLoadingB(true);
      setIsIWAResultLoadingA(true);
      setIsIWAResultLoadingB(true);

      outputARef.current.textContent = "";
      outputBRef.current.textContent = "";

      compareInputs();
    }
  }, [startActive]);

  function choosePrompt(type) {
    if (type === "text") {
      return comparePrompts.textPrompt("${text}");
    } else if (type === "job") {
      return comparePrompts.jobPrompt("${text}");
    } else {
      return comparePrompts.hobbyPrompt("${text}");
    }
  }

  return (
    <div className="mb-4">
      <h3 className="font-bold text-lg mb-3">Active Prompt-In-Use</h3>
      <h4 className="font-bold text-base mb-3">Prompt A</h4>
      <div className="rounded-md bg-lockgray py-2 px-4 mb-4 flex items-start w-full">
        <FaLock className="mr-2 text-lg" />
        <p className="text-sm">{choosePrompt(inputAType)}</p>
      </div>
      <h4 className="font-bold text-base mb-3">Prompt B</h4>

      <div className="rounded-md bg-lockgray py-2 px-4 mb-4 flex items-start w-full">
        <FaLock className="mr-2 text-lg" />
        <p className="text-sm">{choosePrompt(inputBType)}</p>
      </div>
      <div className="max-w-full w-full flex items-start gap-2 h-[30vh] text-xs text-white">
        <div className="bg-black flex-1 p-4 h-full">
          <p className="font-semibold text-white text-xs mb-2">
            OpenAI Output A
          </p>
          {isOpenAIResultLoadingA ? (
            <ConfigProvider theme={{ token: { colorPrimary: "#fff" } }}>
              <Spin />
            </ConfigProvider>
          ) : (
            ""
          )}
          <p
            ref={outputARef}
            className="h-4/5 py-2 overflow-y-auto whitespace-pre-wrap "
          ></p>
        </div>
        <div className="bg-black flex-1 p-4 h-full">
          <p className="font-semibold text-white text-xs mb-2">IWA Output A</p>
          <div className="h-4/5 py-2 overflow-y-auto whitespace-pre-wrap">
            {isIWAResultLoadingA ? (
              <ConfigProvider theme={{ token: { colorPrimary: "#fff" } }}>
                <Spin />
              </ConfigProvider>
            ) : (
              <div className="h-4/5 py-2 overflow-y-auto whitespace-pre-wrap">
                {
                  IWAs1.map((iwa, index) => (
                    <div key={index}>
                      {iwa}
                      <br />
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="max-w-full w-full flex items-start gap-2 h-[30vh] text-xs text-white mt-4">
        <div className="bg-black flex-1 p-4 h-full">
          <p className="font-semibold text-white text-xs mb-2">
            OpenAI Output B
          </p>
          {isOpenAIResultLoadingB ? (
            <ConfigProvider theme={{ token: { colorPrimary: "#fff" } }}>
              <Spin />
            </ConfigProvider>
          ) : (
            ""
          )}
          <p
            ref={outputBRef}
            className="h-4/5 py-2 overflow-y-auto whitespace-pre-wrap "
          ></p>
        </div>
        <div className="bg-black flex-1 p-4 h-full">
          <p className="font-semibold text-white text-xs mb-2">IWA Output B</p>
          <div className="h-4/5 py-2 overflow-y-auto whitespace-pre-wrap">
            {isIWAResultLoadingB ? (
              <ConfigProvider theme={{ token: { colorPrimary: "#fff" } }}>
                <Spin />
              </ConfigProvider>
            ) : (
              <div className="h-4/5 py-2 overflow-y-auto whitespace-pre-wrap">
                {
                  IWAs2.map((iwa, index) => (
                    <div key={index}>
                      {iwa}
                      <br />
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivePromptOutput;
