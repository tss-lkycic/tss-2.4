import { FaExpandAlt } from "react-icons/fa";
import ActivePromptOutput from "./ActivePromptOutput";
const TranslatorPlayground = ({
    activeOpenAIOutput
}) => {
    return (
        <div className="flex-1 min-w-0">
            <ActivePromptOutput {...{activeOpenAIOutput}}/>
            <div className="mb-4">
                <h3 className="font-bold text-lg mb-3">Prompt Playground</h3>
                <div className="rounded-md bg-graylt py-2 px-4 mb-4 flex items-center w-full">
                    <p className="truncate overflow-hidden whitespace-nowrap text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    <FaExpandAlt className=" text-2xl ml-2" />
                </div>
                <div className="w-full flex items-start gap-2 h-[30vh] text-xs text-white">
                    <div className="bg-black w-full p-4 h-full">
                        <p className="font-semibold text-white text-xs mb-2">OpenAI Output</p>
                        <p className="h-4/5 py-2 overflow-y-auto"></p>
                    </div>
                    <div className="bg-black w-full p-4 h-full">
                        <p className="font-semibold text-white text-xs mb-2">IWA Output</p>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default TranslatorPlayground;