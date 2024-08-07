import { firestore } from "@/firebase";
import { hash } from "bcrypt";
import { addDoc, collection, getDocs, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req, res) {
    try {
        
    } catch (error) {

    }
}

export async function POST(req, res) {
    try {
        const { email, password } = await req.json();
        const userCollection = collection(firestore, 'Users');
        // console.log('userCollection:', userCollection);
        const hashedPassword = await hash(password, 10);

        // check if user already exists
        const userQuery = query(userCollection, where('email', '==', email));
        const querySnapshot = await getDocs(userQuery);
        // console.log('querySnapshot:', querySnapshot);

        if (querySnapshot.empty) {
            return NextResponse.json({ error: 'User does not exist' }, { status: 400 });
        }

        const newUser = {
            name,
            email,
            password: hashedPassword,
            createdAt: serverTimestamp(),
        }

        const newUserDocRef = await addDoc(userCollection, newUser);
        // console.log('New user id:', newUserDocRef.id);

        await updateDoc(newUserDocRef, {
            id: newUserDocRef.id
        });

        return NextResponse.json({ success: 'Account created' }, { status: 200 });
    } catch (error) {
        console.error('Error signing up:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
