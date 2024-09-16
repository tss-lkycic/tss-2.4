import { translatePrompts } from "@/constants/prompts";
import { useChat } from "ai/react";
import { ConfigProvider, Spin } from "antd";
import { useEffect, useState, useRef } from "react";
import { FaLock } from "react-icons/fa";

function ActivePromptOutput({
  startActive,
  inputType,
  setLoading,
  text,
  job,
  hobbies,
  setStartActive,
  loading,
}) {
  const [activeOpenAIOutput, setActiveOpenAIOutput] = useState();
  const [IWAs, setIWAs] = useState([]);
  const [user, setUser] = useState(generateID());
  const [isOpenAIResultLoading, setIsOpenAIResultLoading] = useState(false);
  const [isIWAResultLoading, setIsIWAResultLoading] = useState(false);

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
          //setActiveOpenAIOutput(sentences)
          // This is a non-recommended way of using ref instead of state due to some strange rendering logic interfering with the calls to openAI
          if (outputRef.current) {
            outputRef.current.textContent = sentences.join("\r\n");
          }
          setStartActive(false);
          setIsOpenAIResultLoading(false);

          invokeTask(sentences);
          setTimeout(() => {
            getIWAs(sentences);
          }, 3000);
        } catch (error) {
          setError("An error occurred while processing the response.");
          setLoading(false);
          setIsOpenAIResultLoading(false);
        }
      },
      onError: (error) => {
        try {
          const { error: errorMessage } = JSON.parse(error.message);
          setError(`Error: ${errorMessage}`);
        } catch (parseError) {
          setError(`Error: ${error.message}`);
        }
        setLoading(false);
        setIsOpenAIResultLoading(false);
      },
    });

  const outputRef = useRef(null);

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
  function handleGenerate() {
    setIsIWAResultLoading(true);
    setIsOpenAIResultLoading(true);
    setLoading(true);
    let userMessage;
    if (inputType === "text") {
      userMessage = translatePrompts.textPrompt(text);
    } else if (inputType === "job") {
      userMessage = translatePrompts.jobPrompt(job);
    } else if (inputType === "hobby") {
      userMessage = translatePrompts.hobbyPrompt(hobbies);
    }
    append({
      role: "user",
      content: userMessage,
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
          setIWAs(iwa_arr);
        } else {
          console.log("No tasks in queue. Exiting loop.");
          console.log("process remainder");
          const iwas = data.body;
          const iwa_arr = JSON.parse(iwas);
          setIWAs(iwa_arr);
          setLoading(false);
          setIsIWAResultLoading(false);
        }

        // Optional: Add a delay between API calls to avoid flooding the server
        await new Promise((resolve) => setTimeout(resolve, 3000)); // 1 second delay
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    if (startActive) {
      handleGenerate();
      outputRef.current.textContent = "";
    }
  }, [startActive]);

  function choosePrompt(type) {
    if (type === "text") {
      return translatePrompts.textPrompt("${text}");
    } else if (type === "job") {
      return translatePrompts.jobPrompt("${text}");
    } else {
      return translatePrompts.hobbyPrompt("${text}");
    }
  }

  return (
    <div className="mb-4">
      <h3 className="font-bold text-lg mb-3">Active Prompt-In-Use</h3>
      <div className="rounded-md bg-lockgray py-2 px-4 mb-4 flex items-start w-full">
        <FaLock className="mr-2 text-lg" />
        <p className=" text-sm">{choosePrompt(inputType)}</p>
      </div>
      <div className="max-w-full w-full flex items-start gap-2 h-[30vh] text-xs text-white">
        <div className="bg-black flex-1 p-4 h-full">
          <p className="font-semibold text-white text-xs mb-2">OpenAI Output</p>
          {isOpenAIResultLoading ? (
            <ConfigProvider theme={{ token: { colorPrimary: "#fff" } }}>
              <Spin />
            </ConfigProvider>
          ) : (
            ""
          )}
          <p
            ref={outputRef}
            className="h-4/5 py-2 overflow-y-auto whitespace-pre-wrap "
          ></p>
        </div>
        <div className="bg-black flex-1 p-4 h-full">
          <p className="font-semibold text-white text-xs mb-2">IWA Output</p>
          <div className="h-4/5 py-2 overflow-y-auto whitespace-pre-wrap">
            {isIWAResultLoading ? (
              <ConfigProvider theme={{ token: { colorPrimary: "#fff" } }}>
                <Spin />
              </ConfigProvider>
            ) : (
              <div className="h-4/5 py-2 overflow-y-auto whitespace-pre-wrap">
                {!loading ? (
                  IWAs.map((iwa, index) => (
                    <div key={index}>
                      {iwa}
                      <br />
                    </div>
                  ))
                ) : (
                  <></>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivePromptOutput;
