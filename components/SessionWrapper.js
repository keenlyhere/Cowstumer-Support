'use client'
import { ChatProvider } from '@/context/ChatContext';
import { SessionProvider } from 'next-auth/react';

export default function SessionWrapper({ children }) {
    return (
        <SessionProvider>
            {/* <ChatProvider> */}
                { children }
            {/* </ChatProvider> */}
        </SessionProvider>
    )
}
