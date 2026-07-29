  const burger = document.getElementById('burger');
  const navlinks = document.getElementById('navlinks');
  burger.addEventListener('click', () => navlinks.classList.toggle('open'));
  navlinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navlinks.classList.remove('open')));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in-view'); io.unobserve(e.target); } });
  }, {threshold:0.15});
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));

  /* ══════════════════════════════════════════════════════════════════
     PUBLICACIONES DE INSTAGRAM — poné las imágenes en img/posts/
     y completá el array con el path y el link al post.
  ══════════════════════════════════════════════════════════════════ */
  var IG_POSTS = [
    { img: '../img/Instagram/1.jpg', link: 'https://www.instagram.com/p/Daoc9PoimSU/' },
    { img: '../img/Instagram/2.jpg', link: 'https://www.instagram.com/p/DZQX2drERKQ/' },
    { img: '../img/Instagram/3.jpg', link: 'https://www.instagram.com/p/DYYRXvWCts3/' },
    { img: '../img/Instagram/4.jpg', link: 'https://www.instagram.com/p/DYNi5GkEVjW/' },
    { img: '../img/Instagram/5.jpg', link: 'https://www.instagram.com/p/DVUJUmNEaXU/' },
  ];

  function renderIG(){
    var grid = document.getElementById('ig-grid');
    if(!grid || IG_POSTS.length === 0) return;
    grid.innerHTML = '';
    IG_POSTS.forEach(function(p){
      var a = document.createElement('a');
      a.className = 'ig-card lockframe';
      a.href = p.link;
      a.target = '_blank';
      a.rel = 'noopener';
      a.innerHTML =
        '<span class="lc-tl"></span><span class="lc-tr"></span><span class="lc-bl"></span><span class="lc-br"></span>' +
        '<div class="ig-img-wrapper">' +
          '<img src="' + p.img + '" alt="Post FAAV" loading="lazy">' +
          '<div class="ig-hover-overlay">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/></svg>' +
            '<span>VER EN INSTAGRAM</span>' +
          '</div>' +
        '</div>';
      grid.appendChild(a);
    });
  }
  renderIG();

  /* ══════════════════════════════════════════════════════════════════
     RASTREADOR DE PILOTOS — agregá acá tu roster (ver instrucciones en
     el HTML, justo arriba de <div id="pilot-grid">).
  ══════════════════════════════════════════════════════════════════ */
 
  var PILOTS = [
  { name: 'Horacio Catalani',   cid: 844904,  callsign: 'FAG-124', indicativo: '"RAPTOR"', brigade: 'VI BAe "Tandil"' },
  { name: 'Julian López',       cid: 1575754, callsign: 'FAG-211', indicativo: '"LITRO"', brigade: 'I BAe "El Palomar"' },
  { name: 'Juan Pablo Gonzalez',cid: 1562806, callsign: 'FAG-212', indicativo: '"CONDOR"', brigade: 'I BAe "El Palomar"' },
  { name: 'Bruno Castañeira',   cid: 1462350, callsign: 'FAG-213', indicativo: '"RAYO"', brigade: 'VI BAe "Tandil"' },
  { name: 'Nicolás Muñoz',      cid: 1666659, callsign: 'FAG-218', indicativo: '"DOGO"', brigade: 'V BAe "Villa Reynolds"' },
  { name: 'Alexis Abreu',       cid: 0,        callsign: 'FAG-222', indicativo: '"LOBO"', brigade: 'VI BAe "Tandil"' },
  { name: 'Emiliano Perisse',   cid: 1665183, callsign: 'FAG-228', indicativo: '"DELTA"', brigade: 'VI BAe "Tandil"' },
  { name: 'Alexis Diaz',        cid: 1665608, callsign: 'FAG-229', indicativo: '"CUERVO"', brigade: 'I BAe "El Palomar"' },
  { name: 'Thiago Panaccia',    cid: 1502178, callsign: 'FAG-230', indicativo: '"DRAGON"', brigade: 'I BAe "El Palomar"' },
  { name: 'Joaquín Quiña',      cid: 1712199, callsign: 'FAG-236', indicativo: '"DAGA"', brigade: 'VI BAe "Tandil"' },
  { name: 'Nicolás Collazo',    cid: 1500943, callsign: 'FAG-238', indicativo: '"CHISPA"', brigade: 'V BAe "Villa Reynolds"' },
  { name: 'Fernando Muller',    cid: 1764792, callsign: 'FAG-242', indicativo: '"BUHO"', brigade: 'III BAe "Reconquista"' },
  { name: 'Agustin Lamotta',    cid: 1282428, callsign: 'FAG-246', indicativo: '"PUMA"', brigade: 'VI BAe "Tandil"' },
  { name: 'Juan Manuel Canovas',cid: 1831103, callsign: 'FAG-250', indicativo: '"LINCE"', brigade: 'VI BAe "Tandil"' },
  { name: 'Emmanuel Dorado',    cid: 1835877, callsign: 'FAG-251', indicativo: '"TERO"', brigade: 'I BAe "El Palomar"' },
  { name: 'Giuseppe Fontana',   cid: 1974289, callsign: 'FAG-252', indicativo: '"ZORRO"', brigade: 'V BAe "Villa Reynolds"' },
  { name: 'Mateo Desocio',      cid: 1910520, callsign: 'FAG-254', indicativo: '"X"', brigade: 'EAM - Esc. Aviación Militar' },
  { name: 'Joel Cornacchione',  cid: 2005108, callsign: 'FAG-255', indicativo: '"CHAJA"', brigade: 'EAM - Esc. Aviación Militar' },
  { name: 'Facundo Benitez',    cid: 1785540, callsign: 'FAG-256', indicativo: '"CHIMANGO"', brigade: 'EAM - Esc. Aviación Militar' },
];

