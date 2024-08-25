"use client"
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { MdLogout } from "react-icons/md";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import TranslatorDashboard from "./translator-admin/TranslatorDashboard";

const AdminDashboardPage = () => {
    const router = useRouter();
    const { user, handleSignOut } = useAuth();

    useEffect(() => {
        if (!user) {
            router.push('/admin/login');
        }
    }, [user, router]);

    const handleLogout = async () => {
        await handleSignOut();
        try {
            router.push('/admin/login');
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div className="h-screen flex">
            <div className="h-full bg-graylt w-[15vw] flex flex-col justify-between flex-0 ">
                <div className="flex flex-col w-full text-xs">
                    <button className="text-left p-4 hover:bg-graymd flex items-center gap-4 ">
                        <img src="/translate.svg" alt="" className="h-5 w-5" />
                        Task Translator
                    </button>
                    <button className="text-left p-4 hover:bg-graymd flex items-center gap-4">
                        <img src="/compare.svg" alt="" className="h-5 w-5" />
                        Task Comparator
                    </button>
                    <button className="text-left p-4 hover:bg-graymd flex items-center gap-4">
                        <img src="/transition.svg" alt="" className="h-5 w-5" />
                        Transition Generator
                    </button>
                    <p className="p-4">Logged in user: {user?.username}</p>

                </div>
                <button onClick={() => handleLogout()} className="text-left p-4 hover:bg-graymd flex items-center gap-4 text-sm">
                    <MdLogout />
                    Logout
                </button>
            </div>
            <div className="p-8 flex-1 min-w-0 box-border">
                <TranslatorDashboard/>
            </div>
        </div>
    );
}

export default AdminDashboardPage;