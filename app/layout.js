import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <SessionWrapper>
      <html lang="en">
        <head>
          <link rel="manifest" href="public/manifest.json" />
        </head>
        <body className={inter.className}>{children}</body>
      </html>
    </SessionWrapper>
  );
}
