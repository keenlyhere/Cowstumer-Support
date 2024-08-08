import { firestore } from "@/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { NextResponse } from "next/server";

// get all chats
export async function GET(req, res) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'UserId is required' }, { status: 400 });
    }

    const chatsQuery = query(
        collection(firestore, 'Chats'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(chatsQuery);
    const chats = querySnapshot.docs.map((doc) => ({ ...doc.data() }));
    // console.log('user chats:', chats);

    return NextResponse.json({ chats });
}
