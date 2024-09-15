"use client";

import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorModal from "../../../components/ErrorModal";
import { Alert, ConfigProvider, Tabs, Tag } from "antd";
import TextArea from "antd/es/input/TextArea";
import PlaygroundPromptOutput from "./Step3Playground";
import ActivePromptOutput from "./Step3Active";
import { transitionPrompts } from "@/constants/prompts";

export default function Step3View() {
  const [IWAs1, setIWAs1] = useState("");
  const [IWAs2, setIWAs2] = useState("");
  const [combinedIWAs, setCombinedIWAs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startActive, setStartActive] = useState(false);
  const [startPlayground, setStartPlayground] = useState(false);

  const [considerations, setConsiderations] = useState([]);

  const considerationsOptions = [
    "Flexible Work Schedule",
    "Workplace Inclusivity",
    "Remote Work",
    "Accessibility Constraints",
    "Health Considerations",
    "Life Transition",
  ];

  const [tokenMap, setTokenMap] = useState({});
  useEffect(() => {
    setTokenMap({
      considerations: considerations,
      tasks: combinedIWAs,
    });
  }, [considerations, combinedIWAs]);

  const toggleConsideration = (word) => {
    if (considerations.includes(word)) {
      // If the word is already in the array, remove it
      setConsiderations(considerations.filter((item) => item !== word));
    } else {
      // If the word is not in the array, add it
      setConsiderations([...considerations, word]);
    }
  };

  const handleCombineIWAs = () => {
    const part1IWAs = IWAs1.split("\n")
      .map((iwa) => iwa.trim())
      .filter((iwa) => iwa !== "");
    const part2IWAs = IWAs2.split("\n")
      .map((iwa) => iwa.trim())
      .filter((iwa) => iwa !== "");
    const combinedIWAsSet = new Set([...part1IWAs, ...part2IWAs]);
    const uniqueIWAs = Array.from(combinedIWAsSet);
    setCombinedIWAs(uniqueIWAs);
  };

  useEffect(() => {
    handleCombineIWAs();
  }, [IWAs1, IWAs2]);

  return (
    <div className="flex items-start gap-10 max-w-full box-border">
      <div className="w-[30%] flex-none">
        <div className="mb-4">
          <h3 className="font-bold text-md mb-3">
            Select any special circumstance(s) to be reflected in the
            transitions.
          </h3>
          <div className="gap-2 text-xs text-white flex flex-row flex-wrap mt-5 mb-3">
            {considerationsOptions.map((option) => (
              <Tag.CheckableTag
                key={option}
                checked={considerations.includes(option)}
                onChange={() => toggleConsideration(option)}
                style={{
                  backgroundColor: considerations.includes(option)
                    ? "#474545"
                    : "#9F9E9E",
                  color: "white",
                  padding: "4px 8px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                className="text-sm"
              >
                {option}
              </Tag.CheckableTag>
            ))}
          </div>
        </div>
        <div className="">
          <h3 className="font-bold text-md mb-3">
            Key in the IWAs generated from the Step 1: Input Job
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
              placeholder="Enter IWAs from Step 1 here"
              autoSize={{
                minRows: 10,
                maxRows: 10,
              }}
              onChange={(e) => setIWAs1(e.target.value)}
              style={{
                background: "#D9D9D9",
                outline: "none",
                border: "none",
                marginBottom: "18px",
                fontSize: "15px",
              }}
            />
          </ConfigProvider>
        </div>
        <div className="">
          <h3 className="font-bold text-md mb-3">
            Key in the IWAs generated from the Step 2: Input Hobbies
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
              placeholder="Enter IWAs from Step 2 here"
              autoSize={{
                minRows: 10,
                maxRows: 10,
              }}
              onChange={(e) => setIWAs2(e.target.value)}
              style={{
                background: "#D9D9D9",
                outline: "none",
                border: "none",
                marginBottom: "18px",
                fontSize: "15px",
              }}
            />
          </ConfigProvider>
        </div>

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
            setLoading,
            setStartActive,
            loading,
            considerations,
          }}
          tasks={combinedIWAs}
        />
        <PlaygroundPromptOutput
          {...{
            startPlayground,
            setLoading,
            setStartPlayground,
            loading,
            considerations,
            tokenMap
          }}
          tasks={combinedIWAs}
        />
      </div>

      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
    </div>
  );
}
