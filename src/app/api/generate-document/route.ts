import { NextRequest, NextResponse } from 'next/server';

const N8N_WEBHOOK = 'https://n8n-rfiv126lxlii.jkt4.sumopod.my.id/webhook/pancaran-generate-document';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(N8N_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
  }
}