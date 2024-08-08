import { authOptions } from "@/lib/authOptions"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation";
import Form from "./Form";
import './Form.css';
import Link from "next/link";

export default async function Signup() {
    const session = await getServerSession(authOptions);

    if (session) {
        redirect('/');
    }

    return (
        <section className="signup-page">
            <div className="welcome-section">
                <h1>Welcome to</h1>
                <h1>Cowstumer Support</h1>
                <p>Your one-stop solution for efficient and friendly customer support. We are here to assist you with all your queries and ensure you have a smooth experience. Sign up now to get started!</p>
            </div>
            <div className="form-section">
                <h2>Signup</h2>
                <Form />
                <p className="form-other">Already have an account?<span className="form-link"><Link href='/signin' className="form-link">Sign in</Link></span></p>
            </div>
        </section>
    )
}
