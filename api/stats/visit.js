// Vercel Serverless Function: POST /api/stats/visit
const memoryStats = {
  totalVisitors: 1258,
  visitorsToday: 42,
  predictionsMade: 3840,
  statsDate: new Date().toISOString().slice(0, 10),
};

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const today = new Date().toISOString().slice(0, 10);
  if (memoryStats.statsDate !== today) {
    memoryStats.statsDate = today;
    memoryStats.visitorsToday = 0;
  }

  memoryStats.totalVisitors += 1;
  memoryStats.visitorsToday += 1;

  return res.status(200).json(memoryStats);
}
