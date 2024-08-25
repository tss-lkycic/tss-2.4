import { useEffect, useState } from "react";
import TranslatorInput from "./TranslatorInput";
import TranslatorPlayground from "./TranslatorPlayground";
import { useChat } from "ai/react";


const TranslatorDashboard = () => {
    const { messages, append, input, handleInputChange, handleSubmit, setInput } = useChat();
    const [selectedInputType, setSelectedInputType] = useState("Paste Text")
    const [userInput, setUserInput] = useState("")
    const [activeOpenAIOutput, setActiveOpenAIOutput] = useState("")
    useEffect(() => {
        const latestResponse = Object.values(messages).pop();
    
        if (latestResponse) {
          const role = latestResponse.role;
          if (role !== "user") {
            const sentences = latestResponse.content
              .split(/\d+\.\s/)
              .map((sentence) => sentence.replace(/\n/g, ""))
              .filter((sentence) => sentence.trim() !== "");
            setActiveOpenAIOutput(sentences);
            console.log("Latest response from OpenAI:" + sentences)
            // fetchData(sentences);
          } else {
            console.log("oops")
          }
        }
      }, [messages]);
      function getTasksFromText() {
        append({
            role: "user",
            content: `${userInput} Extract and summarise the tasks from the text into a set of sentences and return them such that each task is numbered. Keep each sentence shorter than 10 words.`,
        });
    }

    const handleGenerateForActivePrompt = () => {
        getTasksFromText();
        console.log(userInput);
    };
    return (
        <div className="flex items-start gap-10">
            <TranslatorInput {...{ selectedInputType, setSelectedInputType, userInput, setUserInput, handleGenerateForActivePrompt }} />
            <TranslatorPlayground {...{ activeOpenAIOutput }} />
        </div>
    );
}

export default TranslatorDashboard;