// ═════════════════════════════════════════════════════════════════
// MAPA — estilo VATSIM Radar
// ═════════════════════════════════════════════════════════════════

let map = null;
if(document.getElementById('vatsim-map')){
  map = L.map('vatsim-map', { attributionControl: false }).setView([-34.6, -58.4], 5);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { maxZoom: 19 }).addTo(map);
  map.on('click', clearAllRoutes);
}

let currentMarkers = {};
let previousAltitudes = {};
let routeLayers = {};
let trackHistory = {};
let trackLines = {};
let selectedPilot = null;

// Aeropuertos
let airportsDB = null;
let airportsDBPromise = null;
function loadAirportsDB(){
  if(airportsDBPromise) return airportsDBPromise;
  airportsDBPromise = fetch('https://cdn.jsdelivr.net/gh/mwgg/Airports/airports.json')
    .then(res => res.json())
    .then(data => { airportsDB = data; return data; })
    .catch(() => { airportsDB = {}; return {}; });
  return airportsDBPromise;
}
loadAirportsDB();

function airportDivIcon(code, kind){
  return L.divIcon({
    className: 'vm-airport-marker',
    html: `<div class="vm-apt-dot ${kind === 'arr' ? 'arr' : ''}"></div><div class="vm-apt-code">${code}</div>`,
    iconSize: [0, 0],
    iconAnchor: [4, 4]
  });
}

function findAirport(db, code){
  if(!code || !db) return null;
  if(db[code]) return db[code];
  return Object.values(db).find(a => a.icao === code) || null;
}

