import { NextResponse } from "next/server";
import OpenAI from 'openai';

export async function POST(req) {
    const openai = new OpenAI();
    const data = await req.json();

    const completion = await openai.chat.completions.create({
        messages: [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "What is a LLM?"}
        ],
        model: "gpt-4o-mini",
    });

    console.log('chat response:', completion.choices[0].message.content);

    return NextResponse.json({ message: 'Hello from the server!' });
}
