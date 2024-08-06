'use client';
import { signIn, signOut, useSession } from "next-auth/react"
import { redirect } from "next/navigation";

export default function Dashboard() {
    const { data: session } = useSession();

    if (!session) {
        redirect('/signin');
    }
  return (
    <>
        {
            session ? (
                <>
                    <h1>Welcome back, { session.user?.name }!</h1>
                    <button onClick={() => signOut({ callbackUrl: '/' })}>Sign out</button>
                </>
            ) : (
                <>
                    <h1>You&apos;re not logged in.</h1>
                    <button onClick={() => signIn('google')}>Sign in with Google</button>
                    <button onClick={() => signIn('github')}>Sign in with Github</button>
                </>
            )
        }
    </>
  )
}