// ─── RUTA: volado (dorado) + restante (celeste punteado) + aeropuertos ───
function drawRouteForPilot(cid, fp){
  clearAllRoutes();
  if(!fp) return;
  const depCode = fp.departure;
  const arrCode = fp.arrival;
  if(!depCode && !arrCode) return;

  loadAirportsDB().then(db => {
    const marker = currentMarkers[cid];
    if(!marker) return;
    const curLatLng = marker.getLatLng();
    const dep = depCode ? findAirport(db, depCode) : null;
    const arr = arrCode ? findAirport(db, arrCode) : null;
    const layers = [];

    if(dep){
      // Línea dorada: aeropuerto de salida → posición actual
      layers.push(L.polyline([[dep.lat, dep.lon], curLatLng], { color:'#cc9c5c', weight:3, opacity:0.9 }).addTo(map));
      layers.push(L.marker([dep.lat, dep.lon], { icon: airportDivIcon(depCode, 'dep') }).addTo(map));
    }
    if(arr){
      // Línea celeste punteada: posición actual → aeropuerto de llegada
      layers.push(L.polyline([curLatLng, [arr.lat, arr.lon]], { color:'#7fb8f2', weight:3, opacity:0.85, dashArray:'10 6' }).addTo(map));
      layers.push(L.marker([arr.lat, arr.lon], { icon: airportDivIcon(arrCode, 'arr') }).addTo(map));
    }

    routeLayers[cid] = layers;
    selectedPilot = cid;

    // Encuadrar cámara para ver toda la ruta
    const pts = [curLatLng];
    if(dep) pts.push([dep.lat, dep.lon]);
    if(arr) pts.push([arr.lat, arr.lon]);
    if(pts.length > 1) map.fitBounds(pts, { padding: [80, 80], maxZoom: 8 });
  });
}

function clearAllRoutes(){
  if(!map) return;
  Object.keys(routeLayers).forEach(cid => clearRouteForPilot(cid));
  selectedPilot = null;
}

function clearRouteForPilot(cid){
  if(!map) return;
  if(routeLayers[cid]){
    routeLayers[cid].forEach(layer => map.removeLayer(layer));
    delete routeLayers[cid];
  }
}

// ─── TRACK TRAIL: breadcrumb ───
function updateTrackHistory(cid, lat, lng){
  if(!trackHistory[cid]) trackHistory[cid] = [];
  trackHistory[cid].push([lat, lng]);
  if(trackHistory[cid].length > 40) trackHistory[cid].shift();
}

function drawTrackTrail(cid){
  if(trackLines[cid]) map.removeLayer(trackLines[cid]);
  const pts = trackHistory[cid];
  if(!pts || pts.length < 2) return;
  trackLines[cid] = L.polyline(pts, {
    color: '#cc9c5c', weight: 1.5, opacity: 0.5, dashArray: '3 4', lineCap: 'round'
  }).addTo(map);
}

// ─── SILUETAS DE AERONAVES ───
const FALLBACK_ICONS = {
  f16: `<path d="M2 13.5 L22 13.5 L19 9 Q12 7 5 9 Z M12 4 L13 9 L11 9 Z M8 22 L9 18 L11 18 L10.5 22 Z M13 22 L13.5 18 L15 18 L16 22 Z"/>`,
  a4: `<path d="M2 14 Q12 6 22 14 L20 16 Q12 12 4 16 Z M12 2 L13 8 L11 8 Z M11 22 L12 17.5 L13 22 Z"/>`,
  heli: `<path d="M6 12 Q12 9 18 12 Q12 14 6 12 Z M11 12 L11 18 L9 19 L9 20 L12 19 L15 20 L15 19 L13 18 L13 12 Z M2 12 L8 12 M16 12 L22 12" fill="none" stroke="currentColor" stroke-width="1.2"/>`,
  ga: `<path d="M11 2 L13 2 L13 9 L19 10 L19 12 L13 11 L13 17 L16 18 L16 20 L12 19 L8 20 L8 18 L11 17 L11 11 L5 12 L5 10 L11 9 Z"/>`,
  jet: `<path d="M10 2 L14 2 L14 8 L22 12 L22 14 L14 11 L14 17 L18 19 L18 21 L12 19 L6 21 L6 19 L10 17 L10 11 L2 14 L2 12 L10 8 Z"/>`,
  fighter: `<path d="M7 2 L17 2 L15 8 L22 15 L22 17 L15 13 L14 18 L17 20 L17 22 L12 20 L7 22 L7 20 L10 18 L9 13 L2 17 L2 15 L9 8 Z"/>`,
  milTransport: `<path d="M3 8 Q12 4 21 8 L21 11 L3 11 Z M5 11 L6 19 L10 19 L9 11 Z M14 11 L15 19 L19 19 L20 11 Z M2 11 L2 13 L4 13 L4 11 Z M20 11 L20 13 L22 13 L22 11 Z"/>`,
  c130: `<path d="M1 10 Q12 6 23 10 L23 12 L1 12 Z M4 12 L5 19 L9 19 L8 12 Z M16 12 L15 19 L19 19 L20 12 Z M1 12 L1 14 L3 14 L3 12 Z M21 12 L21 14 L23 14 L23 12 Z M11 5 L13 5 L13 10 L11 10 Z"/>`,
  f18: `<path d="M2 13 L22 13 L19 9 Q12 6 5 9 Z M8 21 L9 18 L12 18 L12 21 Z M16 21 L15 18 L12 18 Z"/>`
};

