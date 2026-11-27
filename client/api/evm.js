// Vercel Serverless Function: /api/evm
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { plannedValue, earnedValue, actualCost, budgetAtCompletion } = req.body;
    const pv = parseFloat(plannedValue) || 0;
    const ev = parseFloat(earnedValue) || 0;
    const ac = parseFloat(actualCost) || 0;
    const bac = parseFloat(budgetAtCompletion) || pv;

    const cv = ev - ac;
    const sv = ev - pv;
    const cpi = ac > 0 ? (ev / ac) : 1;
    const spi = pv > 0 ? (ev / pv) : 1;
    const eac = cpi > 0 ? (bac / cpi) : bac;
    const etc = eac - ac;
    const vac = bac - eac;

    let costStatus = 'ON BUDGET';
    if (cv < 0) costStatus = 'OVER BUDGET';
    else if (cv > 0) costStatus = 'UNDER BUDGET';

    let scheduleStatus = 'ON SCHEDULE';
    if (sv < 0) scheduleStatus = 'BEHIND SCHEDULE';
    else if (sv > 0) scheduleStatus = 'AHEAD OF SCHEDULE';

    res.status(200).json({
      metrics: {
        pv, ev, ac, bac,
        cv: Math.round(cv * 100) / 100,
        sv: Math.round(sv * 100) / 100,
        cpi: Math.round(cpi * 1000) / 1000,
        spi: Math.round(spi * 1000) / 1000,
        eac: Math.round(eac * 100) / 100,
        etc: Math.round(etc * 100) / 100,
        vac: Math.round(vac * 100) / 100
      },
      status: {
        costStatus,
        scheduleStatus,
        criticalNotice: (cpi < 0.85 || spi < 0.85) ? 'CRITICAL DEFICIT: Immediate recovery schedule required.' : 'STABLE: Continue monitoring weekly progress.'
      }
    });
  } catch (error) {
    res.status(400).json({ error: 'Invalid EVM parameters', details: error.message });
  }
};
