import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { id, userStory, lang } = await req.json();
  try {
    const url = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000') + '/api/ai/analyze-case';
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, userStory, lang }) });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 503 });
  }
}