const SPECIFIC_ICON = {
  F16: 'f16', A4: 'a4', A4AR: 'a4', F18: 'f18', F15: 'f18', F14: 'f18',
  C130: 'c130', C295: 'c130', L100: 'c130', KC130: 'c130', C17: 'c130', C5: 'c130', A400: 'c130',
  H60: 'heli', UH60: 'heli', S70: 'heli', S76: 'heli', B412: 'heli', B212: 'heli',
  CH47: 'heli', A109: 'heli', H125: 'heli', H145: 'heli', R44: 'heli', R22: 'heli',
  C172: 'ga', C152: 'ga', C182: 'ga', PA28: 'ga', PA34: 'ga', SR22: 'ga', DA40: 'ga',
  T6: 'ga', BE36: 'ga'
};

let svgCache = {};

function getFallbackIcon(icaoType){
  if(!icaoType) return FALLBACK_ICONS.jet;
  const t = icaoType.toUpperCase();
  const key = SPECIFIC_ICON[t];
  return key ? FALLBACK_ICONS[key] : FALLBACK_ICONS.jet;
}

function loadAircraftSvg(icaoType, containerEl){
  if(!icaoType || !containerEl) return;
  const t = icaoType.toUpperCase();
  if(svgCache[t] === 'loading' || svgCache[t] === '') return;
  if(svgCache[t]){
    containerEl.innerHTML = svgCache[t];
    return;
  }
  svgCache[t] = 'loading';
  const path = `../icons/aircraft/${t.toLowerCase()}.svg`;
  fetch(path)
    .then(r => { if(!r.ok) throw Error(); return r.text(); })
    .then(svg => {
      const wrap = svg.replace(/^<svg([^>]*)>/,
        '<svg$1 fill="currentColor" style="width:100%;height:100%">');
      svgCache[t] = wrap;
      if(containerEl && containerEl.isConnected) containerEl.innerHTML = svgCache[t];
    })
    .catch(() => { svgCache[t] = ''; });
}

