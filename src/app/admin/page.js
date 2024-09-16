"use client";
import { useRouter } from "next/navigation";
import { MdLogout } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import TranslatorDashboard from "./translator-admin/TranslatorDashboard";
import ComparatorDashboard from "./comparator-admin/ComparatorDashboard";
import TransitionDashboard from "./transition-admin/TransitionDashboard";

const AdminDashboardPage = () => {
  const router = useRouter();
  const { user, handleSignOut } = useAuth();
  const [selectedTool, setSelectedTool] = useState("translate");

  useEffect(() => {
    if (!user) {
      router.push("/admin/login");
    }
  }, [user, router]);

  const handleLogout = async () => {
    await handleSignOut();
    try {
      router.push("/admin/login");
    } catch (err) {
      console.error(err);
    }
  };

  const changeTool = (tool) => {
    setSelectedTool(tool);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="flex-none bg-graylt w-[15vw] flex flex-col justify-between min-h-screen">
        <div className="flex flex-col w-full text-xs">
          <button
            onClick={() => changeTool("translate")}
            className="text-left p-4 hover:bg-graymd flex items-center gap-4"
          >
            <img src="/translate.svg" alt="" className="h-5 w-5" />
            Task Translator
          </button>
          <button
            onClick={() => changeTool("compare")}
            className="text-left p-4 hover:bg-graymd flex items-center gap-4"
          >
            <img src="/compare.svg" alt="" className="h-5 w-5" />
            Task Comparator
          </button>
          <button
            onClick={() => changeTool("transition")}
            className="text-left p-4 hover:bg-graymd flex items-center gap-4"
          >
            <img src="/transition.svg" alt="" className="h-5 w-5" />
            Transition Generator
          </button>
          <p className="p-4">Logged in user: {user?.username}</p>
          <button
            onClick={() => handleLogout()}
            className="text-left p-4 hover:bg-graymd flex items-center gap-4 text-sm"
          >
            <MdLogout />
            Logout
          </button>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="flex-1 p-8 box-border overflow-y-auto">
        {selectedTool === "translate" && <TranslatorDashboard />}
        {selectedTool === "compare" && <ComparatorDashboard />}
        {selectedTool === "transition" && <TransitionDashboard />}

      </div>
    </div>
  );
};

export default AdminDashboardPage;
