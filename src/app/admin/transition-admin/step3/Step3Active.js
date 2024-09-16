import { useChat } from "ai/react";
import { ConfigProvider, Spin } from "antd";
import { useEffect, useState, useRef } from "react";
import { FaLock } from "react-icons/fa";
import AIOutput from "./AIOutput";
import { transitionPrompts } from "@/constants/prompts";

function ActivePromptOutput({
  startActive,
  considerations,
  tasks,
  setLoading,
  setStartActive,
  loading,
}) {
  const [emergingPrompt, setEmergingPrompt] = useState("");
  const [adjacentPrompt, setAdjacentPrompt] = useState("");
  const [gigPrompt, setGigPrompt] = useState("");

  const [loadingCount, setLoadingCount] = useState(0);

  const adjacentRef = useRef();
  const emergingRef = useRef();
  const gigRef = useRef();

  useEffect(() => {
    setEmergingPrompt(
      transitionPrompts.emergingJobsPrompt(tasks, considerations)
    );
    setAdjacentPrompt(
      transitionPrompts.adjacentJobsPrompt(tasks, considerations)
    );
    setGigPrompt(transitionPrompts.gigJobsPrompt(tasks, considerations));
  }, [considerations, tasks]);

  const handleGenerateAll = () => {
    setLoadingCount(3); //3 outouts
    console.log("test");
    adjacentRef.current.handleGenerate();
    emergingRef.current.handleGenerate();
    gigRef.current.handleGenerate();
  };

  useEffect(() => {
    if (startActive) {
      handleGenerateAll();
    }
  }, [startActive]);

  const handleFinishLoading = () => {
    setLoadingCount((prev) => prev - 1);
    if (loadingCount === 1) {
      // Set startActive to false when all components are done
      setStartActive(false);
    }
  };

  return (
    <div className="mb-4">
      <h3 className="font-bold text-base mb-3">Active Prompts-In-Use</h3>
      <div className="max-w-full w-full flex items-start gap-2 text-xs">
        <AIOutput
          ref={adjacentRef}
          title={"Adjacent Jobs"}
          type="active"
          prompt={adjacentPrompt}
          promptPreview={transitionPrompts.adjacentJobsPrompt(
            " ${tasks} ",
            " ${considerations} "
          )}
          onFinishLoading={handleFinishLoading}
        />
        <AIOutput
          ref={emergingRef}
          title={"Emerging Jobs"}
          type="active"
          prompt={emergingPrompt}
          promptPreview={transitionPrompts.emergingJobsPrompt(
            " ${tasks} ",
            " ${considerations} "
          )}
          onFinishLoading={handleFinishLoading}
        />
        <AIOutput
          ref={gigRef}
          title={"Gig Jobs"}
          type="active"
          prompt={gigPrompt}
          promptPreview={transitionPrompts.gigJobsPrompt(
            " ${tasks} ",
            " ${considerations} "
          )}
          onFinishLoading={handleFinishLoading}
        />
      </div>
    </div>
  );
}

export default ActivePromptOutput;
