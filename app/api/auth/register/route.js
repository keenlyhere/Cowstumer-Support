import { firestore } from "@/firebase";
import { hash } from "bcrypt";
import { addDoc, collection, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    try {
        const { name, email, password, confirmPassword } = await req.json();
        const userCollection = collection(firestore, 'Users');

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        if (password !== confirmPassword) {
            return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 });
        }

        const hashedPassword = await hash(password, 10);

        // check if user already exists
        const userQuery = query(userCollection, where('email', '==', email));
        const querySnapshot = await getDocs(userQuery);

        if (querySnapshot.empty) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const newUser = {
            name,
            email,
            password: hashedPassword,
            createdAt: serverTimestamp(),
        }

        const newUserDocRef = await addDoc(userCollection, newUser);

        await updateDoc(newUserDocRef, {
            id: newUserDocRef.id
        });

        return NextResponse.json({ success: 'Account created' }, { status: 200 });
    } catch (error) {
        console.error('Error signing up:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
