import ChatInterface from "@/components/ChatInterface/ChatInterface";
import styles from "./page.module.css";
import Sidebar from "@/components/Sidebar/Sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/signin')
  }
  return (
    <main className={styles.pageContainer}>
      <Sidebar />
      <ChatInterface />
    </main>
  );
}