// ─── UPDATE MAP: renderizar todo ───
function updateMap(livePilots) {
  if(!map) return;
  Object.keys(currentMarkers).forEach(cid => {
    map.removeLayer(currentMarkers[cid]);
    delete currentMarkers[cid];
  });

  const bounds = [];

  PILOTS.forEach(p => {
    const live = livePilots ? livePilots.find(lp => String(lp.cid) === String(p.cid)) : null;
    if (!live || !live.latitude || !live.longitude) {
      delete previousAltitudes[p.cid];
      delete trackHistory[p.cid];
      if(trackLines[p.cid]) { map.removeLayer(trackLines[p.cid]); delete trackLines[p.cid]; }
      return;
    }

    const heading = live.heading || 0;
    const onGround = (live.groundspeed || 0) < 40 && (live.altitude || 0) < 1000;
    const icaoType = live.flight_plan && live.flight_plan.aircraft_short ? live.flight_plan.aircraft_short : '';
    const fallbackSvg = getFallbackIcon(icaoType);

    const rotatedIcon = L.divIcon({
      className: 'vatsim-marker',
      html: `
        <div class="vm-plane ${onGround ? 'vm-ground' : ''}" style="transform:rotate(${heading}deg);"><svg viewBox="0 0 24 24" width="28" height="28">${fallbackSvg}</svg></div>
        <div class="vm-label">
          <span class="vm-callsign">${live.callsign}</span>
        </div>`,
      iconSize: [0, 0],
      iconAnchor: [14, 14]
    });

    const marker = L.marker([live.latitude, live.longitude], { icon: rotatedIcon }).addTo(map);
    requestAnimationFrame(function(){ loadAircraftSvg(icaoType, marker.getElement()?.querySelector('.vm-plane')); });

    updateTrackHistory(p.cid, live.latitude, live.longitude);
    drawTrackTrail(p.cid);

    const fp = live.flight_plan;
    const route = fp ? `${fp.departure || '????'} → ${fp.arrival || '????'}` : 'Sin plan de vuelo';
    const aircraft = fp && fp.aircraft_short ? fp.aircraft_short : '—';
    const prevAlt = previousAltitudes[p.cid];
    const altDelta = (typeof prevAlt === 'number') ? (live.altitude || 0) - prevAlt : 0;
    const trend = altDelta > 150 ? '▲' : altDelta < -150 ? '▼' : '—';
    const trendColor = altDelta > 150 ? '#4ade80' : altDelta < -150 ? '#f87171' : '#7c8ba3';
    previousAltitudes[p.cid] = live.altitude || 0;
    const squawk = live.transponder || '----';

    marker.bindPopup(`
      <div class="vm-popup">
        <div class="vm-popup-head vm-popup-roster">
          <b>${live.callsign}</b>
          <span>${p.name} · ${p.indicativo || ''}</span>
        </div>
        <div class="vm-popup-grid">
          <div class="vm-popup-cell"><span>Aeronave</span><b>${aircraft}</b></div>
          <div class="vm-popup-cell"><span>Squawk</span><b>${squawk}</b></div>
          <div class="vm-popup-cell"><span>Ruta</span><b>${route}</b></div>
          <div class="vm-popup-cell"><span>Altitud</span><b>${onGround ? 'Suelo' : Math.round(live.altitude || 0).toLocaleString('es-AR') + ' ft'}</b></div>
          <div class="vm-popup-cell"><span>Velocidad</span><b>${live.groundspeed || 0} kt</b></div>
          <div class="vm-popup-cell"><span>Rumbo</span><b>${Math.round(heading)}°</b></div>
          <div class="vm-popup-cell"><span>Tendencia</span><b style="color:${trendColor}">${trend} ${altDelta > 150 ? 'Subiendo' : altDelta < -150 ? 'Descendiendo' : 'Nivelado'}</b></div>
          <div class="vm-popup-cell"><span>Brigada</span><b>${p.brigade || '—'}</b></div>
        </div>
      </div>`, { className: 'vm-popup-wrap', closeButton: true, maxWidth: 320 });

    marker.on('click', () => drawRouteForPilot(p.cid, fp));
    marker.on('popupclose', clearAllRoutes);

    currentMarkers[p.cid] = marker;
    bounds.push([live.latitude, live.longitude]);
  });

  if (bounds.length > 0) {
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 8 });
  }
}

  function renderPilots(livePilots){
    const grid = document.getElementById('pilot-grid');
    const onlineCountEl = document.getElementById('tracker-online-count');
    const totalCountEl = document.getElementById('tracker-total-count');
    const trackerSection = document.getElementById('pilotos');
    if(!grid) return;

    if(PILOTS.length === 0){
      grid.innerHTML = `<div class="empty-state"><svg><use href="#ic-headset"/></svg><b>Todavía no hay pilotos cargados en el roster</b><p>Agregalos en PILOTS (nombre + CID), dentro del &lt;script&gt; del archivo — ver instrucciones arriba.</p></div>`;
      onlineCountEl.textContent = '0';
      totalCountEl.textContent = 'Roster vacío';
      if(trackerSection) trackerSection.style.display = 'none';
      return;
    }

    let onlineCount = 0;
    grid.innerHTML = '';

    const sorted = [...PILOTS].sort((a, b) => {
      const aOn = livePilots ? livePilots.some(lp => lp.cid === a.cid) : false;
      const bOn = livePilots ? livePilots.some(lp => lp.cid === b.cid) : false;
      if (aOn !== bOn) return aOn ? -1 : 1;
      return (a.callsign || '').localeCompare(b.callsign || '');
    });
    sorted.forEach(p => {
      const live = livePilots ? livePilots.find(lp => lp.cid === p.cid) : null;
      const card = document.createElement('div');
      card.className = live ? 'pilot-card lockframe pilot-online' : 'pilot-card lockframe pilot-offline';
      const corners = '<span class="lc-tl"></span><span class="lc-tr"></span><span class="lc-bl"></span><span class="lc-br"></span>';

      const callsignBadge = p.callsign ? ` <span style="color: #ff9d00; font-weight: bold; font-size: 0.85em;">[${p.callsign}]</span>` : '';
      const subInfo = [
        p.indicativo ? `"${p.indicativo}"` : '',
        p.brigade || ''
      ].filter(Boolean).join(' · ');

      const metaText = subInfo ? `<div style="font-size: 0.75em; opacity: 0.75; margin-top: 2px;">${subInfo}</div>` : '';

      if(live){
        onlineCount++;
        const fp = live.flight_plan;
        const route = fp ? `${fp.departure || '????'} → ${fp.arrival || '????'}` : 'Sin plan de vuelo cargado';
        const aircraft = fp && fp.aircraft_short ? fp.aircraft_short : '—';
        card.innerHTML = `${corners}
          <div class="pilot-top">
            <div>
              <div class="pilot-name">${p.name}${callsignBadge}</div>
              <div class="pilot-cid">CID ${p.cid}</div>
              ${metaText}
            </div>
            <span class="pilot-status online"><span class="dot"></span>En vuelo</span>
          </div>
          <div class="pilot-flight"><b>${live.callsign}</b> · ${aircraft}<br>${route}<br>FL${Math.round((live.altitude||0)/100)} · ${live.groundspeed||0} kt</div>
          <a href="https://stats.vatsim.net/stats/${p.cid}" target="_blank" rel="noopener" class="op-link">Ver historial <svg style="width:13px;height:13px"><use href="#ic-arrow"/></svg></a>`;
      } else {
        card.innerHTML = `${corners}
          <div class="pilot-top">
            <div>
              <div class="pilot-name">${p.name}${callsignBadge}</div>
              <div class="pilot-cid">CID ${p.cid}</div>
              ${metaText}
            </div>
            <span class="pilot-status offline"><span class="dot"></span>Sin conexión</span>
          </div>
          <div class="pilot-flight">No está volando en este momento.</div>
          <a href="https://stats.vatsim.net/stats/${p.cid}" target="_blank" rel="noopener" class="op-link">Ver historial <svg style="width:13px;height:13px"><use href="#ic-arrow"/></svg></a>`;
      }
      grid.appendChild(card);
    });

    onlineCountEl.textContent = onlineCount;
    totalCountEl.textContent = `${PILOTS.length} en el roster · actualizado ${new Date().toLocaleTimeString('es-AR', {hour:'2-digit', minute:'2-digit'})}`;
    if(trackerSection) trackerSection.style.display = onlineCount > 0 ? '' : 'none';
}

  async function refreshPilots(){
    if(PILOTS.length === 0){ renderPilots(null); updateMap(null); return; }
    try{
      const res = await fetch('https://data.vatsim.net/v3/vatsim-data.json');
      const data = await res.json();
      renderPilots(data.pilots || []);
      updateMap(data.pilots || []);
    }catch(err){
      const totalCountEl = document.getElementById('tracker-total-count');
      if(totalCountEl) totalCountEl.textContent = 'No se pudo conectar con VATSIM en este momento — reintentando…';
      renderPilots(null);
      updateMap(null);
    }
  }
  refreshPilots();
  setInterval(refreshPilots, 60000);

