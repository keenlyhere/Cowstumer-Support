import { firestore } from "@/firebase";
import { authOptions } from "@/lib/authOptions";
import { collection, getDocs, query, where } from "firebase/firestore";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// update email
export async function PUT(req) {
    const { email, newEmail } = await req.json();
    try {
        const session = getServerSession(authOptions);

        if (!session) {
            NextResponse.json({ error: 'Not authorized' }, { status: 400 })
        }

        const userQuery = query(collection(firestore, 'Users'), where('email', '==', email));
        const querySnapshot = await getDocs(userQuery);

        if (querySnapshot.empty) {
            return NextResponse.json({ error: 'User not found'}, { status: 400 });
        }

        // update email
        const userDoc = querySnapshot.docs[0];
        const updateUserEmail = await updateDoc(userDoc, {
            email: newEmail
        });

        return NextResponse.json({ success: 'Email updated' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
