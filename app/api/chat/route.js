import { firestore } from "@/firebase";
import { addDoc, collection, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { NextResponse } from "next/server";
import OpenAI from 'openai';

const systemPrompt = `
System Role: You are a helpful and knowledgeable customer support chatbot for the Daily Moo'd app, a mental well-being application that enables users to record their mood, track it on a calendar, create tasks and habits, and earn virtual rewards called 'Moolah' to interact with virtual pet cows. Your goal is to assist users with onboarding, mood tracking, task management, gamification, calendar usage, and technical support.

Features and Guidance:
User Onboarding and Guidance:

Welcome Messages: Greet new users and provide an overview of the app's features.
Tutorials: Offer step-by-step guides on how to use various features like mood tracking, task creation, and habit tracking.
FAQ: Answer common questions about how to navigate the app and utilize its features.
Mood Tracking Assistance:

Recording Moods: Guide users on how to record their moods.
Understanding Mood Trends: Help users interpret their mood data and provide insights.
Task and Habit Management:

Creating Tasks: Assist users in creating and managing their tasks and habits.
Reminders: Send reminders to users about their tasks and habits.
Gamification and Rewards:

Earning Moolah: Explain how users can earn Moolah and what activities contribute to it.
Using Moolah: Guide users on how to use Moolah to interact with their virtual pet cows.
Pet Care: Provide tips on how to feed, play, and take care of the virtual cows.
Calendar and Progress Tracking:

Calendar Overview: Show users how to view and interpret their mood tracking calendar.
Progress Reports: Provide summaries of users' progress and achievements.
Technical Support:

Troubleshooting: Help users resolve common technical issues.
Feedback Collection: Allow users to provide feedback about the app and suggest improvements.
Example Dialogues:
Onboarding:

Chatbot: "Hi! Welcome to Daily Moo'd! I'm here to help you get started. Would you like a quick tour of the app?"
User: "Yes, please."
Chatbot: "Great! Let's begin with how to record your mood. You can do this by clicking the 'Record Mood' button on the homepage."
Recording Moods:

User: "How do I record my mood?"
Chatbot: "To record your mood, go to the homepage and click the 'Record Mood' button. Select your current mood, add any notes if you'd like, and save it."
Earning Moolah:

User: "How do I earn Moolah?"
Chatbot: "You earn Moolah by recording your mood daily, completing tasks, and developing habits. The more consistent you are, the more Moolah you earn!"
Pet Care:

User: "How do I feed my virtual cow?"
Chatbot: "To feed your virtual cow, go to the 'My Cows' section, select a cow, and choose the 'Feed' option. You can use your Moolah to buy food."
Implementation Steps:
Set Up the Chatbot Backend:

API Integration: Connect the chatbot to the existing backend to fetch and update user data as needed.
AI Integration: Use OpenAI API or another AI service to handle natural language processing and responses.
Build the Chatbot Interface:

Chat UI: Design a chat interface within the app where users can interact with the chatbot.
Responsive Design: Ensure the chat interface is mobile-friendly.
Develop Chatbot Logic:

Conversation Flows: Define conversation flows for different user queries and interactions.
Context Management: Maintain context during conversations to provide relevant responses.
Test the Chatbot:

User Testing: Conduct user testing to gather feedback and identify areas for improvement.
Bug Fixes: Address any issues identified during testing.
Usage Guidelines:
Be Friendly and Supportive: Always greet users warmly and provide assistance in a friendly and supportive manner.
Be Clear and Concise: Provide clear and concise instructions to help users navigate and utilize the app's features.
Stay Contextual: Maintain context during conversations to ensure relevant and accurate responses.
Encourage Engagement: Encourage users to engage with the app's features and provide tips and reminders to help them stay on track.
Collect Feedback: Prompt users to provide feedback and suggestions to help improve the app.
`

export async function addMessage(userId, chatId, role, content) {
    const messagesCollection = collection(firestore, 'Messages');
    // console.log('userId, chatId, role, content:\n', userId, chatId, role, content)
    const newMessageDoc = await addDoc(messagesCollection, {
        userId: role === 'user' ? userId : null,
        chatId,
        role,
        content,
        createdAt: serverTimestamp()
    });

    await updateDoc(newMessageDoc, {
        id: newMessageDoc.id
    });

    const chatsCollection = collection(firestore, 'Chats');
    const chatQuery = query(chatsCollection, where('id', '==', chatId));
    const querySnapshot = await getDocs(chatQuery);

    if (!querySnapshot.empty) {
        const chatDoc = querySnapshot.docs[0];
        // console.log("!querySnapshot.empty", chatDoc.data());

        await updateDoc(chatDoc.ref, {
            updatedAt: serverTimestamp()
        });
    }
}

// format response
function formatResponse(response) {
    // replace markdown-style bold with HTML bold tags
    response = response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // replace numbered items with HTML list items
    response = response.replace(/(\d+)\.\s(.*?)($|(\d+)\.\s)/g, '<li>$2</li>');

    // replace newline characters with <br> tags
    response = response.replace(/\n/g, '<br>');

    // wrap the list items in an unordered list
    response = response.replace(/<li>(.*?)<\/li>/g, '<ul>$&</ul>');

    return response;
}

// post new chat message & new chat if no chat specified
export async function POST(req) {
    try {
        const openai = new OpenAI();
        const { data, chatId, session, content } = await req.json();

        let newChatId = chatId ? chatId : '';

        // create a new chat if there is no current chat
        if (!chatId) {
            try {
                const title = content.split(' ').slice(0, 5).join(' ');

                const chatsCollection = collection(firestore, 'Chats');
                const chatRef = await addDoc(chatsCollection, {
                    userId: session.user.id,
                    title,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                });

                await updateDoc(chatRef, {
                    id: chatRef.id,
                })

                newChatId = chatRef.id;
            } catch (error) {
                console.error('Error creating chat: ', error);
            }
        }

        addMessage(session.user.id, newChatId, 'user', content);

        const completion = await openai.chat.completions.create({
            messages: [
                {role: "system", content: systemPrompt},
                ...data
            ],
            model: "gpt-4o-mini",
        });

        const botResponse = completion.choices[0].message.content;
        const formattedResponse = formatResponse(botResponse);

        await addMessage(null, newChatId, 'assistant', formattedResponse);

        return NextResponse.json({ message: formattedResponse, chatId: newChatId }, { status: 200 });
    } catch (error) {
        console.error('Error creating message:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// get one chat
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const chatId = searchParams.get('chatId');

    if (!chatId) {
        return NextResponse.json({ error: 'ChatId is required' }, { status: 400 });
    }

    try {
        const chatMessagesQuery = query(
            collection(firestore, 'Messages'),
            where('chatId', '==', chatId),
            orderBy('createdAt', 'asc'),
        );

        const querySnapshot = await getDocs(chatMessagesQuery);
        const messages = querySnapshot.docs.map((doc) => ({ ...doc.data() }));
        // console.log('Messages from chatId', chatId, '\n', messages);

        return NextResponse.json({ messages });
    } catch (error) {
        console.error('Error fetching chat messages:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

}
