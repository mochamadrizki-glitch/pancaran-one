'use client';
// CREATE: src/components/DocumentViewer.tsx

import { FileText, Printer, X, TrendingUp, AlertTriangle, CheckCircle, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts';

interface Doc {
  id: string;
  document_type: string;
  title: string;
  content: any;
  status: string;
  created_at: string;
}
interface Props { doc: Doc; onClose: () => void; }

// ─── Markdown renderer ─────────────────────────────────────
function md(text: string) {
  return String(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
}

// ─── CHART: Feasibility Gauge ──────────────────────────────
function FeasibilityGauge({ score }: { score: number }) {
  const color = score >= 7 ? '#10b981' : score >= 5 ? '#f59e0b' : '#ef4444';
  const label = score >= 7 ? 'LAYAK' : score >= 5 ? 'PERTIMBANGKAN' : 'BERISIKO TINGGI';
  const data = [
    { name: 'score', value: score, fill: color },
    { name: 'rest', value: 10 - score, fill: '#f1f5f9' },
  ];
  return (
    <div className="flex items-center gap-6 p-5 rounded-2xl border border-slate-200 bg-slate-50 my-3">
      <div style={{ width: 120, height: 120 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={35} outerRadius={55} startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
              {data.map((_, i) => <Cell key={i} fill={data[i].fill} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div>
        <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Feasibility Score</p>
        <p className="text-5xl font-black" style={{ color }}>{score}<span className="text-2xl text-slate-400">/10</span></p>
        <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: color }}>{label}</span>
      </div>
    </div>
  );
}

// ─── CHART: Risk Distribution Pie ─────────────────────────
function RiskPieChart({ risks }: { risks: any[] }) {
  const counts = { high: 0, medium: 0, low: 0 };
  risks.forEach(r => {
    const lvl = (r.level || r.severity || '').toLowerCase();
    if (lvl.includes('high') || lvl.includes('tinggi')) counts.high++;
    else if (lvl.includes('medium') || lvl.includes('sedang')) counts.medium++;
    else counts.low++;
  });
  const data = [
    { name: 'High', value: counts.high, color: '#ef4444' },
    { name: 'Medium', value: counts.medium, color: '#f59e0b' },
    { name: 'Low', value: counts.low, color: '#10b981' },
  ].filter(d => d.value > 0);

  if (data.length === 0) return null;

  return (
    <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <BarChart3 className="w-3.5 h-3.5" /> Distribusi Risiko
      </p>
      <div className="flex items-center gap-4">
        <div style={{ width: 120, height: 120 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" outerRadius={55} dataKey="value" strokeWidth={2} stroke="#fff">
                {data.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-2">
          {data.map(d => (
            <div key={d.name} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: d.color }} />
              <span className="text-sm font-semibold text-slate-700">{d.name}</span>
              <span className="text-sm font-black" style={{ color: d.color }}>{d.value}</span>
            </div>
          ))}
          <p className="text-xs text-slate-400 pt-1">Total: {risks.length} risiko</p>
        </div>
      </div>
    </div>
  );
}

// ─── CHART: Risk Cards with severity bar ──────────────────
function RiskCards({ risks }: { risks: any[] }) {
  const getColor = (level: string) => {
    const l = level.toLowerCase();
    if (l.includes('high') || l.includes('tinggi')) return { bg: '#fef2f2', border: '#fecaca', text: '#dc2626', badge: '#ef4444' };
    if (l.includes('medium') || l.includes('sedang')) return { bg: '#fffbeb', border: '#fde68a', text: '#d97706', badge: '#f59e0b' };
    return { bg: '#f0fdf4', border: '#bbf7d0', text: '#15803d', badge: '#10b981' };
  };

  return (
    <div className="space-y-3 mt-2">
      {risks.map((r, i) => {
        const level = r.level || r.severity || r.tingkat || 'medium';
        const c = getColor(level);
        const desc = r.description || r.deskripsi || r.risk || r.risiko || r.name || '';
        const mitigation = r.mitigation || r.mitigasi || r.action || '';
        return (
          <div key={i} className="rounded-xl p-4 border" style={{ background: c.bg, borderColor: c.border }}>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-start gap-2 flex-1">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: c.badge }} />
                <p className="text-sm font-bold text-slate-800" dangerouslySetInnerHTML={{ __html: md(desc) }} />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black text-white flex-shrink-0" style={{ background: c.badge }}>
                {level.toUpperCase()}
              </span>
            </div>
            {mitigation && (
              <div className="flex items-start gap-2 mt-2 pt-2 border-t" style={{ borderColor: c.border }}>
                <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-slate-500" />
                <p className="text-xs text-slate-600" dangerouslySetInnerHTML={{ __html: md(mitigation) }} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── CHART: Action items checklist ────────────────────────
function ActionList({ actions }: { actions: any[] }) {
  return (
    <div className="space-y-2 mt-2">
      {actions.map((a, i) => {
        const text = typeof a === 'string' ? a : a.action || a.description || a.nama || JSON.stringify(a);
        const priority = typeof a === 'object' ? (a.priority || a.prioritas || '') : '';
        return (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-[10px] font-black">{i + 1}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-700" dangerouslySetInnerHTML={{ __html: md(text) }} />
              {priority && <span className="text-[10px] text-blue-500 font-semibold mt-0.5 block">{priority}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── CHART: Financial bar chart ───────────────────────────
function FinancialChart({ data }: { data: Record<string, any> }) {
  const entries = Object.entries(data).filter(([, v]) => typeof v === 'number' || (typeof v === 'string' && v.match(/[\d,.]+/)));
  if (entries.length < 2) return null;

  const chartData = entries.slice(0, 6).map(([k, v]) => {
    const num = typeof v === 'number' ? v : parseFloat(String(v).replace(/[^0-9.]/g, ''));
    return { name: k.replace(/_/g, ' '), value: isNaN(num) ? 0 : num };
  }).filter(d => d.value > 0);

  if (chartData.length < 2) return null;

  return (
    <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Perbandingan Finansial</p>
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 20 }}>
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} angle={-15} textAnchor="end" />
          <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
          <Tooltip formatter={(v: any) => `Rp ${Number(v).toLocaleString('id-ID')}`} />
          <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Smart Section Renderer ────────────────────────────────
function SmartSection({ sectionKey, value }: { sectionKey: string; value: any }) {
  const key = sectionKey.toLowerCase();

  // Feasibility score → gauge
  if ((key.includes('feasibility') || key.includes('kelayakan')) && typeof value === 'number') {
    return <FeasibilityGauge score={value} />;
  }

  // Risk array → cards + pie
  if ((key.includes('risk') || key.includes('risiko')) && Array.isArray(value) && value.length > 0) {
    return (
      <div>
        <RiskCards risks={value} />
        <RiskPieChart risks={value} />
      </div>
    );
  }

  // Action / recommendation array → checklist
  if ((key.includes('action') || key.includes('recommendation') || key.includes('rekomendasi') || key.includes('next_step') || key.includes('langkah')) && Array.isArray(value) && value.length > 0) {
    return <ActionList actions={value} />;
  }

  // Financial object → bar chart
  if ((key.includes('financial') || key.includes('finansial') || key.includes('budget') || key.includes('cost')) && typeof value === 'object' && !Array.isArray(value)) {
    return (
      <div>
        <RenderValue value={value} depth={0} />
        <FinancialChart data={value} />
      </div>
    );
  }

  // Default
  return <RenderValue value={value} depth={0} />;
}

// ─── Generic JSON Renderer ─────────────────────────────────
function RenderValue({ value, depth = 0 }: { value: any; depth?: number }) {
  if (value === null || value === undefined) return <span className="text-slate-400 italic text-sm">—</span>;

  if (typeof value !== 'object') {
    return <p className="text-slate-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: md(String(value)) }} />;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-slate-400 italic text-sm">—</span>;
    if (value.every(v => typeof v !== 'object')) {
      return (
        <ul className="space-y-1.5 my-1">
          {value.map((v, i) => (
            <li key={i} className="flex gap-2 text-sm text-slate-700">
              <span className="text-blue-500 font-bold mt-0.5 flex-shrink-0">•</span>
              <span dangerouslySetInnerHTML={{ __html: md(String(v)) }} />
            </li>
          ))}
        </ul>
      );
    }
    return (
      <div className="space-y-3 my-2">
        {value.map((item, i) => (
          <div key={i} className="rounded-xl p-4 bg-slate-50 border border-slate-200">
            <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">#{i + 1}</p>
            <RenderValue value={item} depth={depth + 1} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={depth > 0 ? 'pl-4 border-l-2 border-blue-100 space-y-3' : 'space-y-3'}>
      {Object.entries(value).map(([k, v]) => (
        <div key={k}>
          <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1">{k.replace(/_/g, ' ')}</p>
          <RenderValue value={v} depth={depth + 1} />
        </div>
      ))}
    </div>
  );
}

// ─── Export PDF ────────────────────────────────────────────
function printDocument(doc: Doc, content: any) {
  const sections = Object.entries(content).filter(([k]) => !['document_type', 'meta', '_parse_note', 'title'].includes(k));
  function renderHtml(val: any, depth = 0): string {
    if (val === null || val === undefined) return '<span style="color:#94a3b8">—</span>';
    if (typeof val !== 'object') return `<p style="margin:4px 0;color:#334155">${String(val).replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\*(.*?)\*/g,'<em>$1</em>')}</p>`;
    if (Array.isArray(val)) {
      if (val.length === 0) return '—';
      if (val.every(v => typeof v !== 'object')) return `<ul style="margin:6px 0;padding-left:20px">${val.map(v=>`<li style="margin:3px 0;color:#334155">${String(v).replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\*(.*?)\*/g,'<em>$1</em>')}</li>`).join('')}</ul>`;
      return val.map((item,i)=>`<div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px;margin:8px 0"><p style="font-size:10px;color:#94a3b8;font-weight:bold;margin:0 0 6px 0">#${i+1}</p>${renderHtml(item,depth+1)}</div>`).join('');
    }
    return `<div style="padding-left:${depth>0?12:0}px;border-left:${depth>0?'2px solid #dbeafe':'none'};margin:4px 0">${Object.entries(val).map(([k,v])=>`<div style="margin-bottom:10px"><p style="font-size:10px;color:#2563eb;font-weight:bold;text-transform:uppercase;margin:0 0 3px 0">${k.replace(/_/g,' ')}</p>${renderHtml(v,depth+1)}</div>`).join('')}</div>`;
  }
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${doc.title}</title><style>@page{size:A4;margin:20mm 15mm}body{font-family:Arial,sans-serif;color:#1e293b;font-size:12px;line-height:1.6}.header{border-bottom:3px solid #2563eb;padding-bottom:12px;margin-bottom:20px}.doc-type{font-size:10px;color:#2563eb;font-weight:bold;text-transform:uppercase;letter-spacing:1.5px}.doc-title{font-size:20px;font-weight:bold;margin:6px 0 4px}.doc-meta{font-size:10px;color:#64748b;font-style:italic}.section{margin-bottom:18px;page-break-inside:avoid}.section-title{font-size:13px;font-weight:bold;color:#1e293b;padding:4px 0 4px 10px;border-left:3px solid #2563eb;margin-bottom:8px;text-transform:uppercase}.footer{margin-top:40px;padding-top:10px;border-top:1px solid #e2e8f0;font-size:9px;color:#94a3b8;text-align:center}</style></head><body><div class="header"><div class="doc-type">${doc.document_type.replace(/_/g,' ')}</div><div class="doc-title">${doc.title}</div><div class="doc-meta">Generated by HMT Strategic AI Advisor · Pancaran Group · ${new Date(doc.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})}</div></div>${sections.map(([k,v])=>`<div class="section"><div class="section-title">${k.replace(/_/g,' ')}</div><div>${renderHtml(v)}</div></div>`).join('')}<div class="footer">PT Pancaran Group · HMT Division<br/>Your Trust And Sustainable Future, We Care</div><script>window.onload=function(){window.print()}</script></body></html>`;
  const win = window.open('','_blank','width=800,height=900');
  if (win) { win.document.write(html); win.document.close(); }
}

// ─── Section icon mapper ───────────────────────────────────
function getSectionIcon(key: string) {
  const k = key.toLowerCase();
  if (k.includes('executive') || k.includes('summary')) return '📋';
  if (k.includes('risk') || k.includes('risiko')) return '⚠️';
  if (k.includes('financial') || k.includes('finansial') || k.includes('budget')) return '💰';
  if (k.includes('action') || k.includes('recommendation') || k.includes('rekomendasi')) return '✅';
  if (k.includes('market') || k.includes('pasar')) return '📊';
  if (k.includes('operational') || k.includes('operasional')) return '⚙️';
  if (k.includes('team') || k.includes('organization') || k.includes('org')) return '👥';
  if (k.includes('timeline') || k.includes('milestone')) return '📅';
  if (k.includes('appendix') || k.includes('lampiran')) return '📎';
  return '📄';
}

// ─── Main Component ────────────────────────────────────────
export function DocumentViewer({ doc, onClose }: Props) {
  const content = (() => {
    try { return typeof doc.content === 'string' ? JSON.parse(doc.content) : doc.content || {}; }
    catch { return {}; }
  })();

  const sections = Object.entries(content).filter(([k]) => !['document_type', 'meta', '_parse_note', 'title'].includes(k));

  // Extract feasibility score for hero display
  const feasibilityScore = content.feasibility_score || content.feasibility?.score || content.kelayakan_score || null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)' }}>
      <div className="w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col bg-white" style={{ maxHeight: '92vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100" style={{ background: 'linear-gradient(135deg,#1e3a8a,#1d4ed8)' }}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest">{doc.document_type.replace(/_/g, ' ')}</p>
              <h3 className="text-white font-black text-base leading-tight">{doc.title}</h3>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => printDocument(doc, content)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-90 shadow-sm"
              style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
              <Printer className="w-3.5 h-3.5" /> Export PDF
            </button>
            <button onClick={onClose} className="w-9 h-9 rounded-xl hover:bg-white/20 flex items-center justify-center transition-colors">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Hero: feasibility score jika ada */}
        {feasibilityScore !== null && typeof feasibilityScore === 'number' && (
          <div className="px-8 pt-6 pb-0">
            <FeasibilityGauge score={feasibilityScore} />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 bg-white">
          {content.title && (
            <h1 className="text-2xl font-black text-slate-800 mb-6 pb-4 border-b-2 border-blue-500">{content.title}</h1>
          )}

          {sections.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Dokumen kosong</p>
            </div>
          ) : (
            <div className="space-y-8">
              {sections.map(([key, value]) => {
                if (key === 'title') return null;
                const icon = getSectionIcon(key);
                return (
                  <section key={key}>
                    <h2 className="flex items-center gap-2 text-sm font-black text-slate-800 mb-4">
                      <span className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-base flex-shrink-0">{icon}</span>
                      <span className="flex-1 border-b border-slate-200 pb-2">{key.replace(/_/g, ' ').toUpperCase()}</span>
                    </h2>
                    <div className="pl-2">
                      <SmartSection sectionKey={key} value={value} />
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-bold uppercase">{doc.status}</span>
            <span className="text-xs text-slate-400">{new Date(doc.created_at).toLocaleString('id-ID')}</span>
          </div>
          <span className="text-[10px] text-slate-400 italic">Pancaran Group · HMT Strategic AI Advisor</span>
        </div>
      </div>
    </div>
  );
}
