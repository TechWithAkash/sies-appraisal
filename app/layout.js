import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import { AppraisalProvider } from "@/lib/context/AppraisalContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Teacher Appraisal System - SIES ERP",
  description: "Comprehensive teacher appraisal and evaluation system for academic excellence",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <AppraisalProvider>
            {children}
          </AppraisalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
