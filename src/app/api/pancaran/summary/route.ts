export const runtime = 'nodejs';

type PancaranSummary = {
  source: string;
  updatedAt: string;
  facts: Array<{ label: string; value: string; note?: string }>;
  contacts: Array<{ label: string; value: string }>;
  business: string[];
};

function pickFirst(patterns: RegExp[], text: string) {
  for (const p of patterns) {
    const m = text.match(p);
    if (m?.[1]) return m[1].trim();
  }
  return null;
}

function pickLiteral(patterns: RegExp[], text: string) {
  for (const p of patterns) {
    const m = text.match(p);
    if (m?.[0]) return m[0].trim();
  }
  return null;
}

function normalizeNumberString(raw: string) {
  // Keep digits + dot separators; collapse spaces.
  const cleaned = raw.replace(/[^\d.]/g, '').trim();
  return cleaned || raw.trim();
}

function pickFactNumber(text: string, patterns: RegExp[]) {
  const raw = pickFirst(patterns, text);
  return raw ? normalizeNumberString(raw) : null;
}

export async function GET() {
  const source = 'https://pancaran-group.co.id/';

  try {
    const res = await fetch(source, {
      // Make caching predictable for server; refresh periodically.
      next: { revalidate: 60 * 60 },
      headers: {
        'user-agent': 'pancaran-one-fleet-management-portal/1.0',
      },
    });

    const html = await res.text();
    const updatedAt = new Date().toISOString();

    // Heuristic extraction based on visible headings on the homepage.
    const crews =
      pickFactNumber(html, [
        /over[\s\S]{0,40}?([\d.,]+)[\s\S]{0,40}?crews/i,
        /over[\s\S]{0,40}?([\d.,]+)[\s\S]{0,120}?crews[\s\S]{0,40}?operators/i,
      ]) ??
      pickFirst([/OVER\s*([\d.,]+)\s*CREWS/i], html);

    const subsidiaries =
      pickFactNumber(html, [
        /total[\s\S]{0,40}?of[\s\S]{0,40}?([\d.,]+)[\s\S]{0,80}?subsidiaries/i,
        /we[\s\S]{0,40}?have[\s\S]{0,40}?a[\s\S]{0,40}?total[\s\S]{0,40}?of[\s\S]{0,40}?([\d.,]+)[\s\S]{0,80}?subsidiaries/i,
      ]) ?? pickFirst([/([\d.,]+)\s*SUBSIDIARIES/i], html);

    const vehicles =
      pickFactNumber(html, [
        /more[\s\S]{0,40}?than[\s\S]{0,40}?([\d.,]+)[\s\S]{0,80}?vehicles/i,
        /we[\s\S]{0,40}?have[\s\S]{0,40}?more[\s\S]{0,40}?than[\s\S]{0,40}?([\d.,]+)[\s\S]{0,80}?vehicles/i,
      ]) ?? pickFirst([/([\d.,]+)\s*VEHICLES/i], html);

    const vessels =
      pickFactNumber(html, [
        /comprised[\s\S]{0,140}?vessels/i, // number may be above; fallback below
        /([\d.,]+)[\s\S]{0,80}?vessels/i,
      ]) ?? pickFirst([/([\d.,]+)\s*VESSELS/i], html);

    // Contacts (best-effort; may change on website).
    const phoneInland = pickLiteral([/\+62\d[\d-]+\s*\(Inland\s*&\s*Logistic\s*Services\)/i], html);
    const phoneOcean = pickLiteral([/\+62\d[\d-]+\s*\(Ocean\s*Transportation\)/i], html);
    const emailSales = pickLiteral([/sales@pancaran-group\.co\.id/i], html);
    const emailShipping = pickLiteral([/shipping@pancaran-group\.co\.id/i], html);
    const emailTam = pickLiteral([/tam@pancaran-group\.co\.id/i], html);

    const facts: PancaranSummary['facts'] = [
      crews
        ? { label: 'Crews / Operators / Drivers', value: crews, note: 'Over' }
        : { label: 'Crews / Operators / Drivers', value: '—' },
      subsidiaries ? { label: 'Subsidiaries', value: subsidiaries } : { label: 'Subsidiaries', value: '—' },
      vehicles ? { label: 'Vehicles', value: vehicles } : { label: 'Vehicles', value: '—' },
      vessels ? { label: 'Vessels', value: vessels } : { label: 'Vessels', value: '—' },
    ];

    const contacts: PancaranSummary['contacts'] = [
      ...(phoneInland ? [{ label: 'Phone (Inland & Logistic)', value: phoneInland }] : []),
      ...(phoneOcean ? [{ label: 'Phone (Ocean Transportation)', value: phoneOcean }] : []),
      ...(emailSales ? [{ label: 'Email (Sales)', value: emailSales }] : []),
      ...(emailShipping ? [{ label: 'Email (Shipping)', value: emailShipping }] : []),
      ...(emailTam ? [{ label: 'Email (Renewables)', value: emailTam }] : []),
    ];

    const business = ['Renewable Energy', 'Mining & Trading', 'Inland Transport', 'Sea Transport', 'Shipyard'];

    const payload: PancaranSummary = {
      source,
      updatedAt,
      facts,
      contacts,
      business,
    };

    return Response.json(payload);
  } catch (e) {
    const payload: PancaranSummary = {
      source,
      updatedAt: new Date().toISOString(),
      facts: [
        { label: 'Crews / Operators / Drivers', value: '—' },
        { label: 'Subsidiaries', value: '—' },
        { label: 'Vehicles', value: '—' },
        { label: 'Vessels', value: '—' },
      ],
      contacts: [],
      business: ['Renewable Energy', 'Mining & Trading', 'Inland Transport', 'Sea Transport', 'Shipyard'],
    };
    return Response.json(payload, { status: 200 });
  }
}

