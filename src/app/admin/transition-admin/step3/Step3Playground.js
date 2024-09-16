import { useEffect, useState, useRef } from "react";
import AIOutput from "./AIOutput";
import { Alert } from "antd";

function PlaygroundPromptOutput({
  startPlayground,
  tasks,
  considerations,
  setLoading,
  setStartPlayground,
  loading,
  tokenMap,
}) {
  const [loadingCount, setLoadingCount] = useState(0);

  const adjacentRefPlayground = useRef();
  const emergingRefPlayground = useRef();
  const gigRefPlayground = useRef();

  const handleGenerateAll = () => {
    setLoadingCount(3); // Expecting 3 outputs
    adjacentRefPlayground.current.handleGenerate();
    emergingRefPlayground.current.handleGenerate();
    gigRefPlayground.current.handleGenerate();
  };

  useEffect(() => {
    if (startPlayground) {
      handleGenerateAll();
    }
  }, [startPlayground]);

  const handleFinishLoading = () => {
    setLoadingCount((prev) => prev - 1);
    if (loadingCount === 1) {
      // Set startPlayground to false when all components are done
      setStartPlayground(false);
    }
  };

  return (
    <div className="mb-4">
      <h3 className="font-bold text-base mb-3">Playground Prompts</h3>
      <Alert
        className="mb-4 text-xs"
        message="Add ${tasks} and ${considerations} at the appropriate places where you want the IWAs (tasks) and considerations inputs to be inserted."
        type="info"
        showIcon
      />
      <div className="max-w-full w-full flex items-start gap-2 text-xs">
        <AIOutput
          ref={adjacentRefPlayground}
          title={"Adjacent Jobs"}
          type="playground"
          prompt={""}
          promptPreview={""}
          onFinishLoading={handleFinishLoading}
          tokenMap={tokenMap}
        />
        <AIOutput
          ref={emergingRefPlayground}
          title={"Emerging Jobs"}
          type="playground"
          prompt={""}
          promptPreview={""}
          onFinishLoading={handleFinishLoading}
          tokenMap={tokenMap}
        />
        <AIOutput
          ref={gigRefPlayground}
          title={"Gig Jobs"}
          type="playground"
          prompt={""}
          promptPreview={""}
          onFinishLoading={handleFinishLoading}
          tokenMap={tokenMap}
        />
      </div>
    </div>
  );
}

export default PlaygroundPromptOutput;
