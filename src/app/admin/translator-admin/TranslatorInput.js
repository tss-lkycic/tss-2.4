const TranslatorInput = ({
    selectedInputType, setSelectedInputType, userInput, setUserInput, handleGenerate
}) => {

    const handleSelectChange = (event) => {
        setSelectedInputType(event.target.value);
    };

    const handleInputChange = (event) => {
        setUserInput(event.target.value);
        console.log(event.target.value)
      };

    return (
        <div className="w-[30%] flex-none">
            <h3 className="font-bold text-lg mb-3">Input Type</h3>
            <select className="w-full p-2 bg-graylt rounded-md cursor-pointer mb-4 text-sm" id="optionsDropdown" value={selectedInputType} onChange={handleSelectChange}>
                <option value="pasteText">Paste Text</option>
                <option value="inputJob">Input Job</option>
                <option value="inputHobbies">Input Hobbies</option>
            </select>
            <h3 className="font-bold text-lg">Input</h3>
            <p className="my-2 text-xs">Please submit the text you wish to convert into standardized task activities. This can be a job description, course description, or your resume content.</p>
            <textarea
                className="w-full p-2 bg-graylt rounded-md cursor-text mb-6 overflow-y-auto h-[50vh] text-sm"
                value={userInput}
                onChange={handleInputChange}
                style={{ resize: 'none' }}
                placeholder="Enter your text here..."
            ></textarea>
            <button className="rounded-md bg-graydark hover:bg-graymd text-graylt w-full p-2" onClick={()=>handleGenerate()}>Generate</button>
        </div>
    );
}

export default TranslatorInput;