"use client";

import { useEffect, useRef, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import html2canvas from "html2canvas";
import ErrorModal from "../../../components/ErrorModal";
import { ConfigProvider, Tabs } from "antd";
import TextArea from "antd/es/input/TextArea";
import ActivePromptOutput from "./Step1Active";
import PlaygroundPromptOutput from "./Step1Playground";

export default function Step1View() {
  const [inputType, setInputType] = useState("text");
  const [job, setJob] = useState("");
  const [resume, setResume] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startActive, setStartActive] = useState(false);
  const [startPlayground, setStartPlayground] = useState(false);

  return (
    <div className="flex items-start gap-10 max-w-full box-border">
      <div className="w-[30%] flex-none">
        <h3 className="font-bold text-md mb-3">
          Please list down your current and previous jobs. You may also paste
          your text CV.
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
            placeholder="E.g. Frontend Developer, Project Manager..."
            autoSize
            onChange={(e) => setJob(e.target.value)}
            style={{
              background: "#D9D9D9",
              outline: "none",
              border: "none",
              marginBottom: "18px",
              fontSize: "15px",
            }}
          />
          <TextArea
            placeholder="Paste your resume/CV here"
            autoSize={{
              minRows: 14,
              maxRows: 14,
            }}
            onChange={(e) => setJob(e.target.value)}
            style={{
              background: "#D9D9D9",
              outline: "none",
              border: "none",
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
            resume,
            job,
            setStartActive,
            loading,
          }}
        />
        <PlaygroundPromptOutput
          {...{
            startPlayground,
            inputType,
            setLoading,
            resume,
            job,
            setStartPlayground,
            loading,
          }}
        />
      </div>

      {error && <ErrorModal message={error} onClose={() => setError(null)} />}
    </div>
  );
}
