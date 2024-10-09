// app/api/chat/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ message: 'Message is required' }, { status: 400 });
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [{ role: 'user', content: message }],
      }),
    });

    const data = await openaiResponse.json();
    const aiMessage = data.choices[0].message.content;

    return NextResponse.json({ id: Math.random().toString(36).substr(2, 9), message: aiMessage });
  } catch (error) {
    console.error('Error communicating with OpenAI:', error);
    return NextResponse.json({ message: 'Error communicating with the AI service.' }, { status: 500 });
  }
}
