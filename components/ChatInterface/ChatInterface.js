'use client'
import { useEffect, useState } from 'react';
import './ChatInterface.css';
import { useChatContext } from '@/context/ChatContext';
import { useSession } from 'next-auth/react';

export default function ChatInterface() {
    const { data: session } = useSession();
    const { getChats, messages, setMessages, chatId, setChatId } = useChatContext();
    const [ message, setMessage ] = useState('');
    const [ loading, setLoading ] = useState(false);

    // to-do: automatically scroll to bottom (most recent message) if overflowed

    useEffect(() => {
        if (!chatId) {
            setMessages([{
                role: 'assistant',
                content: `Hi! I'm the cowstumer support assistant for Daily Moo'd. How can I help you today?`
            }])
        }
    }, [chatId])

    const sendMessage = async () => {
        const userMessage = { role: 'user', content: message };
        const newMessages = [ ...messages, userMessage ];
        setMessages(newMessages);
        setMessage('');
        setLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: [...messages, { role: 'user', content: message }], chatId, session, content: message })
            })

            const data = await response.json();
            const botMessage = { role: 'assistant', content: data.message };
            setMessages([ ...newMessages, botMessage ]);
            setChatId(data.chatId);
            getChats(session.user.id);
            // console.log('chatId:', data.chatId);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = { role: 'assistant', content: 'Oops! Something went wrong. Please try again.' };
            setMessages([ ...newMessages, errorMessage ]);
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className='content-container'>
        <div className="chat-interface">
            <div className="messages-container">
                {messages.map((msg, index) => (
                <div key={index} className={`message-bubble ${msg.role}`} dangerouslySetInnerHTML={{ __html: msg.content }}>
                    {/* {msg.content} */}
                </div>
                ))}
                {loading && (
                    <div className="message-bubble assistant loading">
                        <div className="loader-container">
                            <div className="loader"></div>
                        </div>
                    </div>
                )}
            </div>
            <div className="input-container">
                <input
                type="text"
                className="input-field"
                placeholder="Message Cowstumer Support"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button className="send-button" onClick={sendMessage}>
                    Send
                </button>
            </div>
        </div>
    </div>
  );
}
