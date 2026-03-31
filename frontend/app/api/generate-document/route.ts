import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { template_type, fields, language } = await req.json();
  try {
    const url = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000') + '/api/documents/generate';
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ templateType: template_type, fields, language }) });
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Document generation unavailable' }, { status: 503 });
  }
}