/* ══════════════════════════════════════════════════════════════════
   CALENDARIO DE EVENTOS
   - FAAV: agregar con isFAAV: true en FAAV_EVENTS
   - VATSIM ARGENTINA: agregar con isFAAV: false en FAAV_EVENTS
   - EVENTOS VSOA: se cargan automáticamente de la API de VATSIM (división SAM)
═════════════════════════════════════════════════════════════════ */
const FAAV_EVENTS = [
  {
    name: 'FERRY F16 II',
    start: '2026-09-26T22:00:00Z',
    end: '2026-09-03T22:00:00Z',
    airports: ['EKSP', 'SAOC'],
    desc: 'Segundo vuelo ferry de los F-16 de la Fuerza Aerea Argentina.',
    link: '',
    isFAAV: true,
    participating: '',
  },
  {
    name: 'Uruguayan VFR Tour',
    start: '2026-08-30T17:30:00Z',
    end: '2026-08-30T20:30:00Z',
    airports: ['SUAA', 'SUMO', 'SUTB'],
    desc: 'Recorrido VFR por Uruguay. Vuelo visual desde Montevideo pasando por Durazno y Tacuarembó.',
    link: 'https://my.vatsim.net/events/uruguayan-vfr-tour',
    isVSOA: true,
    participating: 'La FAAV estará presente',
  },
  {
    name: 'SABE - SCEL Fly-In',
    start: '2026-08-23T20:00:00Z',
    end: '2026-08-23T23:00:00Z',
    airports: ['SABE', 'SCEL'],
    desc: 'Cruzá los Andes en una de las rutas más impresionantes de Sudamérica. Aeroparque Jorge Newbery (SABE) a Santiago de Chile (SCEL).',
    link: 'https://my.vatsim.net/events/sabe-scel-fly-in',
    isFAAV: false,
    participating: '',
  },
  {
    name: 'SARR Fly-Inn',
    start: '2026-08-09T20:00:00Z',
    end: '2026-08-09T23:00:00Z',
    airports: ['SARI', 'SARE', 'SARF', 'SARC'],
    desc: 'Operación en la FIR Resistencia (SARR). Aeropuerto principal: SARI – Cataratas del Iguazú. Cobertura ATC completa y vistas espectaculares.',
    link: 'https://my.vatsim.net/events/sarr-fly-inn-2',
    isFAAV: false,
    participating: 'La FAAV estará presente',
  },
];

