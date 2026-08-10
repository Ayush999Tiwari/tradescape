import { LIMITS, TRADES } from "./data";
import { fmt, fmtPct, getStats, getRisk, getEquityPoints } from "./utils";
const Card = ({ children, className = "" }: any) => (
  <div className={`rounded-2xl bg-white p-5 shadow-sm border border-[#E8E2D9] ${className}`}>{children}</div>
);
const Label = ({ children }: any) => <p className="text-[11px] uppercase tracking-wider text-[#8A8275] font-semibold">{children}</p>;
const badgeColor: any = { Safe: "bg-emerald-100 text-emerald-800", "Approaching Limit": "bg-amber-100 text-amber-800", "At Risk": "bg-red-100 text-red-800" };
const barColor: any = { Safe: "bg-emerald-500", "Approaching Limit": "bg-amber-500", "At Risk": "bg-red-500" };
export default function App() {
  const stats = getStats(TRADES, LIMITS.start);
  const risk = getRisk(TRADES, LIMITS.start, LIMITS.maxDD, LIMITS.dailyLoss);
  const points = getEquityPoints(TRADES, LIMITS.start);
  const W = 600, H = 200, pad = 20;
  const min = Math.min(...points.map((p: any) => p.balance)) - 500;
  const max = Math.max(...points.map((p: any) => p.balance)) + 500;
  const x = (i: number) => pad + (i * (W - pad * 2)) / (points.length - 1);
  const y = (v: number) => H - pad - ((v - min) / (max - min)) * (H - pad * 2);
  const line = points.map((p: any, i: number) => `${x(i)},${y(p.balance)}`).join(" ");
  const isUp = points[points.length - 1].balance >= LIMITS.start;
  const color = isUp ? "#059669" : "#DC2626";
  return (
    <main className="min-h-screen bg-[#F5F2EB] text-[#2C2A26] p-4 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#2C2A26]">Trader Risk Dashboard</h1>
            <p className="text-sm text-[#8A8275] mt-1">Evaluation Account Overview</p>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider w-fit ${badgeColor[risk.overall]}`}>
            {risk.overall}
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><Label>Starting Balance</Label><p className="text-xl font-bold mt-1">{fmt(LIMITS.start)}</p></Card>
          <Card><Label>Current Balance</Label><p className={`text-xl font-bold mt-1 ${stats.currentBalance >= LIMITS.start ? "text-emerald-700" : "text-red-700"}`}>{fmt(stats.currentBalance)}</p></Card>
          <Card><Label>Max Drawdown</Label><p className="text-xl font-bold mt-1">{fmt(LIMITS.maxDD)}</p></Card>
          <Card><Label>Daily Loss Limit</Label><p className="text-xl font-bold mt-1">{fmt(LIMITS.dailyLoss)}</p></Card>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="space-y-5">
            <h3 className="font-serif text-lg font-semibold border-b border-[#E8E2D9] pb-2">Risk Indicator</h3>
            <div>
              <div className="flex justify-between text-sm mb-1"><span>Current Drawdown</span><span className="font-bold">{fmt(risk.currentDD)}</span></div>
              <div className="h-2 bg-[#E8E2D9] rounded-full overflow-hidden"><div className={`h-full ${barColor[risk.ddStatus]}`} style={{ width: `${Math.min(100, (risk.currentDD / LIMITS.maxDD) * 100)}%` }} /></div>
              <p className="text-xs text-[#8A8275] mt-1">Remaining: {fmt(risk.remainingDD)}</p>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1"><span>Current Day Loss</span><span className="font-bold">{fmt(risk.dayLoss)}</span></div>
              <div className="h-2 bg-[#E8E2D9] rounded-full overflow-hidden"><div className={`h-full ${barColor[risk.dayStatus]}`} style={{ width: `${Math.min(100, (risk.dayLoss / LIMITS.dailyLoss) * 100)}%` }} /></div>
              <p className="text-xs text-[#8A8275] mt-1">Remaining: {fmt(risk.remainingDay)}</p>
            </div>
          </Card>
          <Card className="space-y-4">
            <h3 className="font-serif text-lg font-semibold border-b border-[#E8E2D9] pb-2">Trading Performance</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><Label>Total P&L</Label><p className={`font-bold text-lg ${stats.totalPnl >= 0 ? "text-emerald-700" : "text-red-700"}`}>{fmt(stats.totalPnl)}</p></div>
              <div><Label>Win Rate</Label><p className="font-bold text-lg">{fmtPct(stats.winRate)}</p></div>
              <div><Label>Winning Trades</Label><p className="font-bold text-lg text-emerald-700">{stats.wins}</p></div>
              <div><Label>Losing Trades</Label><p className="font-bold text-lg text-red-700">{stats.losses}</p></div>
              <div><Label>Largest Win</Label><p className="font-bold text-lg text-emerald-700">{fmt(stats.largestWin)}</p></div>
              <div><Label>Largest Loss</Label><p className="font-bold text-lg text-red-700">{fmt(stats.largestLoss)}</p></div>
            </div>
          </Card>
        </div>
        <Card>
          <h3 className="font-serif text-lg font-semibold mb-4">Equity Curve <span className="text-xs font-sans font-normal text-[#8A8275] ml-2">(Additional Feature: Visualizes account growth trade-by-trade)</span></h3>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
            <line x1={pad} x2={W - pad} y1={y(LIMITS.start)} y2={y(LIMITS.start)} stroke="#B98A5E" strokeDasharray="4 4" />
            <text x={W - pad} y={y(LIMITS.start) - 6} textAnchor="end" fontSize="10" fill="#B98A5E">Start: {fmt(LIMITS.start)}</text>
            <polygon points={`${pad},${H - pad} ${line} ${W - pad},${H - pad}`} fill={color} opacity="0.1" />
            <polyline points={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            {points.map((p: any, i: number) => (
              <g key={i}>
                <circle cx={x(i)} cy={y(p.balance)} r="4" fill="white" stroke={color} strokeWidth="2">
                  <title>{`Balance: ${fmt(p.balance)}`}</title>
                </circle>
                <text x={x(i)} y={y(p.balance) - 10} textAnchor="middle" fontSize="10" fontWeight="600" fill="#2C2A26">{fmt(p.balance)}</text>
                <text x={x(i)} y={H - 4} textAnchor="middle" fontSize="10" fill="#8A8275">{p.label}</text>
              </g>
            ))}
          </svg>
        </Card>
        <Card className="p-0 overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#F0EBE3] text-[#8A8275] uppercase text-xs tracking-wider">
              <tr><th className="px-5 py-3">Asset</th><th className="px-5 py-3">Side</th><th className="px-5 py-3">Date</th><th className="px-5 py-3 text-right">P&L</th></tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {TRADES.map((t) => (
                <tr key={t.id} className="hover:bg-[#FAF8F5] transition">
                  <td className="px-5 py-3 font-semibold">{t.asset}</td>
                  <td className="px-5 py-3">{t.side}</td>
                  <td className="px-5 py-3 text-[#8A8275]">{t.date}</td>
                  <td className={`px-5 py-3 text-right font-bold ${t.pnl >= 0 ? "text-emerald-700" : "text-red-700"}`}>{fmt(t.pnl)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </main>
  );
}