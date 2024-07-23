import { Inter } from "next/font/google";
import "./globals.css";
import TopBar from "./components/TopBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "STAK",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TopBar />
        <div className="bg-[#F6F6F6] text-[#555555] min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
