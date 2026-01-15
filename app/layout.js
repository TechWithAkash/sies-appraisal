import { Poppins } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/context/AuthContext";
import { AppraisalProvider } from "@/lib/context/AppraisalContext";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata = {
  title: "Teacher Appraisal System - SIES ERP",
  description: "Comprehensive teacher appraisal and evaluation system for academic excellence",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} antialiased`}
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
