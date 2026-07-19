// src/app/api/hmt-chat/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const response = await fetch(
      'https://n8n-rfiv126lxlii.jkt4.sumopod.my.id/webhook/pancaran-intelligence-chat',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message:         body.message,
          session_id:      body.session_id,
          user_name:       body.user_name || 'Manager HMT',
          user_role:       body.role || 'hmt_manager',
          project_context: body.project_id || '',
        }),
      }
    );

    const data = await response.json();
    const text = data.response || data.output || data.text || data.message;

    return NextResponse.json({
      response: typeof text === 'string' ? text : JSON.stringify(data),
    });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Gagal menghubungi AI', detail: msg }, { status: 500 });
  }
}