function formatDateART(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('es-AR', { weekday:'short', day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit', timeZone:'America/Argentina/Buenos_Aires' }).toUpperCase();
}

function stripHTML(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

function classifyEvents(vatsimEvents) {
  const faav = [];
  const vsoa = [];
  const argar = [];

  FAAV_EVENTS.forEach(e => {
    if (e.isFAAV) { faav.push({ ...e, isFAAV: true }); }
    else if (e.isVSOA) { vsoa.push({ ...e, isVSOA: true }); }
    else { argar.push({ ...e, isVatsimAR: true }); }
  });

  vatsimEvents.forEach(e => {
    const isSAM = e.organisers && e.organisers.some(o => o.division === 'SAM');
    const card = {
      name: e.name,
      start: e.startTime,
      end: e.endTime,
      airports: (e.airports || []).map(a => a.icao),
      desc: stripHTML(e.shortDescription || ''),
      link: e.link || '',
    };
    if (isSAM) { vsoa.push(card); }
  });

  faav.sort((a, b) => new Date(a.start) - new Date(b.start));
  vsoa.sort((a, b) => new Date(a.start) - new Date(b.start));
  argar.sort((a, b) => new Date(a.start) - new Date(b.start));

  return { faav, vsoa, argar };
}

function renderCalendarEvents(events, containerId) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  if (events.length === 0) {
    grid.innerHTML = '<div class="cal-empty">No hay eventos programados en este momento.</div>';
    return;
  }
  const logoMap = {
    faav: '../img/Logo FAAV/Logo Faav.png',
    vatsim: '../img/Logo Vatsim Argentina/Logo Vatsim Argentina.png',
    vsoa: '../img/Logo VSOA/Logo VSOA.png'
  };
  grid.innerHTML = '';
  events.forEach(e => {
    const card = document.createElement('div');
    card.className = 'cal-card lockframe';
    const airports = (e.airports || []).map(a => '<span>' + a + '</span>').join('');
    const desc = e.desc ? '<div class="cal-desc">' + e.desc + '</div>' : '';
    const orgClass = e.isFAAV ? 'faav' : (e.isVatsimAR ? 'vatsim-ar' : 'vsoa');
    const orgLabel = e.isFAAV ? 'FAAV' : (e.isVatsimAR ? 'VATSIM ARGENTINA' : 'VSOA');
    const logoKey = e.isFAAV ? 'faav' : (e.isVatsimAR ? 'vatsim' : 'vsoa');
    const logoSrc = logoMap[logoKey] || '';
    const logoHtml = logoSrc ? '<img src="' + logoSrc + '" class="cal-logo' + (logoKey === 'vsoa' ? ' cal-logo-lg' : '') + '" alt="' + orgLabel + '">' : '';
    const link = e.link ? '<a href="' + e.link + '" target="_blank" rel="noopener" class="op-link">Ver evento <svg style="width:13px;height:13px"><use href="#ic-arrow"/></svg></a>' : '';
    const badge = e.participating ? '<span class="cal-badge">FAAV PRESENTE</span>' : '';
    const footer = '<div class="cal-footer"><div class="cal-footer-top"><span class="cal-org ' + orgClass + '">' + orgLabel + '</span>' + logoHtml + '</div>' + badge + '<div class="cal-footer-bottom">' + link + '</div></div>';
    card.innerHTML =
      '<span class="lc-tl"></span><span class="lc-tr"></span><span class="lc-bl"></span><span class="lc-br"></span>' +
      '<div class="cal-date"><span class="dot"></span>' + formatDateART(e.start) + '</div>' +
      '<h4>' + e.name + '</h4>' +
      (airports ? '<div class="cal-airports">' + airports + '</div>' : '') +
      desc +
      footer;
    grid.appendChild(card);
  });
}

function initCalendar() {
  const tabs = document.querySelectorAll('.cal-tab');
  const grids = {
    faav: document.getElementById('cal-grid-faav'),
    vsoa: document.getElementById('cal-grid-vsoa'),
    argar: document.getElementById('cal-grid-argar'),
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      tabs.forEach(function(t) { t.classList.remove('active'); });
      tab.classList.add('active');
      const target = tab.dataset.tab;
      Object.keys(grids).forEach(key => {
        grids[key].style.display = key === target ? '' : 'none';
      });
    });
  });

  fetch('https://vatsim.net/api/events')
    .then(function(res) { return res.json(); })
    .then(function(data) {
      const events = data.data || data || [];
      const result = classifyEvents(events);
      renderCalendarEvents(result.faav, 'cal-grid-faav');
      renderCalendarEvents(result.vsoa, 'cal-grid-vsoa');
      renderCalendarEvents(result.argar, 'cal-grid-argar');
    })
    .catch(function() {
      const result = classifyEvents([]);
      renderCalendarEvents(result.faav, 'cal-grid-faav');
      renderCalendarEvents(result.vsoa, 'cal-grid-vsoa');
      renderCalendarEvents(result.argar, 'cal-grid-argar');
    });
}
initCalendar();

