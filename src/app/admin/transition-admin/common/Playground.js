"use client";
import { useEffect, useRef, useState } from "react";
import { useChat } from "ai/react";
import { ConfigProvider, Input, Spin } from "antd";
const { TextArea } = Input;

function PlaygroundPromptOutput({
  startPlayground,
  inputType,
  setLoading,
  tokenMap, // Generic token map for dynamic replacements
  setStartPlayground,
  loading,
  instructions,
}) {
  const [IWAs, setIWAs] = useState([]);
  const [user, setUser] = useState(generateID());
  const [isOpenAIResultLoading, setIsOpenAIResultLoading] = useState(false);
  const [isIWAResultLoading, setIsIWAResultLoading] = useState(false);
  const [playgroundPrompt, setPlaygroundPrompt] = useState("");

  const { messages, append, input, handleInputChange, handleSubmit, setInput } =
    useChat({
      onResponse: async (response) => {
        try {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const responseText = await response.clone().text();
          const sentences = responseText
            .split(/\d+\.\s/)
            .map((sentence) => sentence.replace(/\n/g, ""))
            .filter((sentence) => sentence.trim() !== "");

          if (outputRef.current) {
            outputRef.current.textContent = sentences.join("\r\n");
          }
          setIsOpenAIResultLoading(false);
          setStartPlayground(false);
          invokeTask(sentences);
          setTimeout(() => {
            getIWAs(sentences);
          }, 3000);
        } catch (error) {
          console.error("An error occurred while processing the response.");
          setLoading(false);
          setIsOpenAIResultLoading(false);
        }
      },
      onError: (error) => {
        try {
          const { error: errorMessage } = JSON.parse(error.message);
          console.error(`Error: ${errorMessage}`);
        } catch (parseError) {
          console.error(`Error: ${error.message}`);
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

  // Helper function to replace tokens in the prompt
  function replaceTokens(prompt, tokens) {
    let result = prompt;
    Object.keys(tokens).forEach((key) => {
      const tokenPattern = new RegExp(`\\$\\{${key}\\}`, "g");
      result = result.replace(tokenPattern, tokens[key] || "");
    });
    return result;
  }

  function handleGenerate() {
    setLoading(true);
    setIsIWAResultLoading(true);
    setIsOpenAIResultLoading(true);

    // Replace tokens in the prompt using the tokenMap
    const userMessage = replaceTokens(playgroundPrompt, tokenMap);

    append({
      role: "user",
      content: userMessage,
    });
  }

  async function invokeTask(tasklist) {
    try {
      const requestData = {
        user_id: user,
        task: tasklist,
      };
      const response1 = await fetch("/api/invokeTask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      const data1 = await response1.json();
      console.log("Response from first API:", data1);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function getIWAs(tasklist) {
    try {
      let noOfTasksInQueue = Infinity;
      while (noOfTasksInQueue > 0) {
        const requestData = {
          user_id: user,
          task: tasklist,
        };
        const response = await fetch("/api/tasktoIWA", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });
        const data = await response.json();
        noOfTasksInQueue = data.no_of_tasks_in_queue;

        if (noOfTasksInQueue > 0) {
          const iwas = data.body;
          const iwa_arr = JSON.parse(iwas);
          setIWAs(iwa_arr);
        } else {
          const iwas = data.body;
          const iwa_arr = JSON.parse(iwas);
          setIWAs(iwa_arr);
          setLoading(false);
          setIsIWAResultLoading(false);
        }
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    if (startPlayground) {
      handleGenerate();
      outputRef.current.textContent = "";
    }
  }, [startPlayground]);

  return (
    <div className="mb-4">
      <h3 className="font-bold text-lg mb-3">Prompt Playground</h3>
      {instructions ? instructions : <></>}
      <div className="rounded-md bg-graylt py-2 px-4 mb-4 flex items-center w-full">
        <TextArea
          placeholder="Insert Prompt Here"
          autoSize
          onChange={(e) => setPlaygroundPrompt(e.target.value)}
          style={{
            background: "none",
            outline: "none",
            border: "none",
          }}
        />
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
  );
}

export default PlaygroundPromptOutput;
