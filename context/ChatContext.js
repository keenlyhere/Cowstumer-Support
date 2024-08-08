'use client'
import { createContext, useContext, useState } from 'react';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [ chatId, setChatId ] = useState(null);
    const [ messages, setMessages ] = useState([]);
    const [ chats, setChats ] = useState([]);

    const getChats = async (userId) => {
        const response = await fetch(`/api/chats?userId=${userId}`, {
            method: 'GET',
        })

        const chatData = await response.json();
        setChats(chatData.chats);
    }

    const loadChat = async (currChatId) =>  {
        const response = await fetch(`/api/chat?chatId=${currChatId}`, {
            method: 'GET',
        })

        const messagesData = await response.json();
        setMessages(messagesData.messages);
        setChatId(currChatId);
    }

    return (
        <ChatContext.Provider value={{ chatId, setChatId, messages, setMessages, chats, setChats, getChats, loadChat }}>
            { children }
        </ChatContext.Provider>
    )
}

export const useChatContext = () => useContext(ChatContext);
