import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '@/firebase';
import bcrypt from 'bcrypt';

export const authOptions = {
    session: {
        strategy: 'jwt',
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                name: {},
                email: {},
                password: {},
            },
            async authorize(credentials, req) {
                const userCollection = collection(firestore, 'Users');
                const userQuery = query(userCollection, where('email', '==', credentials?.email));
                const querySnapshot = await getDocs(userQuery);

                if (querySnapshot.empty || querySnapshot.docs.length === 0) {
                    return null;
                }

                const userDoc = querySnapshot.docs[0];
                const user = userDoc.data();
                const passwordMatch = await bcrypt.compare(credentials?.password, user.password);

                if (passwordMatch) {
                    return {
                        id: user?.id,
                        email: user?.email,
                        name: user?.name
                    }
                }

                return null;
            }
        }),
    ],
    callbacks: {
        jwt: async ({ user, token, trigger, session }) => {
            if (trigger === 'update') {
                return { ...token, ...session.user };
            }

            return { ...token, ...user };
        }
    }
}
