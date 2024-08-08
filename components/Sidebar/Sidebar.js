'use client'
import { useSession, signOut } from 'next-auth/react';
import './Sidebar.css';
import { useChatContext } from '@/context/ChatContext';
import { useEffect } from 'react';
import logo from '@/public/logo_dailymood.png';
import Image from 'next/image';

export default function Sidebar() {
  const { chats, getChats, loadChat, chatId } = useChatContext();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      getChats(session.user.id);
    }
  }, [session])

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  // to-do: add `new chat` button

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Image src={logo} width={180} alt="Daily Moo'd logo" />
        <h2>Cowstumer Support</h2>
      </div>

      {/* to-do: new chat button should go here */}

      <div className="sidebar-content">
        <p className='sidebar-heading'>Chat History</p>
        { chats && chats.length ? chats.map((currChat) => (
          <div key={currChat.id} className={`chat-item ${ chatId === currChat.id ? 'active' : '' }`} onClick={() => loadChat(currChat.id)}>
            { currChat.title ? `${currChat.title}...` : new Date(currChat.createdAt.seconds * 1000).toLocaleString()}
          </div>
        )) : (
          <div>{` `}</div>
        )}
      </div>
      
      <div className="sidebar-footer">
        <button onClick={handleSignOut} className="sign-out-button">Sign Out</button>
      </div>
    </div>
  );
}
