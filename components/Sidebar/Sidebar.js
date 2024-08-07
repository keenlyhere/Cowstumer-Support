'use client'
import { useSession, signOut } from 'next-auth/react';
import './Sidebar.css';
import { useChatContext } from '@/context/ChatContext';

export default function Sidebar() {
  // const { chats, loadChat } = useChatContext();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Cowstumer Support</h2>
      </div>

      <div className="sidebar-content">
        <h3>Chat History</h3>
        {/* { chats.map((chat) => (
          <div key={chat.id} className='chat-item' onClick={() => loadChat(chat.id)}>
            {chat.title}
          </div>
        ))} */}
      </div>
    <button onClick={handleSignOut} className="sign-out-button">Sign Out</button>
    </div>
  );
}
