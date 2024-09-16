import { transitionPrompts } from "@/constants/prompts";
import { useChat } from "ai/react";
import { ConfigProvider, Spin, Input } from "antd";
import { forwardRef, useImperativeHandle, useState } from "react";
import { FaLock } from "react-icons/fa";
const { TextArea } = Input;

const AIOutput = forwardRef(({
  title,
  type,
  prompt,
  promptPreview,
  tasks,
  considerations,
  onFinishLoading,
  tokenMap 
}, ref) => {
  const [isResultLoading, setIsResultLoading] = useState(false);
  const [response, setResponse] = useState([]);
  const [playgroundPrompt, setPlaygroundPrompt] = useState("");
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
          setIsResultLoading(false);
          onFinishLoading();
        } catch (error) {
          console.error("An error occurred while processing the response.");
          setIsResultLoading(false);
          onFinishLoading();
        }
      },
      onError: (error) => {
        const { error: errorMessage } = JSON.parse(error.message);
        console.error(`Error: ${errorMessage}`);
        setIsResultLoading(false);
        onFinishLoading();
      },
    });

  useImperativeHandle(ref, () => ({
    handleGenerate,
  }));

  const handleGenerate = () => {
    setIsResultLoading(true);
    let userMessage;
    if (type === "active") {
      userMessage = prompt;
    } else if (type === "playground") {
        userMessage = replaceTokens(playgroundPrompt, tokenMap); 
    }
    append({
      role: "user",
      content: userMessage,
    });
  };

  const replaceTokens = (prompt, tokens) => {
    let result = prompt;
    Object.keys(tokens).forEach((key) => {
      const tokenPattern = new RegExp(`\\$\\{${key}\\}`, "g");
      result = result.replace(tokenPattern, tokens[key] || "");
    });
    return result;
  };

  return (
    <div className="w-full">
      <h2 className="mb-2 font-semibold text-s">{title}</h2>
      {type === "playground" ? (
        <TextArea
          placeholder="Insert Prompt Here"
          autoSize={{
            minRows: 7,
            maxRows: 7,
          }}
          value={playgroundPrompt}
          onChange={(e) => setPlaygroundPrompt(e.target.value)}
          style={{
            background: "none",
            outline: "none",
            border: "none",
            background: "#D9D9D9",
            overflowY: "auto",
            marginBottom: "18px"
          }}
        />
      ) : (
        <div className="rounded-md bg-lockgray py-2 px-4 mb-4 flex items-start h-36 overflow-y-auto">
          <FaLock className="mr-2 text-sm flex-shrink-0" />
          <div className="text-sm flex-1 overflow-y-auto">{promptPreview}</div>
        </div>
      )}
      <div className="bg-black flex-1 p-4 h-[45vh]">
        <p className="font-semibold text-white text-xs mb-2">OpenAI Output</p>
        {isResultLoading ? (
          <ConfigProvider theme={{ token: { colorPrimary: "#fff" } }}>
            <Spin />
          </ConfigProvider>
        ) : (
          ""
        )}
        <p className="h-4/5 py-2 overflow-y-auto whitespace-pre-wrap text-white">
          {response.join("\n")}
        </p>
      </div>
    </div>
  );
});

export default AIOutput;