/* Drag-to-scroll para brig-row */
document.querySelectorAll('.brig-row').forEach(function(el){
  var isDown = false, startX, scrollLeft;
  el.addEventListener('mousedown', function(e){
    isDown = true;
    el.classList.add('grabbing');
    startX = e.pageX - el.offsetLeft;
    scrollLeft = el.scrollLeft;
  });
  el.addEventListener('mouseleave', function(){
    isDown = false;
    el.classList.remove('grabbing');
  });
  el.addEventListener('mouseup', function(){
    isDown = false;
    el.classList.remove('grabbing');
  });
  el.addEventListener('mousemove', function(e){
    if(!isDown) return;
    e.preventDefault();
    var x = e.pageX - el.offsetLeft;
    var walk = (x - startX) * 1.5;
    el.scrollLeft = scrollLeft - walk;
  });
});

/* ---------- login ---------- */
function handleLogin(e) {
  e.preventDefault();
  var user = document.getElementById('loginUser').value.trim();
  var pass = document.getElementById('loginPass').value;
  var err = document.getElementById('loginError');
  if (user === 'fag212' && pass === 'fag212') {
    localStorage.setItem('faav_pilot', user);
    window.location.href = 'pilotos.html';
  } else {
    err.style.display = 'block';
    document.getElementById('loginPass').value = '';
  }
}
