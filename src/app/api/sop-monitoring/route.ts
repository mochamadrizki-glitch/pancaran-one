export const runtime = "nodejs";

type TeamEvent = {
  id: string;
  team: "Dispatch" | "Warehouse" | "CS" | "Finance";
  actor: string;
  action: string;
  timestamp: string;
  approval: boolean;
  processMins: number;
};

type SopAlert = {
  eventId: string;
  severity: "HIGH" | "MEDIUM";
  issue: string;
  recommendation: string;
  channels: ("in-app" | "email" | "whatsapp")[];
};

type SopResponse = {
  scannedAt: string;
  violations: SopAlert[];
  delivered: {
    inApp: number;
    email: number;
    whatsapp: number;
  };
  notes: string[];
};

const DEFAULT_EVENTS: TeamEvent[] = [
  {
    id: "EV-301",
    team: "Dispatch",
    actor: "Rina",
    action: "Reroute trip JKT-SBY",
    timestamp: "2026-04-30T03:41:00.000Z",
    approval: false,
    processMins: 4,
  },
  {
    id: "EV-302",
    team: "Warehouse",
    actor: "Ari",
    action: "Release cargo without checklist photo",
    timestamp: "2026-04-30T03:50:00.000Z",
    approval: true,
    processMins: 3,
  },
  {
    id: "EV-303",
    team: "Finance",
    actor: "Maya",
    action: "Manual fuel reimbursement",
    timestamp: "2026-04-30T04:02:00.000Z",
    approval: false,
    processMins: 36,
  },
  {
    id: "EV-304",
    team: "CS",
    actor: "Doni",
    action: "Update customer ETA",
    timestamp: "2026-04-30T04:05:00.000Z",
    approval: true,
    processMins: 7,
  },
];

function detectViolations(events: TeamEvent[]): SopAlert[] {
  const alerts: SopAlert[] = [];

  for (const event of events) {
    if (!event.approval && event.action.toLowerCase().includes("reroute")) {
      alerts.push({
        eventId: event.id,
        severity: "HIGH",
        issue: "Perubahan rute tanpa approval supervisor",
        recommendation: "Freeze dispatch update dan minta approval digital maksimum 10 menit.",
        channels: ["in-app", "whatsapp", "email"],
      });
    }

    if (event.action.toLowerCase().includes("without checklist")) {
      alerts.push({
        eventId: event.id,
        severity: "HIGH",
        issue: "Release cargo tanpa bukti checklist",
        recommendation: "Hold status shipment sampai evidence checklist diunggah.",
        channels: ["in-app", "whatsapp", "email"],
      });
    }

    if (!event.approval && event.action.toLowerCase().includes("manual fuel")) {
      alerts.push({
        eventId: event.id,
        severity: "MEDIUM",
        issue: "Klaim BBM manual tanpa approval",
        recommendation: "Kirim ke antrian audit finance sebelum diproses.",
        channels: ["in-app", "email"],
      });
    }

    if (event.processMins > 30) {
      alerts.push({
        eventId: event.id,
        severity: "MEDIUM",
        issue: "Waktu proses melewati SLA internal",
        recommendation: "Evaluasi bottleneck dan assign backup staff.",
        channels: ["in-app", "email"],
      });
    }
  }

  return alerts;
}

async function postWebhook(url: string | undefined, payload: unknown) {
  if (!url) return false;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function GET() {
  const violations = detectViolations(DEFAULT_EVENTS);
  const scannedAt = new Date().toISOString();

  const emailWebhook = process.env.SOP_EMAIL_WEBHOOK_URL;
  const waWebhook = process.env.SOP_WHATSAPP_WEBHOOK_URL;

  const emailTargets = violations.filter((v) => v.channels.includes("email"));
  const waTargets = violations.filter((v) => v.channels.includes("whatsapp"));

  const [emailSent, waSent] = await Promise.all([
    postWebhook(emailWebhook, { source: "SOP_MONITOR", scannedAt, alerts: emailTargets }),
    postWebhook(waWebhook, { source: "SOP_MONITOR", scannedAt, alerts: waTargets }),
  ]);

  const payload: SopResponse = {
    scannedAt,
    violations,
    delivered: {
      inApp: violations.length,
      email: emailSent ? emailTargets.length : 0,
      whatsapp: waSent ? waTargets.length : 0,
    },
    notes: [
      "Set SOP_EMAIL_WEBHOOK_URL untuk notifikasi email otomatis.",
      "Set SOP_WHATSAPP_WEBHOOK_URL untuk notifikasi WhatsApp otomatis.",
    ],
  };

  return Response.json(payload);
}
