const fs = require('fs');
const path = require('path');

const PILOTS = [
  { cid: 844904,  callsign: 'FAG-124' },
  { cid: 1575754, callsign: 'FAG-211' },
  { cid: 1562806, callsign: 'FAG-212' },
  { cid: 1462350, callsign: 'FAG-213' },
  { cid: 1666659, callsign: 'FAG-218' },
  { cid: 0,        callsign: 'FAG-222' },
  { cid: 1665183, callsign: 'FAG-228' },
  { cid: 1665608, callsign: 'FAG-229' },
  { cid: 1502178, callsign: 'FAG-230' },
  { cid: 1712199, callsign: 'FAG-236' },
  { cid: 1500943, callsign: 'FAG-238' },
  { cid: 1764792, callsign: 'FAG-242' },
  { cid: 1282428, callsign: 'FAG-246' },
  { cid: 1831103, callsign: 'FAG-250' },
  { cid: 1835877, callsign: 'FAG-251' },
  { cid: 1974289, callsign: 'FAG-252' },
  { cid: 1910520, callsign: 'FAG-254' },
  { cid: 2005108, callsign: 'FAG-255' },
  { cid: 1785540, callsign: 'FAG-256' },
];

const BASE = 'https://api.vatsim.net/v2/members';
const OUT_PATH = path.join(__dirname, '..', 'data', 'stats.json');

// Load existing stats
let statsData = {};
try { statsData = JSON.parse(fs.readFileSync(OUT_PATH, 'utf8')); } catch(e) {}

function computeStats(historyResult, fpsRaw) {
  const sessions = (historyResult && historyResult.items) || [];
  const fps = Array.isArray(fpsRaw) ? fpsRaw : [];
  let totalMinutes = 0;
  for (const s of sessions) {
    if (s.start && s.end) {
      const d = new Date(s.end) - new Date(s.start);
      if (d > 0) totalMinutes += d / 60000;
    }
  }
  const hrs = Math.floor(totalMinutes / 60);
  const mins = Math.round(totalMinutes % 60);
  const hoursStr = hrs + 'h ' + mins + 'm';

  const lastSession = sessions.length > 0 ? sessions[0] : null;
  let lastStr = '—', lastDetailStr = '';
  if (lastSession) {
    const lastDate = new Date(lastSession.start);
    lastStr = lastSession.callsign + ' · ' + lastDate.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
    let lastFp = null, lastFpTime = 0;
    for (const fp of fps) {
      if (fp.connection_id === lastSession.id) {
        const t = new Date(fp.filed).getTime();
        if (t > lastFpTime) { lastFp = fp; lastFpTime = t; }
      }
    }
    if (!lastFp) {
      for (const fp of fps) {
        if (!fp.connection_id || !fp.filed) continue;
        const t = new Date(fp.filed).getTime();
        if (t > lastFpTime && t <= new Date(lastSession.end).getTime() + 3600000 && t >= new Date(lastSession.start).getTime() - 3600000) {
          lastFp = fp; lastFpTime = t;
        }
      }
    }
    if (lastFp) {
      const acShort = (lastFp.aircraft || '').split('/')[0] || lastFp.aircraft;
      lastDetailStr = '<span style="color:var(--blue-light);font-weight:400;">' + (lastFp.dep || '??') + '</span> <span style="color:var(--muted);font-size:10px;">→</span> <span style="color:var(--blue-light);font-weight:400;">' + (lastFp.arr || '??') + '</span> <span style="color:var(--muted);font-size:10px;">·</span> <span style="color:var(--blue-light);font-weight:400;">' + acShort + '</span>';
    }
  }

  const airportCount = {}, aircraftCount = {};
  const seenConn = {};
  for (const fp of fps) {
    if (!fp.connection_id) continue;
    const cid = fp.connection_id;
    if (seenConn[cid] && seenConn[cid] > new Date(fp.filed).getTime()) continue;
    seenConn[cid] = new Date(fp.filed).getTime();
    if (fp.dep) airportCount[fp.dep] = (airportCount[fp.dep] || 0) + 1;
    if (fp.arr) airportCount[fp.arr] = (airportCount[fp.arr] || 0) + 1;
    const ac = (fp.aircraft || '').split('/')[0] || fp.aircraft;
    if (ac) aircraftCount[ac] = (aircraftCount[ac] || 0) + 1;
  }

  const fpByConn = {};
  for (const fp of fps) {
    if (!fp.connection_id) continue;
    const t = new Date(fp.filed).getTime();
    if (!fpByConn[fp.connection_id] || t > fpByConn[fp.connection_id]._time) {
      fpByConn[fp.connection_id] = fp;
      fpByConn[fp.connection_id]._time = t;
    }
  }

  const lastFlights = [];
  const maxSessions = Math.min(sessions.length, 10);
  for (let i = 0; i < maxSessions; i++) {
    const s = sessions[i];
    let fp = fpByConn[s.id] || null;
    if (!fp) {
      let best = null, bestT = 0;
      for (const f of fps) {
        if (!f.connection_id || !f.filed) continue;
        const t = new Date(f.filed).getTime();
        if (t > bestT && t <= new Date(s.end).getTime() + 3600000 && t >= new Date(s.start).getTime() - 3600000) {
          best = f; bestT = t;
        }
      }
      fp = best;
    }
    const ac = fp ? ((fp.aircraft || '').split('/')[0] || fp.aircraft) : '—';
    const route = fp ? ((fp.dep || '??') + ' → ' + (fp.arr || '??')) : '—';
    const d = new Date(s.start);
    lastFlights.push({
      callsign: s.callsign || '—',
      aircraft: ac,
      route: route,
      date: d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
    });
  }

  // Deduplicate lastFlights by callsign+aircraft+route+date
  var seen = {};
  var deduped = [];
  for (var f of lastFlights) {
    var key = f.callsign + '|' + f.aircraft + '|' + f.route + '|' + f.date;
    if (!seen[key]) { seen[key] = true; deduped.push(f); }
  }

  return {
    hours: hoursStr,
    last: lastStr,
    lastDetail: lastDetailStr,
    airport: Object.keys(airportCount).sort((a, b) => airportCount[b] - airportCount[a])[0] || '—',
    aircraft: Object.keys(aircraftCount).sort((a, b) => aircraftCount[b] - aircraftCount[a])[0] || '—',
    lastFlights: deduped.slice(0, 10)
  };
}

