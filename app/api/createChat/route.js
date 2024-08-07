import { firestore } from "@/firebase";
import { addDoc, collection, serverTimestamp, updateDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req) {
    const { userId } = await req.json();

        console.log('createChat userId:', userId);
    try {
        const chatsCollection = collection(firestore, 'Chats');
        const chatRef = await addDoc(chatsCollection, {
            userId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        console.log('new chatRef.id:', chatRef.id);
        await updateDoc(chatRef, {
            id: chatRef.id,
        })

        return NextResponse.json({ chatId: chatRef.id });
    } catch (error) {
        console.error('Error creating chat: ', error);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
