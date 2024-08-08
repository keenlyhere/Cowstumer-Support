import { Inter } from "next/font/google";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import { ChatProvider } from "@/context/ChatContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Daily Moo'd | Cowstumer Support",
  description: "Get personalized assistance for Daily Moo'd. Cowstumer Support is here to help you navigate the app, troubleshoot issues, and maximize your experience.",
};

export default function RootLayout({ children }) {
  return (
    <SessionWrapper>
        <html lang="en">
          <head>
            <link rel="manifest" href="public/manifest.json" />
          </head>
          <ChatProvider>
            <body className={`${inter.className}`}>
              {children}
            </body>
          </ChatProvider>
        </html>
    </SessionWrapper>
  );
}