async function fetchWithRetry(url, retries) {
  if (retries === undefined) retries = 6;
  for (let i = 0; i < retries; i++) {
    try {
      const r = await fetch(url);
      if (r.ok) return r.json();
      if (r.status === 429) {
        var wait = (i + 1) * 10000;
        process.stdout.write('429, esperando ' + wait + 'ms... ');
        await new Promise(function(r){ setTimeout(r, wait); });
        continue;
      }
      throw new Error('HTTP ' + r.status);
    } catch (e) {
      if (e.message && e.message.startsWith('HTTP 429')) continue;
      throw e;
    }
  }
  throw new Error('HTTP 429');
}

async function fetchPilot(cid) {
  if (!cid) return null;
  const history = await fetchWithRetry(BASE + '/' + cid + '/history?limit=2000');
  await new Promise(function(r){ setTimeout(r, 4000); });
  const fps = await fetchWithRetry(BASE + '/' + cid + '/flightplans?limit=2000');
  return computeStats(history, fps);
}

async function main() {
  var pending = PILOTS.filter(function(p){ return p.cid && !statsData[p.cid]; });
  console.log('Already have: ' + Object.keys(statsData).length + ' pilots');
  console.log('Pending: ' + pending.length + ' pilots\n');
  if(pending.length > 0){
    console.log('Waiting 45s for rate limit...');
    await new Promise(function(r){ setTimeout(r, 45000); });
  }
  var ok = 0, fail = 0;
  for (const p of pending) {
    process.stdout.write('  ' + p.callsign + ' (CID ' + p.cid + ')... ');
    try {
      const stats = await fetchPilot(p.cid);
      statsData[p.cid] = stats;
      fs.writeFileSync(OUT_PATH, JSON.stringify(statsData, null, 2));
      console.log('OK (' + stats.hours + ')');
      ok++;
    } catch (e) {
      console.log('FAILED (' + e.message + ')');
      fail++;
    }
    await new Promise(function(r){ setTimeout(r, 8000); });
  }
  console.log('\nDone: ' + ok + ' OK, ' + fail + ' failed');
  console.log('Total in stats.json: ' + Object.keys(statsData).length);
}

main();
