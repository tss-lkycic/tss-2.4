import { Inter } from "next/font/google";
import "./globals.css";
import TopBar from "./components/TopBar";
import { AuthProvider } from "./context/AuthContext";
import amplifyConfig from "../awsConfig";
import { Amplify } from "aws-amplify";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "STAK",
};
Amplify.configure(amplifyConfig);

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <TopBar />
        <div className="bg-[#F6F6F6] text-[#555555] min-h-screen">
          <AuthProvider>{children}</AuthProvider>
        </div>
      </body>
    </html>
  );
}
