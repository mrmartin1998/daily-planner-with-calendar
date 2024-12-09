import localFont from "next/font/local";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Daily Planner",
  description: "Organize your day with our daily planner application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${geistSans.variable} antialiased`}>
        <div className="min-h-screen bg-base-100">
          <div className="drawer lg:drawer-open">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
              <Header />
              {children}
            </div>
            <Sidebar />
          </div>
        </div>
      </body>
    </html>
  );
}
