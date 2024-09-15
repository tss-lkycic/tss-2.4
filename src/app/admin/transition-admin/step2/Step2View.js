"use client";

import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorModal from "../../../components/ErrorModal";
import { Alert, ConfigProvider, Tabs } from "antd";
import TextArea from "antd/es/input/TextArea";
import PlaygroundPromptOutput from "../common/Playground";
import ActivePromptOutput from "../common/Active";
import { transitionPrompts } from "@/constants/prompts";

export default function Step2View() {
  const [inputType, setInputType] = useState("text");
  const [hobbies, setHobbies] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startActive, setStartActive] = useState(false);
  const [startPlayground, setStartPlayground] = useState(false);

  const [activePrompt, setActivePrompt] = useState(transitionPrompts.stepTwoPrompt(hobbies))
  useEffect(() => {
    setActivePrompt(transitionPrompts.stepTwoPrompt(hobbies));
  }, [hobbies]); 

  const [tokenMap, setTokenMap] = useState({});
  useEffect(() => {
    setTokenMap({
      hobbies: hobbies  
    });
  }, [hobbies]); 
  return (
    <div className="flex items-start gap-10 max-w-full box-border">
      <div className="w-[30%] flex-none">
        <h3 className="font-bold text-md mb-3">
          List down your hobbies and leisure activities that you wish to
          translate to your potential career paths.
        </h3>
        <ConfigProvider
          theme={{
            components: {
              Input: {
                paddingBlock: 8,
              },
            },
          }}
        >
          <TextArea
            placeholder="E.g. Dancing, Cooking, Arts & Crafts..."
            autoSize={{
              minRows: 10,
              maxRows: 10,
            }}
            onChange={(e) => setHobbies(e.target.value)}
            style={{
              background: "#D9D9D9",
              outline: "none",
              border: "none",
              marginBottom: "18px",
              fontSize: "15px",
            }}
          />
        </ConfigProvider>

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
              onClick={() => {
                setStartActive(true);
                setStartPlayground(true);
              }}
              className="tracking-[0.10rem] w-36 h-10 bg-[#474545] rounded-lg my-5 text-white"
            >
              Generate
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <ActivePromptOutput
          {...{
            startActive,
            inputType,
            setLoading,
            setStartActive,
            loading,
          }}
          activePrompt={activePrompt}
          activePromptPreview={transitionPrompts.stepTwoPrompt("${hobbies}")}
        />
        <PlaygroundPromptOutput
        {...{
          startPlayground,
          inputType,
          setLoading,
          setStartPlayground,
          loading,
        }}
        tokenMap={tokenMap}
        instructions={
          <Alert
            className="mb-4 text-xs"
            message="Add ${hobbies} at the appropriate place where you want the user hobbies inputs respectively to be inserted."
            type="info"
            showIcon
          />
        }
      />
      </div>
      
      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
    </div>
  );
}
