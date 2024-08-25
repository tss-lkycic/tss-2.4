import React from "react";

function ErrorModal({ message, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-1/2 shadow-lg flex flex-col">
        <h2 className="text-xl font-bold mb-4">Error</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="w-1/2 bg-gray-500 text-white py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorModal;
