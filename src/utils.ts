export const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
export const fmtPct = (n: number) => `${(n * 100).toFixed(1)}%`;
export const getStats = (trades: any[], start: number) => {
  const totalPnl = trades.reduce((s, t) => s + t.pnl, 0);
  const wins = trades.filter((t) => t.pnl > 0);
  const losses = trades.filter((t) => t.pnl < 0);
  return {
    currentBalance: start + totalPnl,
    totalPnl,
    wins: wins.length,
    losses: losses.length,
    winRate: trades.length ? wins.length / trades.length : 0,
    largestWin: wins.length ? Math.max(...wins.map((t) => t.pnl)) : 0,
    largestLoss: losses.length ? Math.min(...losses.map((t) => t.pnl)) : 0,
  };
};
export const getRisk = (trades: any[], start: number, maxDD: number, dailyLimit: number) => {
  const stats = getStats(trades, start);
  const peak = Math.max(start, stats.currentBalance); 
  const currentDD = Math.max(0, peak - stats.currentBalance);
  const dayLoss = Math.max(0, -stats.totalPnl); 
  const getStatus = (used: number, limit: number) =>
    used / limit >= 0.8 ? "At Risk" : used / limit >= 0.5 ? "Approaching Limit" : "Safe";
  const ddStatus = getStatus(currentDD, maxDD);
  const dayStatus = getStatus(dayLoss, dailyLimit);
  const overall = ddStatus === "At Risk" || dayStatus === "At Risk" ? "At Risk" :
                  ddStatus === "Approaching Limit" || dayStatus === "Approaching Limit" ? "Approaching Limit" : "Safe";
  return { currentDD, remainingDD: maxDD - currentDD, dayLoss, remainingDay: dailyLimit - dayLoss, ddStatus, dayStatus, overall };
};
export const getEquityPoints = (trades: any[], start: number) => 
  trades.reduce((acc, t) => {
    acc.push({ label: t.date, balance: acc[acc.length - 1].balance + t.pnl });
    return acc;
  }, [{ label: "Start", balance: start }]);