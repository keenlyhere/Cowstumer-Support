import { firestore } from '@/firebase';
import { collection, doc, setDoc, addDoc, serverTimestamp, getDocs, query, orderBy, where, updateDoc } from 'firebase/firestore';

export async function createChat(userId) {
    console.log('createChat:', userId);
    try {
        // const chatsCollection = collection(firestore, 'Chats');

        // console.log('chatRef.id:', chatRef.id);
        // await updateDoc(chatRef, {
        //     id: chatRef.id,
        // })

        // return chatRef.id;

        const response = await fetch('api/createChat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userId})
        })

        const newChat = await response.json();
        console.log('newChat:', newChat)
        return newChat.chatId;
        const initialMessage = { role: 'assistant', content: `Hi! I'm the cowstumer support assistant for Daily Moo'd. How can I help you today?` };
        // await addMessage(newChat.chatId, null, 'assistant', initialMessage.content);
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
        console.log('userId:', userId)
        const chatsQuery = query(
            collection(firestore, 'Chats'),
            where('userId', '==', userId),
            orderBy('createdAt', 'desc')
        );

        const querySnapshot = await getDocs(chatsQuery);
        const chats = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('User chats:', chats);
        return chats;
    } catch (error) {
        console.error('Error getting chats:', error);
        throw error;
    }
}
