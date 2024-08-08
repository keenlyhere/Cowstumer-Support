'use client'
import { useEffect, useState } from 'react';
import '@/components/ChatInterface/ChatInterface.css';
import { addMessage, createChat } from '@/lib/firebaseServices';
import { useSession } from 'next-auth/react';

export default function ChatInterface() {
    const { data: session } = useSession();
    const [ messages, setMessages ] = useState([{
        role: 'assistant',
        content: `Hi! I'm the cowstumer support assistant for Daily Moo'd. How can I help you today?`
    }]);
    const [ message, setMessage ] = useState('');
    const [ loading, setLoading ] = useState(false);

    useEffect(() => {
        if (session) {
            createChat(session.user.id);
        }
    }, [session]);

    const sendMessage = async () => {
        const userMessage = { role: 'user', content: message };
        const newMessages = [ ...messages, userMessage ];
        setMessages(newMessages);
        setMessage('');
        setLoading(true);

        if (chatId) {
            await addMessage(session.user.id, chatId, 'user', message);
        }

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: [...messages, { role: 'user', content: message }], chatId })
            })

            const data = await response.json();
            const botMessage = { role: 'assistant', content: data.message };
            setMessages([ ...newMessages, botMessage ]);
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
                <div key={index} className={`message-bubble ${msg.role}`}>
                    {msg.content}
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
                placeholder="Message ChatGPT"
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
