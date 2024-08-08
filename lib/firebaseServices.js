import { firestore } from '@/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, where } from 'firebase/firestore';

export async function createChat(userId) {
    try {
        const response = await fetch('api/createChat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userId})
        })

        const newChat = await response.json();
        return newChat.chatId;
    } catch (error) {
        console.error('Error creating chat: ', error);
    }
}

export async function addMessage(userId, chatId, role, content) {
    await addDoc(collection(firestore, 'Chats', chatId, 'Messages'), {
        chatId,
        userId: role === 'user' ? userId : null,
        role,
        content,
        createdAt: serverTimestamp()
    })
}

export async function getMessages(chatId) {
    const chatsQuery = collection(firestore, 'Chats');
    const messagesQuery = query(collection(chatsQuery, where('chatId', '==', chatId)), orderBy('createdAt', 'asc'));
    const querySnapshot = await getDocs(messagesQuery);
    const messages = querySnapshot.docs.map((doc) => doc.data());
    return messages;
}

export async function getChats(userId) {
    try {
        const chatsQuery = query(
            collection(firestore, 'Chats'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(chatsQuery);
        const chats = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return chats;
    } catch (error) {
        console.error('Error getting chats:', error);
        throw error;
    }
}
