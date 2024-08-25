"use client";

const StepTracker = ({ stage }) => {
  return (
    <div className="flex justify-center items-center space-x-4">
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-full ${
          stage == 1 ? "bg-gray-600 text-white" : "bg-gray-300 text-gray-500"
        }`}
      >
        1
      </div>
      <div className="h-px md:w-28 w-10 bg-gray-300"></div>
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-full ${
          stage == 2 ? "bg-gray-600 text-white" : "bg-gray-300 text-gray-500"
        }`}
      >
        2
      </div>
      <div className="h-px md:w-28 w-10 bg-gray-300"></div>
      <div
        className={`flex items-center justify-center w-8 h-8 rounded-full ${
          stage == 3 ? "bg-gray-600 text-white" : "bg-gray-300 text-gray-500"
        }`}
      >
        3
      </div>
    </div>
  );
};

export default StepTracker;
