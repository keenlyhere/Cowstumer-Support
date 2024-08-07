'use client'
import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { addMessage, getChats } from '@/lib/firebaseServices';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { data: session } = useSession();
    const [ chatId, setChatId ] = useState(null);
    const [ messages, setMessages ] = useState([]);
    const [chats, setChats] = useState([]);

    const fetchChats = async (userId) => {
        try {
            const userChats = await getChats(userId);
            setChats(userChats);
        } catch (error) {
            console.error('Error fetching chats:', error);
        }
    }

    // if (session) {
    //     fetchChats(session.user.id);
    // }


    const initializeChat = async (userId) => {
        try {
            // console.log('initializeChat');
            // const newChatId = await createChat(userId);
            // console.log('newChatId:', newChatId);
            // setChatId(newChatId);

            // const initialMessage = { role: 'assistant', content: `Hi! I'm the cowstumer support assistant for Daily Moo'd. How can I help you today?` };
            // await addMessage(newChatId, null, 'assistant', initialMessage.content);
            // setMessages([initialMessage]);

            // refresh chat list after creating new chat
            // fetchChats(userId);
            const response = await fetch('/api/createChat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({userId})
            })

            const newChat = await response.json();
            const initialMessage = { role: 'assistant', content: `Hi! I'm the cowstumer support assistant for Daily Moo'd. How can I help you today?` };
            // await addMessage(newChat.chatId, null, 'assistant', initialMessage.content);
            return newChat.chatId;
        } catch (error) {
            console.error('Error initializing chat:', error);
        }
    };

    const loadChat = async (chatId) => {
        try {
            const chatMessages = await getMessages(chatId);
            setChatId(chatId);
            setMessages(chatMessages);
        } catch (error) {
            console.error('Error loading chat:', error);
        }
    }

    return (
        <ChatContext.Provider value={{ chatId, setChatId, messages, setMessages, chats, loadChat, initializeChat }}>
            { children }
        </ChatContext.Provider>
    )
}

export const useChatContext = () => useContext(ChatContext);
