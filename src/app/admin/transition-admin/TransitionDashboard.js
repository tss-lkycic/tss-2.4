"use client";

import { useEffect, useRef, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import html2canvas from "html2canvas";
import ErrorModal from "../../components/ErrorModal";
import { ConfigProvider, Tabs } from "antd";
import Step1View from "./step1/Step1View";

export default function TransitionDashboard() {
  const [inputType, setInputType] = useState("text");
  const [job, setJob] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [startActive, setStartActive] = useState(false);
  const [startPlayground, setStartPlayground] = useState(false);
  const [step, setStep] = useState(1)

  function handleJobChange(e) {
    const jobName = e.target.value;
    setJob(jobName);
  }

  function handleTextChange(e) {
    const textContent = e.target.value;
    setText(textContent);
  }

  function handleHobbiesChange(e) {
    const hobbiesContent = e.target.value;
    setHobbies(hobbiesContent);
  }

  const handleChangeStep = (key) => {
    setStep(parseInt(key));
    console.log(key)
  };
  
  return (
    <div className="w-full">
      <ConfigProvider
        theme={{
            token: {
                colorPrimary: "#000",
                colorBorderSecondary: "rgb(0,0,0, 0.2)"
            },
            components: {
              Tabs: {
                cardPadding: "8px 24px",
                cardBg: "#D9D9D9",
              },
            },
          }}
      >
        <Tabs
          type="card"
          onChange={handleChangeStep}
          items={new Array(3).fill(null).map((_, i) => {
            const id = String(i + 1);
            return {
              label: `Step ${id}`,
              key: id,
            };
          })}
        />
      </ConfigProvider>
      {(step === 1) && <Step1View step={step}/>}
    </div>
  );
}
