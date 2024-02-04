import Image from "next/image";
import React from "react";
import Chat from "./components/Chat";

export default function Home() {
  const API_KEY = process.env.REACT_APP_OPEN_API_KEY;

  return (
    <div className="App">
      <header className="App-header">
        {/* align center */}
        <h1 style={{ textAlign: "center" }}>React Chatbot</h1>
      </header>
      <main>
        <Chat />
      </main>
    </div>
  );
}
