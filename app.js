
(function(){
'use strict';

/* ---------- Helpers ---------- */
var DAY = 86400000;
function h(tag, attrs){
  var e = document.createElement(tag);
  if (attrs) for (var k in attrs){
    var v = attrs[k];
    if (v == null || v === false) continue;
    if (k === 'class') e.className = v;
    else if (k === 'text') e.textContent = v;
    else if (k.indexOf('on') === 0) e.addEventListener(k.slice(2), v);
    else if (k === 'value') e.value = v;
    else e.setAttribute(k, v === true ? '' : v);
  }
  for (var i = 2; i < arguments.length; i++) add(e, arguments[i]);
  return e;
}
function add(e, c){
  if (c == null || c === false) return;
  if (Array.isArray(c)) { c.forEach(function(x){ add(e, x); }); return; }
  e.append(c.nodeType ? c : document.createTextNode(String(c)));
}
var NS = 'http://www.w3.org/2000/svg';
function sv(tag, attrs){
  var e = document.createElementNS(NS, tag);
  for (var k in attrs) e.setAttribute(k, attrs[k]);
  for (var i = 2; i < arguments.length; i++) add(e, arguments[i]);
  return e;
}
function pd(s){ var p = s.split('-').map(Number); return Date.UTC(p[0], p[1]-1, p[2]); }
function ds(ms){ var d = new Date(ms); return d.getUTCFullYear()+'-'+String(d.getUTCMonth()+1).padStart(2,'0')+'-'+String(d.getUTCDate()).padStart(2,'0'); }
function todayStr(){ var d = new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); }
function addDays(s, n){ return ds(pd(s) + n*DAY); }
function fmtDate(s, long){ return new Date(pd(s)).toLocaleDateString('en-AU', {timeZone:'UTC', weekday: long ? 'long' : undefined, day:'numeric', month:'short'}); }
function dur(d){ var w = Math.floor(d/7), r = d % 7; return (w ? w+'w ' : '') + r + 'd'; }
function clone(o){ return JSON.parse(JSON.stringify(o)); }
function clamp(n, a, b){ return Math.max(a, Math.min(b, n)); }
var toastT = null;
function toast(msg){ var t = document.getElementById('toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(function(){ t.hidden = true; }, 3200); }

/* ---------- Default program (Block 1) ---------- */
var DEFAULT_PROGRAM = {
  schema: 1,
  id: 'block-1-protect',
  name: 'Block 1 · Protect and restore',
  procedure: 'Right knee patella tendon repair',
  surgeryDate: '2026-11-12',
  blockDays: 42,
  goal: 'Protect the repair, keep the quad switched on, control swelling, and reach 0–90° safely by week 6.',
  romFromDay: 14,
  precautions: [
    'Weight-bearing as tolerated in the Zimmer splint. No knee range of motion until the 2-week review.',
    'Physio to start. Book the hinged knee brace change to coincide with the outpatient appointment.',
    'Analgesia as needed, aspirin daily, and a wound check at 2 weeks, all per the operation report.',
    'Every exercise marked "needs sign-off" stays locked until your surgeon or physio clears it.'
  ],
  brace: [
    {fromDay:0, toDay:14, label:'Locked at 0°', note:'Zimmer splint. Weight-bearing as tolerated. No knee movement.'},
    {fromDay:14, toDay:28, label:'Hinged brace, 0–30°', note:'Changes at the 2-week review.'},
    {fromDay:28, toDay:42, label:'Hinged brace, 0–60°', note:'Two weeks after the first change.'},
    {fromDay:42, toDay:84, label:'Hinged brace, 0–90°', note:'The report reads "90deg 6/62". Confirm with your surgeon that this means 6 weeks.', confirm:true}
  ],
  roadmap: [
    {n:1, name:'Protection', fromDay:0, toDay:14, criteria:['Wound healing, swelling settling.','Quad contraction strong and visible.','Wound check passed at 2 weeks.']},
    {n:2, name:'Early range of motion', fromDay:14, toDay:42, criteria:['Brace opened in steps by your surgeon: 0–30°, then 60°, then 90°.','To leave this phase: 0–90° reached, straight-leg raise with minimal or no lag, swelling trace or less, normal walking pattern.']},
    {n:3, name:'Normalise and load', fromDay:42, toDay:84, criteria:['Brace weaned as your surgeon directs. Walking without aids.','Closed-chain strength within limits. Common guidance avoids full-depth loaded knee bends until about 6 months. Confirm with your surgeon.']},
    {n:4, name:'Strengthen', fromDay:84, toDay:168, criteria:['Progressive strength, balance, jogging when cleared.','Blood flow restriction training may be an option after suture removal if your surgeon agrees.','Agility and sport-specific drills begin around 5 months.']},
    {n:5, name:'Return to sport', fromDay:168, toDay:252, criteria:['Pain under 2/10 at worst.','Quad and hamstring strength above 90% of the other leg, limb symmetry 90% or more.','Unpredictable cutting drills passed. Surgeon and physio sign-off.','Guidelines describe 6 to 8 months. A complex rupture can take longer.']}
  ],
  exercises: [
    {id:'quad-sets', name:'Quad sets (brace locked)', category:'Activation', target:{sessions:5, detail:'10 reps × 5-sec squeeze'}, clearance:'default',
      why:'The quadriceps switches off quickly after knee surgery. Squeezing it without moving the knee keeps the nerve-to-muscle link alive and limits wasting, without loading the repair through bending. This is the muscle that will later load the tendon.',
      feel:'A firm tightening on the front of the thigh and the kneecap gliding slightly upward. Effort about 5 to 6 out of 10.',
      stop:'Sharp or pulling pain at the incision or kneecap, or any change in the wound.',
      metric:'Sessions completed. Note whether you can see and feel the muscle bulge each rep.'},
    {id:'ankle-pumps', name:'Ankle pumps', category:'Circulation', target:{sessions:8, detail:'20 pumps, once an hour while awake'}, clearance:'default',
      why:'The calf muscle pump returns blood to the heart while the leg is protected. It lowers clot risk and helps swelling drain.',
      feel:'A mild working feeling in the calf and shin. Nothing sharp.',
      stop:'Calf pain, tightness, warmth or new swelling in either calf. Call your surgeon or hospital the same day.',
      metric:'Sessions per day.'},
    {id:'glute-squeezes', name:'Glute squeezes', category:'Activation', target:{sessions:3, detail:'10 reps × 5-sec squeeze'}, clearance:'default',
      why:'Keeps the hip extensors working so standing and walking mechanics stay efficient while the knee is locked.',
      feel:'Both buttocks tightening. No movement at the knee.',
      stop:'Back pain or cramping that does not ease when you change position.',
      metric:'Sessions per day.'},
    {id:'upper-core', name:'Seated upper body and core', category:'Upper body', target:{sessions:1, detail:'Bands: rows and presses, 2–3 sets of 12'}, clearance:'default',
      why:'Holds your training habit and upper-body strength while the leg is protected. Tennis and padel both lean on shoulder, trunk and arm strength.',
      feel:'Muscle effort in the back, chest and shoulders. Sit with the operated leg supported straight.',
      stop:'Any pull through the leg or knee. Do not twist on a planted operated leg.',
      metric:'Sets, reps and band colour.'},
    {id:'walks', name:'Short walks in the brace', category:'Gait', target:{sessions:3, detail:'5–10 min, even stride, brace locked'}, clearance:'default',
      why:'Weight-bearing as tolerated is allowed on your report. Walking loads the tendon gently, keeps joints and circulation moving, and rehearses the pattern you need to walk unassisted.',
      feel:'Mild effort and some heaviness in the leg. Aim for equal step lengths without hiking the hip.',
      stop:'Sharp pain at the repair, the knee feeling like it will give way, or swelling clearly worse next morning. Shorten the next walk.',
      metric:'Minutes and number of walks. Note any limp.'},
    {id:'elevate-ice', name:'Elevate and ice', category:'Recovery', target:{sessions:3, detail:'20 min, leg above heart, cloth barrier, dressings dry'}, clearance:'default',
      why:'Controls swelling. Less swelling means less pain and less switching-off of the quad.',
      feel:'Cool, then numb. Heaviness easing.',
      stop:'Skin turning white, blue or blistered, or numbness that does not return.',
      metric:'Sessions per day and the daily swelling rating.'},
    {id:'slr', name:'Straight-leg raise (in brace)', category:'Activation', target:{sessions:3, detail:'3 × 8, slow lift to about 20 cm'}, clearance:'ask',
      why:'Shows whether the quad can lift the leg straight without the knee sagging (extensor lag). This is one of the main milestones for the repair.',
      feel:'The quad stays locked while the whole leg lifts. No bend at the knee.',
      stop:'The knee sags or buckles, sharp kneecap pain, or you cannot hold it straight.',
      metric:'Reps and any lag in degrees, measured by your physio.'},
    {id:'rom-0-30', name:'Brace-limited range work, 0–30°', category:'Mobility', target:{sessions:3, detail:'10 slow reps within the brace stop'}, clearance:'ask', unlockDay:14,
      why:'Controlled early movement helps the tendon heal with organised fibres and stops the knee stiffening. Limits come from your surgeon, never from comfort.',
      feel:'A gentle tightness at the front of the knee. Never sharp.',
      stop:'Pain above 4 out of 10, any pop or give, or going past the brace stop.',
      metric:'Degrees reached (physio-measured) and pain.'},
    {id:'weight-shift', name:'Standing weight shifts', category:'Gait', target:{sessions:2, detail:'2 × 10 side to side, brace on'}, clearance:'ask', unlockDay:14,
      why:'Builds confidence and load tolerance through the repaired leg before walking aids come off.',
      feel:'The leg taking more of your weight and feeling steady. Hold a bench or rail.',
      stop:'The knee gives way, sharp pain, or the leg feels unstable.',
      metric:'Reps, and percentage of body weight on bathroom scales if your physio uses it.'}
  ],
  checkpoints: [
    {id:'cp-2w', atDay:14, title:'2-week review', gate:'Move on to brace-limited movement only when the wound check is passed, resting pain is 4/10 or less, and your surgeon unlocks the brace.',
      items:[
        {id:'wound', label:'Wound check passed', how:'At your surgeon or clinic review.', type:'check'},
        {id:'pain-rest', label:'Resting pain', how:'Average over the last 3 days.', type:'number', unit:'/10', target:{op:'<=', value:4}},
        {id:'quad-vis', label:'Quad contraction strong and visible', how:'Watch the thigh during a quad set.', type:'check'},
        {id:'brace-booked', label:'Hinged brace and physio booked', how:'Booked to coincide with the outpatient visit.', type:'check'}
      ]},
    {id:'cp-4w', atDay:28, title:'4-week check', gate:'Open the brace to the next limit only when the last limit was reached without a pain spike and your surgeon or physio agrees.',
      items:[
        {id:'brace-limit', label:'Reached the brace limit without a pain spike', how:'Pain stays at 4/10 or less during and after.', type:'check'},
        {id:'lag-4w', label:'Extensor lag on straight-leg raise', how:'Measured by your physio.', type:'number', unit:'°', target:{op:'<=', value:5}},
        {id:'swell-4w', label:'Swelling trending down over the past week', how:'Use the daily swelling ratings.', type:'check'}
      ]},
    {id:'cp-6w', atDay:42, title:'6-week check', gate:'Leave this block when you reach 0–90°, lift the straight leg with minimal lag, have trace swelling or less, and walk with a normal pattern.',
      items:[
        {id:'flex-6w', label:'Knee flexion', how:'Measured by your physio.', type:'number', unit:'°', target:{op:'>=', value:90}},
        {id:'lag-6w', label:'Extensor lag on straight-leg raise', how:'Measured by your physio.', type:'number', unit:'°', target:{op:'<=', value:5}},
        {id:'effusion', label:'Swelling trace or less', how:'Physio assessment.', type:'check'},
        {id:'gait', label:'Normal walking pattern, no aids', how:'Even steps, no limp, filmed side-on if you can.', type:'check'},
        {id:'pain-act', label:'Pain during daily activity', how:'Worst episode in the past week.', type:'number', unit:'/10', target:{op:'<=', value:2}}
      ]}
  ],
  redFlags: {
    emergency: ['Chest pain or sudden shortness of breath. Call 000.'],
    urgent: [
      'Calf pain, tightness, warmth or new swelling in either leg.',
      'Fever above 38°C, or chills.',
      'Wound redness spreading, discharge, a smell, or the wound opening.',
      'Pain that keeps rising despite medication.',
      'Foot numbness, coldness, or a colour change.',
      'A sudden pop or giving way, a gap above the kneecap, or being unable to straighten or lift the leg.'
    ]
  }
};

/* ---------- State ---------- */
var S = { program: clone(DEFAULT_PROGRAM), profile: {clear:{}, tests:{}}, logs:{}, blocks:[] };
var ui = { tab:'today', date: todayStr(), openEx:{}, status:'loading', pj:'', pending:null, pendingErr:'', bk:'', confirm:null };
var store = { kind:'local', profileRef:null, logsRef:null, blocksRef:null };
var readyFlags = {p:false, l:false}, readyResolve, ready = new Promise(function(r){ readyResolve = r; });
var pendingWrites = 0, queues = {}, lastSigP = '', timers = {};
var LS_KEY = 'patella-rehab-log:v1';

function markReady(k){ readyFlags[k] = true; if (readyFlags.p && readyFlags.l) readyResolve(); }

function normalizeProgram(p){
  p.exercises = p.exercises || []; p.checkpoints = p.checkpoints || []; p.roadmap = p.roadmap || []; p.brace = p.brace || [];
  p.precautions = p.precautions || []; p.redFlags = p.redFlags || {emergency:[], urgent:[]};
  p.redFlags.emergency = p.redFlags.emergency || []; p.redFlags.urgent = p.redFlags.urgent || [];
  p.exercises.forEach(function(e){ e.target = e.target || {sessions:1, detail:''}; e.clearance = e.clearance || 'default'; });
  return p;
}
function validateProgram(p){
  if (!p || typeof p !== 'object') return 'This is not a program. Paste the JSON object.';
  if (!p.id || typeof p.id !== 'string') return 'Missing "id" (a short unique text, e.g. block-2-strength).';
  if (!p.name) return 'Missing "name".';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(p.surgeryDate || '')) return 'Missing or invalid "surgeryDate" (use YYYY-MM-DD).';
  if (!Array.isArray(p.exercises) || !p.exercises.length) return 'Needs an "exercises" list with at least one exercise.';
  for (var i = 0; i < p.exercises.length; i++){
    var e = p.exercises[i];
    if (!e.id || !e.name) return 'Exercise ' + (i+1) + ' needs an "id" and a "name".';
    if (!e.target || typeof e.target.sessions !== 'number') return 'Exercise "' + e.name + '" needs target.sessions as a number.';
  }
  return null;
}

/* ---------- Persistence ---------- */
function setStatus(s){ ui.status = s; updateChip(); }
function chipInfo(){
  if (ui.status === 'saving') return ['Saving…', ''];
  if (ui.status === 'error') return ['Not saved. Tap to retry', 'bad'];
  if (ui.status === 'slow') return ['Reaching saved data…', 'warn'];
  if (ui.status === 'loading') return ['Loading…', ''];
  return ['Saved on this device', 'ok'];
}
function updateChip(){
  var c = document.getElementById('chip'); if (!c) return;
  var i = chipInfo(); c.textContent = i[0]; c.className = 'chip ' + i[1];
}
function enqueue(key, fn){
  pendingWrites++; setStatus('saving');
  queues[key] = (queues[key] || Promise.resolve()).then(function(){ return ready; }).then(fn).then(function(){
    pendingWrites--; if (!pendingWrites) setStatus('saved');
  }, function(err){
    pendingWrites--; setStatus('error');
    if (err && err.code === 'quota_exceeded') toast('Storage is full. Export a backup, then remove old data.');
    else toast('Could not save. Check your connection.');
  });
  return queues[key];
}
function localSave(){
  try { localStorage.setItem(LS_KEY, JSON.stringify({program:S.program, profile:S.profile, logs:S.logs, blocks:S.blocks})); } catch(e) {}
  return Promise.resolve();
}
function saveProfile(){
  clearTimeout(timers.p);
  timers.p = setTimeout(function(){
    enqueue('p', function(){
      if (store.kind === 'db') return store.profileRef.set(clone({program:S.program, profile:S.profile, v:1, updatedAt:Date.now()}));
      return localSave();
    });
  }, 400);
}
function saveLog(date){
  clearTimeout(timers['l'+date]);
  timers['l'+date] = setTimeout(function(){
    enqueue('l'+date, function(){
      if (store.kind === 'db') return store.logsRef.doc(date).set(clone(S.logs[date]));
      return localSave();
    });
  }, 400);
}
function archiveBlock(rec){
  S.blocks.push(rec);
  return enqueue('b'+rec.id, function(){
    if (store.kind === 'db') return store.blocksRef.doc(rec.id).set(clone(rec));
    return localSave();
  });
}

var renderQueued = false;
function scheduleRender(){
  var a = document.activeElement;
  if (a && (a.tagName === 'TEXTAREA' || a.tagName === 'INPUT') && a.type !== 'range') { renderQueued = true; return; }
  render();
}
document.addEventListener('focusout', function(){ if (renderQueued) setTimeout(function(){ if (renderQueued){ renderQueued = false; render(); } }, 150); });

async function initStore(){
  var db = null, user = null, uid = null;
  try {
    if (window.claude && window.claude.use) {
      db = await window.claude.use('db');
      user = await window.claude.use('user');
      uid = user ? await user.id() : null;
    }
  } catch(e) { db = null; }
  if (db && uid) {
    store.kind = 'db';
    store.profileRef = db.doc('data/users/' + uid + '/profile');
    store.logsRef = store.profileRef.collection('logs');
    store.blocksRef = store.profileRef.collection('blocks');
    var slowT = setTimeout(function(){ if (ui.status === 'loading') setStatus('slow'); }, 10000);
    store.profileRef.onSnapshot(function(snap){
      if (snap.exists && !snap.metadata.hasPendingWrites) {
        var d = clone(snap.data());
        var sig = JSON.stringify([d.program, d.profile]);
        if (sig !== lastSigP) {
          lastSigP = sig;
          if (d.program && !validateProgram(d.program)) S.program = normalizeProgram(d.program);
          S.profile = Object.assign({clear:{}, tests:{}}, d.profile || {});
          S.profile.clear = S.profile.clear || {}; S.profile.tests = S.profile.tests || {};
          scheduleRender();
        }
      }
      if (!snap.metadata.fromCache) { markReady('p'); clearTimeout(slowT); if (ui.status === 'loading' || ui.status === 'slow') setStatus('saved'); }
    }, function(){ markReady('p'); setStatus('error'); });
    store.logsRef.onSnapshot(function(snap){
      var changed = false;
      snap.docs.forEach(function(d){
        if (d.metadata.hasPendingWrites) return;
        var data = clone(d.data()); data.done = data.done || {};
        if (JSON.stringify(S.logs[d.id]) !== JSON.stringify(data)) { S.logs[d.id] = data; changed = true; }
      });
      if (changed) scheduleRender();
      if (!snap.metadata.fromCache) markReady('l');
    }, function(){ markReady('l'); });
    store.blocksRef.limit(50).onSnapshot(function(snap){
      S.blocks = snap.docs.map(function(d){ return clone(d.data()); }).filter(function(b){ return b && b.id; });
      if (ui.tab === 'plan' || ui.tab === 'data') scheduleRender();
    }, function(){});
  } else {
    store.kind = 'local';
    try {
      var raw = localStorage.getItem(LS_KEY);
      if (raw) {
        var d = JSON.parse(raw);
        if (d.program && !validateProgram(d.program)) S.program = normalizeProgram(d.program);
        S.profile = Object.assign({clear:{}, tests:{}}, d.profile || {});
        S.logs = d.logs || {}; S.blocks = d.blocks || [];
      }
    } catch(e) {}
    readyFlags.p = readyFlags.l = true; readyResolve();
    setStatus('saved');
    render();
  }
}

/* ---------- Domain helpers ---------- */
function dayOf(date){ return Math.round((pd(date) - pd(S.program.surgeryDate)) / DAY); }
function getLog(date){ if (!S.logs[date]) S.logs[date] = {done:{}}; if (!S.logs[date].done) S.logs[date].done = {}; return S.logs[date]; }
function patchLog(date, patch){ var L = getLog(date); Object.assign(L, patch); L.blockId = S.program.id; saveLog(date); }
function exState(ex, day){
  var c = S.profile.clear[ex.id];
  var cleared = c !== undefined ? !!c : ex.clearance !== 'ask';
  var timeOpen = !ex.unlockDay || day >= ex.unlockDay;
  return {cleared:cleared, timeOpen:timeOpen, active: cleared && timeOpen};
}
function adherence(date){
  var day = dayOf(date), tot = 0, got = 0, L = S.logs[date];
  S.program.exercises.forEach(function(ex){
    if (!exState(ex, day).active || !(ex.target.sessions > 0)) return;
    tot += ex.target.sessions; got += Math.min(L && L.done ? (L.done[ex.id] || 0) : 0, ex.target.sessions);
  });
  return tot ? got / tot : null;
}
function judge(item, res){
  if (!res || res.value == null || res.value === '') return null;
  if (item.type === 'check') return res.value === true ? 'pass' : 'fail';
  var t = item.target, v = Number(res.value);
  if (!t || isNaN(v)) return null;
  var ok = t.op === '>=' ? v >= t.value : t.op === '<=' ? v <= t.value : t.op === '<' ? v < t.value : t.op === '>' ? v > t.value : v === t.value;
  return ok ? 'pass' : 'fail';
}
function cpProgress(cp){
  var rec = 0, pass = 0;
  cp.items.forEach(function(it){ var r = judge(it, S.profile.tests[it.id]); if (r) rec++; if (r === 'pass') pass++; });
  return {rec:rec, pass:pass, total:cp.items.length};
}
function opText(t){ return t ? ({'>=':'at least ','<=':'no more than ','<':'under ','>':'over ','==':''}[t.op] || '') + t.value : ''; }
function phaseAt(day){ var r = S.program.roadmap, p = null; r.forEach(function(x){ if (day >= x.fromDay && day < x.toDay) p = x; }); return p || r[r.length-1] || null; }
function braceAt(day){ var p = null; S.program.brace.forEach(function(x){ if (day >= x.fromDay && day < x.toDay) p = x; }); return p; }

/* ---------- Views ---------- */
var TABS = [['today','Today'],['plan','Plan'],['checks','Checks'],['trends','Trends'],['data','Data']];

function render(){ renderTop(); renderView(); renderTabs(); }

function renderTabs(){
  var n = document.getElementById('tabs'); n.textContent = '';
  TABS.forEach(function(t){
    n.append(h('button', {text:t[1], 'aria-current': ui.tab === t[0] ? 'page' : null, onclick:function(){ ui.tab = t[0]; render(); window.scrollTo(0,0); }}));
  });
}

function renderTop(){
  var P = S.program, today = todayStr(), day = dayOf(today), ph = phaseAt(day);
  var total = P.roadmap.length ? P.roadmap[P.roadmap.length-1].toDay : 252;
  var tl = h('div', {class:'tl', role:'img', 'aria-label':'Recovery timeline, day ' + day + ' of about ' + total});
  P.roadmap.forEach(function(r){
    var len = r.toDay - r.fromDay, pct = clamp((day - r.fromDay) / len, 0, 1) * 100;
    var seg = h('div', {class:'seg', style:'flex:' + len + ' 1 0'}, h('i', {style:'width:' + pct + '%'}));
    if (day >= r.fromDay && day < r.toDay) seg.append(h('b', {style:'left:calc(' + pct + '% - 1px)'}));
    tl.append(seg);
  });
  var c = chipInfo();
  var top = document.getElementById('top'); top.textContent = '';
  top.append(
    h('div', {class:'toprow'},
      h('div', {class:'eyebrow', text:'Patella rehab log'}),
      h('button', {id:'chip', class:'chip ' + c[1], text:c[0], onclick:function(){ if (ui.status === 'error') { saveProfile(); Object.keys(S.logs).slice(-3).forEach(saveLog); } }})),
    h('div', {class:'dayline'},
      h('div', {class:'day'}, 'DAY ' + day, h('small', {text: dur(day)})),
      h('div', {class:'phase-name'}, ph ? 'Phase ' + ph.n : '', h('span', {text: ph ? ph.name : ''}))),
    tl,
    h('div', {class:'tl-legend'}, h('span', {text:'Surgery ' + fmtDate(P.surgeryDate)}), h('span', {text:'Return to sport window'})));
}

function renderView(){
  var v = document.getElementById('view'); v.textContent = '';
  var fn = {today:viewToday, plan:viewPlan, checks:viewChecks, trends:viewTrends, data:viewData}[ui.tab];
  v.append(fn());
}

/* ----- Today ----- */
function counterCard(ex, date, locked){
  var L = getLog(date), n = L.done[ex.id] || 0, tgt = ex.target.sessions, full = n >= tgt;
  var open = !!ui.openEx[ex.id];
  var info = h('details', {open: open ? true : null, ontoggle:function(e){ ui.openEx[ex.id] = e.target.open; }},
    h('summary', {text:'Why · What you should feel · Stop if'}),
    h('dl', {class:'why'},
      h('div', null, h('dt', {text:'Why it is here'}), h('dd', {text:ex.why || ''})),
      h('div', null, h('dt', {text:'What you should feel'}), h('dd', {text:ex.feel || ''})),
      h('div', {class:'stop'}, h('dt', {text:'Stop if'}), h('dd', {text:ex.stop || ''})),
      h('div', null, h('dt', {text:'What to track'}), h('dd', {text:ex.metric || ''}))));
  var head = h('div', {class:'ex-head'},
    h('div', {class:'grow'}, h('h3', {text:ex.name}), h('p', {class:'meta', text:ex.category + ' · ' + ex.target.detail})),
    locked ? null : h('div', {class:'counter'},
      h('button', {'aria-label':'One fewer ' + ex.name, text:'−', onclick:function(){ setDone(date, ex.id, n-1); }}),
      h('div', {class:'count'}, String(n), h('small', {text:'/' + tgt})),
      h('button', {'aria-label':'One more ' + ex.name, text:'+', onclick:function(){ setDone(date, ex.id, n+1); }})));
  return h('article', {class:'card'}, head,
    locked ? null : h('div', {class:'bar' + (full ? ' full' : '')}, h('i', {style:'width:' + clamp(n / Math.max(tgt,1), 0, 1) * 100 + '%'})),
    (!locked && full) ? h('div', {class:'donetag', text:'Target met'}) : null,
    info);
}
function setDone(date, id, n){ var L = getLog(date); var d = Object.assign({}, L.done); d[id] = clamp(n, 0, 99); patchLog(date, {done:d}); renderView(); }

function viewToday(){
  var P = S.program, date = ui.date, today = todayStr(), day = dayOf(date), L = getLog(date), wrap = h('div', {class:'stack', style:'display:grid;gap:12px'});
  var canPrev = date > P.surgeryDate, canNext = date < today;
  wrap.append(h('div', {class:'card'}, h('div', {class:'datebar'},
    h('button', {class:'btn small', text:'‹ Prev', disabled: canPrev ? null : true, onclick:function(){ ui.date = addDays(date, -1); render(); }}),
    h('div', {class:'lbl'}, date === today ? 'Today · ' + fmtDate(date) : fmtDate(date, true), h('div', {class:'meta', text:'Day ' + day + ' after surgery'})),
    h('button', {class:'btn small', text:'Next ›', disabled: canNext ? null : true, onclick:function(){ ui.date = addDays(date, 1); render(); }}))));

  // Brace + next checkpoint
  var b = braceAt(day), nextB = P.brace.filter(function(x){ return x.fromDay > day; })[0];
  var cps = P.checkpoints.filter(function(c){ var p = cpProgress(c); return p.rec < p.total; })[0];
  var status = h('div', {class:'card'},
    h('div', {class:'row', style:'justify-content:space-between'},
      h('div', {class:'eyebrow', text:'Brace now'}),
      h('button', {class:'btn small', text:'Red flags', onclick:openFlags})),
    h('h2', {style:'margin-top:6px', text: b ? b.label : 'Per your surgeon'}),
    b ? h('p', {class:'sub', text:b.note}) : null,
    nextB ? h('p', {class:'sub', text:'Next change: ' + nextB.label + ' from ' + fmtDate(addDays(P.surgeryDate, nextB.fromDay)) + ' (in ' + (nextB.fromDay - day) + ' days), if your surgeon confirms.'}) : null,
    cps ? h('p', {class:'sub', style:'margin-top:8px', text:'Next checkpoint: ' + cps.title + ', ' + fmtDate(addDays(P.surgeryDate, cps.atDay)) + '. ' + cpProgress(cps).rec + ' of ' + cps.items.length + ' recorded.'}) : null);
  wrap.append(status);

  // Check-in
  var painOut = h('output', {text: L.pain == null ? '–' : String(L.pain)});
  var acheOut = h('output', {text: L.ache == null ? '–' : String(L.ache)});
  var checkin = h('section', {class:'card', style:'display:grid;gap:16px'},
    h('h2', {text:'Daily check-in'}),
    h('div', null, h('div', {class:'fieldlabel'}, h('label', {for:'pain', text:'Knee pain (0–10)'}), painOut),
      h('input', {id:'pain', type:'range', min:'0', max:'10', step:'1', value: L.pain == null ? 0 : L.pain, oninput:function(e){ var v = Number(e.target.value); painOut.textContent = v; patchLog(date, {pain:v}); }}),
      h('div', {class:'scale'}, h('span', {text:'0 none'}), h('span', {text:'5'}), h('span', {text:'10 worst'}))),
    h('div', null, h('div', {class:'fieldlabel'}, h('label', {for:'ache', text:'Other ache, hip or back (0–10)'}), acheOut),
      h('input', {id:'ache', type:'range', min:'0', max:'10', step:'1', value: L.ache == null ? 0 : L.ache, oninput:function(e){ var v = Number(e.target.value); acheOut.textContent = v; patchLog(date, {ache:v}); }})),
    h('div', null, h('div', {class:'fieldlabel', text:'Swelling compared with yesterday'}),
      seg3([['Less',-1],['Same',0],['More',1]], L.swell, function(v){ patchLog(date, {swell:v}); renderView(); })),
    h('div', null, h('div', {class:'fieldlabel', text:'Wore the brace as prescribed'}),
      seg3([['Yes',true],['No',false]], L.brace, function(v){ patchLog(date, {brace:v}); renderView(); })),
    day >= (P.romFromDay || 14) ? h('div', {class:'field'}, h('label', {class:'fieldlabel', for:'rom', text:'Knee flexion in degrees (only if your physio measures it)'}),
      h('input', {id:'rom', type:'number', inputmode:'numeric', min:'0', max:'150', value: L.rom == null ? '' : L.rom, onchange:function(e){ var v = e.target.value === '' ? null : Number(e.target.value); patchLog(date, {rom:v}); }})) : null,
    h('div', {class:'field'}, h('label', {class:'fieldlabel', for:'note', text:'Notes'}),
      h('textarea', {id:'note', placeholder:'Sleep, how the walk felt, anything to ask the physio', value: L.note || '', oninput:function(e){ patchLog(date, {note:e.target.value}); }})));
  wrap.append(checkin);

  // Exercises
  var active = [], waiting = [];
  P.exercises.forEach(function(ex){ (exState(ex, day).active ? active : waiting).push(ex); });
  var pct = adherence(date);
  wrap.append(h('div', {class:'section-title'}, h('h2', {text:'Today’s work'}), h('span', {class:'meta', text: pct == null ? '' : Math.round(pct * 100) + '% of targets'})));
  active.forEach(function(ex){ wrap.append(counterCard(ex, date, false)); });
  if (!active.length) wrap.append(h('div', {class:'card flat meta', text:'Nothing is unlocked yet for this day.'}));
  if (waiting.length){
    wrap.append(h('div', {class:'section-title'}, h('h2', {text:'Waiting for sign-off'}), h('span', {class:'meta', text:'Read ahead, do not start'})));
    waiting.forEach(function(ex){
      var st = exState(ex, day), card = counterCard(ex, date, true); card.classList.add('lock');
      var ctl = h('div', {style:'margin-top:10px;display:grid;gap:8px'},
        h('span', {class:'pill ' + (st.timeOpen ? 'warn' : ''), text: st.timeOpen ? 'Needs sign-off' : 'Opens ' + fmtDate(addDays(P.surgeryDate, ex.unlockDay)) + ' at the earliest'}),
        st.timeOpen ? h('button', {class:'btn small', 'aria-pressed':'false', text:'My surgeon or physio has cleared this', onclick:function(){ S.profile.clear[ex.id] = true; saveProfile(); render(); }}) : null);
      card.insertBefore(ctl, card.querySelector('details'));
      wrap.append(card);
    });
  }
  // Allow revoking a clearance
  var cleared = P.exercises.filter(function(ex){ return ex.clearance === 'ask' && S.profile.clear[ex.id] === true; });
  if (cleared.length) wrap.append(h('div', {class:'card flat'}, h('p', {class:'meta', text:'Cleared by you: ' + cleared.map(function(x){ return x.name; }).join(', ') + '.'}),
    h('button', {class:'btn small', style:'margin-top:8px', text:'Lock these again', onclick:function(){ cleared.forEach(function(x){ S.profile.clear[x.id] = false; }); saveProfile(); render(); }})));
  return wrap;
}
function seg3(opts, cur, on){
  var g = h('div', {class:'segbtn', role:'group'});
  opts.forEach(function(o){ g.append(h('button', {text:o[0], 'aria-pressed': cur === o[1] ? 'true' : 'false', onclick:function(){ on(o[1]); }})); });
  return g;
}

/* ----- Plan ----- */
function viewPlan(){
  var P = S.program, day = dayOf(todayStr()), wrap = h('div', {style:'display:grid;gap:12px'});
  wrap.append(h('section', {class:'card'}, h('div', {class:'eyebrow', text:'Active block'}), h('h2', {style:'margin-top:6px', text:P.name}),
    h('p', {class:'sub', text:P.procedure + ' · surgery ' + fmtDate(P.surgeryDate)}), P.goal ? h('p', {style:'margin-top:8px', text:P.goal}) : null));
  if (P.precautions.length) wrap.append(h('section', {class:'card'}, h('h2', {text:'Rules from your report'}), h('ul', {class:'list'}, P.precautions.map(function(t){ return h('li', {text:t}); }))));
  if (P.brace.length){
    var cur = braceAt(day);
    wrap.append(h('section', {class:'card'}, h('h2', {text:'Brace schedule'}), h('div', {class:'brace'}, P.brace.map(function(b){
      return h('div', {class:'b' + (b === cur ? ' now' : '')}, h('strong', {text:b.label + (b === cur ? ' (now)' : '')}),
        h('span', {class:'meta', text:fmtDate(addDays(P.surgeryDate, b.fromDay)) + ' to ' + fmtDate(addDays(P.surgeryDate, b.toDay)) + '. ' + (b.note || '')}),
        b.confirm ? h('div', null, h('span', {class:'pill warn', text:'Confirm with surgeon'})) : null);
    }))));
  }
  var ph = phaseAt(day);
  wrap.append(h('section', {class:'card'}, h('h2', {text:'Recovery roadmap'}), h('p', {class:'sub', text:'Timeframes are typical. You move on when you meet the criteria, not when the date arrives.'}),
    h('div', {style:'margin-top:6px'}, P.roadmap.map(function(r){
      return h('div', {class:'phase' + (ph && r.n === ph.n ? ' now' : '')}, h('div', {class:'n', text:String(r.n)}),
        h('div', null, h('h3', {text:r.name}), h('p', {class:'meta', text:'Day ' + r.fromDay + ' to ' + r.toDay + ' · ' + fmtDate(addDays(P.surgeryDate, r.fromDay)) + ' to ' + fmtDate(addDays(P.surgeryDate, r.toDay))}),
          h('ul', {class:'list'}, (r.criteria || []).map(function(c){ return h('li', {text:c}); }))));
    }))));
  wrap.append(h('div', {class:'row'}, h('button', {class:'btn', text:'Red flags and when to call', onclick:openFlags})));
  if (S.blocks.length){
    wrap.append(h('section', {class:'card'}, h('h2', {text:'Earlier blocks'}),
      h('ul', {class:'list'}, S.blocks.slice().sort(function(a,b){ return (a.archivedAt||0) - (b.archivedAt||0); }).map(function(b){
        return h('li', {text:(b.program && b.program.name || b.id) + (b.archivedAt ? ' · replaced ' + new Date(b.archivedAt).toLocaleDateString('en-AU') : '')});
      }))));
  }
  return wrap;
}

/* ----- Checks ----- */
function viewChecks(){
  var P = S.program, day = dayOf(todayStr()), wrap = h('div', {style:'display:grid;gap:12px'});
  wrap.append(h('div', {class:'card flat'}, h('p', {class:'meta', text:'Checkpoints are the gates between phases. Record the result on the day. Measurements marked physio-measured should come from your physio, not from testing yourself.'})));
  P.checkpoints.forEach(function(cp){
    var p = cpProgress(cp), due = addDays(P.surgeryDate, cp.atDay), left = cp.atDay - day;
    var pill = p.pass === p.total ? ['All passed', 'good'] : left < 0 ? ['Overdue', 'warn'] : left <= 7 ? ['Due in ' + left + ' days', 'acc'] : ['Due ' + fmtDate(due), ''];
    var card = h('section', {class:'card'},
      h('div', {class:'row', style:'justify-content:space-between'}, h('div', null, h('h2', {text:cp.title}), h('p', {class:'sub', text:fmtDate(due) + ' · ' + p.pass + ' of ' + p.total + ' passed'})), h('span', {class:'pill ' + pill[1], text:pill[0]})));
    cp.items.forEach(function(it){
      var res = S.profile.tests[it.id], j = judge(it, res), ctl;
      if (it.type === 'check'){
        ctl = seg3([['Pass', true],['Not yet', false]], res ? res.value : undefined, function(v){ setTest(it.id, v); });
      } else {
        ctl = h('div', {class:'cp-input'}, h('input', {id:'t-' + it.id, type:'number', inputmode:'decimal', 'aria-label':it.label, value: res && res.value != null ? res.value : '',
          onchange:function(e){ setTest(it.id, e.target.value === '' ? null : Number(e.target.value)); }}), h('span', {class:'meta', text:(it.unit || '') + (it.target ? ' · target ' + opText(it.target) : '')}));
      }
      card.append(h('div', {class:'cp-item'}, h('div', {class:'row', style:'justify-content:space-between;flex-wrap:nowrap'}, h('div', {class:'grow'}, h('h3', {text:it.label}), h('p', {class:'meta', text:it.how || ''})),
        j ? h('span', {class:'pill ' + (j === 'pass' ? 'good' : 'warn'), text: j === 'pass' ? 'Passed' : 'Not yet'}) : null),
        ctl, res && res.date ? h('p', {class:'meta', text:'Recorded ' + fmtDate(res.date)}) : null));
    });
    if (cp.gate) card.append(h('div', {class:'gate'}, h('strong', {text:'To progress: '}), cp.gate));
    wrap.append(card);
  });
  if (!P.checkpoints.length) wrap.append(h('div', {class:'card flat meta', text:'This block has no checkpoints.'}));
  return wrap;
}
function setTest(id, value){ S.profile.tests[id] = {value:value, date:todayStr()}; saveProfile(); renderView(); }

/* ----- Trends ----- */
function lineChart(series, label){
  var W = 320, H = 150, L = 28, R = 12, T = 12, B = 24, n = series.length;
  var svg = sv('svg', {viewBox:'0 0 ' + W + ' ' + H, class:'chart', role:'img', 'aria-label':label});
  var x = function(i){ return L + (W - L - R) * (n > 1 ? i / (n - 1) : 0.5); }, y = function(v){ return T + (H - T - B) * (1 - v / 10); };
  [0,5,10].forEach(function(g){ svg.append(sv('line', {x1:L, x2:W-R, y1:y(g), y2:y(g), class:'ln'}), sv('text', {x:L-6, y:y(g)+4, 'text-anchor':'end'}, String(g))); });
  svg.append(sv('text', {x:L, y:H-6}, fmtDate(series[0].date)), sv('text', {x:W-R, y:H-6, 'text-anchor':'end'}, fmtDate(series[n-1].date)));
  var seg = [], segs = [];
  series.forEach(function(p, i){ if (p.v == null){ if (seg.length) segs.push(seg); seg = []; } else seg.push([x(i), y(p.v), p.v]); });
  if (seg.length) segs.push(seg);
  segs.forEach(function(s){
    if (s.length > 1) svg.append(sv('polyline', {points:s.map(function(p){ return p[0] + ',' + p[1]; }).join(' '), class:'pl'}));
  });
  var last = null;
  segs.forEach(function(s){ s.forEach(function(p){ svg.append(sv('circle', {cx:p[0], cy:p[1], r:2.5, class:'dt'})); last = p; }); });
  if (last){ svg.append(sv('circle', {cx:last[0], cy:last[1], r:5, class:'dtl'}), sv('text', {x:Math.min(last[0], W-R-6), y:Math.max(last[1]-10, 11), class:'val', 'text-anchor':'middle'}, String(last[2]))); }
  return svg;
}
function viewTrends(){
  var P = S.program, today = todayStr(), wrap = h('div', {style:'display:grid;gap:12px'});
  var start = pd(today) - 27*DAY < pd(P.surgeryDate) ? P.surgeryDate : addDays(today, -27);
  var n = Math.round((pd(today) - pd(start)) / DAY) + 1, dates = [];
  for (var i = 0; i < n; i++) dates.push(addDays(start, i));
  var pain = dates.map(function(d){ var L = S.logs[d]; return {date:d, v: L && L.pain != null ? L.pain : null}; });
  var ache = dates.map(function(d){ var L = S.logs[d]; return {date:d, v: L && L.ache != null ? L.ache : null}; });
  var logged = Object.keys(S.logs).filter(function(d){ var L = S.logs[d]; return L && (L.pain != null || Object.keys(L.done || {}).length); }).length;
  var last7 = []; for (var k = 0; k < 7; k++){ var a = adherence(addDays(today, -k)); if (a != null && addDays(today, -k) >= P.surgeryDate) last7.push(a); }
  var avg = last7.length ? Math.round(last7.reduce(function(s, v){ return s + v; }, 0) / last7.length * 100) : null;
  var lp = null; for (var q = pain.length - 1; q >= 0; q--) if (pain[q].v != null){ lp = pain[q].v; break; }
  wrap.append(h('section', {class:'card'}, h('div', {class:'stats'},
    h('div', {class:'stat'}, h('b', {text:String(logged)}), h('span', {text:'days logged'})),
    h('div', {class:'stat'}, h('b', {text: avg == null ? '–' : avg + '%'}), h('span', {text:'7-day targets'})),
    h('div', {class:'stat'}, h('b', {text: lp == null ? '–' : String(lp)}), h('span', {text:'latest pain /10'})))));
  wrap.append(h('section', {class:'card'}, h('h2', {text:'Knee pain'}), h('p', {class:'sub', text:'Last ' + n + ' days, 0 to 10. A downward drift is the goal. Spikes after a new exercise are information.'}),
    lineChart(pain, 'Knee pain over the last ' + n + ' days')));
  wrap.append(h('section', {class:'card'}, h('h2', {text:'Hip and back ache'}), lineChart(ache, 'Hip and back ache over the last ' + n + ' days')));
  var d14 = dates.slice(-14), sw = h('div', {class:'swl'});
  d14.forEach(function(d){ var L = S.logs[d], v = L ? L.swell : undefined; sw.append(h('div', {class: v === -1 ? 'l' : v === 1 ? 'm' : '', title:fmtDate(d), text: v === -1 ? '↓' : v === 1 ? '↑' : v === 0 ? '=' : '·'})); });
  wrap.append(h('section', {class:'card'}, h('h2', {text:'Swelling'}), h('p', {class:'sub', text:'↓ less, = same, ↑ more than the day before. Last ' + d14.length + ' days.'}), sw));
  var adh = h('div', {class:'adh'});
  d14.forEach(function(d){ var a = adherence(d); adh.append(h('div', {title:fmtDate(d) + ': ' + (a == null ? 'no data' : Math.round(a * 100) + '%')}, h('i', {class: a ? '' : 'none', style:'height:' + (a ? Math.max(a * 100, 3) : 2) + '%'}), h('span', {text:d.slice(8)}))); });
  wrap.append(h('section', {class:'card'}, h('h2', {text:'Targets met'}), h('p', {class:'sub', text:'Share of daily session targets completed, per day.'}), adh));
  return wrap;
}

/* ----- Data ----- */
function confirmBtn(key, label, armed, run, cls){
  var isArmed = ui.confirm === key;
  return h('button', {class:'btn ' + (cls || ''), text: isArmed ? armed : label, onclick:function(){
    if (isArmed){ ui.confirm = null; run(); }
    else { ui.confirm = key; renderView(); setTimeout(function(){ if (ui.confirm === key){ ui.confirm = null; if (ui.tab === 'data') renderView(); } }, 5000); }
  }});
}
function copyText(text, ta){
  var done = function(){ toast('Copied'); };
  var fb = function(){ ta.hidden = false; ta.value = text; ta.focus(); ta.select(); toast('Select and copy the text shown'); };
  try { navigator.clipboard.writeText(text).then(done, fb); } catch(e) { fb(); }
}
function templatePrompt(){
  return 'Build my next rehab block as one JSON object in exactly the same format as the current block below. Keep the surgeryDate. Change id, name and goal. For every exercise include id, name, category, target {sessions, detail}, clearance ("default" or "ask"), optional unlockDay, why, feel, stop and metric. Include checkpoints with measurable items {id, label, how, type ("check" or "number"), unit, target {op, value}} and a gate sentence for each, plus brace, roadmap, precautions and redFlags. Base it on my latest checkpoint results and my surgeon’s instructions. Output only the JSON.\n\nCurrent block:\n' + JSON.stringify(S.program, null, 1);
}
function viewData(){
  var wrap = h('div', {style:'display:grid;gap:12px'});
  var where = store.kind === 'db' ? 'Your data is saved on this device.' : 'Your data is saved on this device only. It does not sync to other phones or browsers. Export a backup regularly, and before you clear browser data or change phones.';
  wrap.append(h('section', {class:'card'}, h('h2', {text:'Storage'}), h('p', {style:'margin-top:6px', text:where}),
    h('p', {class:'sub', style:'margin-top:6px', text:'A backup file is your safety net. Export one after each checkpoint.'})));

  // Backup
  var bta = h('textarea', {id:'bk', class:'mono', placeholder:'Paste a backup here to restore it', value:ui.bk, oninput:function(e){ ui.bk = e.target.value; }});
  var ta0 = h('textarea', {class:'mono', hidden:true, 'aria-label':'Text to copy', readonly:true});
  wrap.append(h('section', {class:'card', style:'display:grid;gap:10px'}, h('h2', {text:'Backup'}),
    h('p', {class:'meta', text:'Export everything: program, logs and checkpoint results.'}),
    h('div', {class:'row'},
      h('button', {class:'btn primary', text:'Export backup', onclick:exportBackup}),
      h('button', {class:'btn', text:'Copy as text', onclick:function(){ copyText(JSON.stringify(backupObj()), ta0); }})),
    ta0,
    h('label', {class:'fieldlabel', for:'bk', text:'Restore from backup'}), bta,
    h('div', {class:'row'}, h('input', {type:'file', accept:'.json,application/json', 'aria-label':'Backup file', onchange:function(e){ readFile(e.target.files[0], function(t){ ui.bk = t; renderView(); }); }}),
      confirmBtn('restore', 'Restore backup', 'Tap again to overwrite', restoreBackup, 'danger'))));

  // Program import
  var pta = h('textarea', {id:'pj', class:'mono', placeholder:'Paste the new block JSON here', value:ui.pj, oninput:function(e){ ui.pj = e.target.value; }});
  var ta1 = h('textarea', {class:'mono', hidden:true, 'aria-label':'Text to copy', readonly:true});
  var card = h('section', {class:'card', style:'display:grid;gap:10px'}, h('h2', {text:'Load a new block'}),
    h('p', {class:'meta', text:'When a block ends, get the next one from Claude or your physio as a JSON file or text. Your logs and the old block are kept.'}),
    h('div', {class:'row'}, h('input', {type:'file', accept:'.json,application/json', 'aria-label':'Program file', onchange:function(e){ readFile(e.target.files[0], function(t){ ui.pj = t; checkProgram(); }); }})),
    h('label', {class:'fieldlabel', for:'pj', text:'Or paste it'}), pta,
    h('div', {class:'row'}, h('button', {class:'btn', text:'Check format', onclick:checkProgram})));
  if (ui.pendingErr) card.append(h('p', {style:'color:var(--bad);font-weight:600', text:ui.pendingErr}));
  if (ui.pending){
    var np = ui.pending;
    card.append(h('div', {class:'gate'}, h('strong', {text:np.name}), h('div', {text:np.exercises.length + ' exercises · ' + np.checkpoints.length + ' checkpoints · surgery ' + fmtDate(np.surgeryDate)})),
      confirmBtn('load', 'Use this block', 'Tap again to replace the current block', useProgram, 'primary'));
  }
  wrap.append(card);

  wrap.append(h('section', {class:'card', style:'display:grid;gap:10px'}, h('h2', {text:'Ask Claude for the next block'}),
    h('p', {class:'meta', text:'Copies a ready-made request that includes your current block, so the next one comes back in the right format.'}),
    h('div', {class:'row'}, h('button', {class:'btn', text:'Copy request for Claude', onclick:function(){ copyText(templatePrompt(), ta1); }})), ta1));
  return wrap;
}
function readFile(f, cb){ if (!f) return; var r = new FileReader(); r.onload = function(){ cb(String(r.result)); }; r.onerror = function(){ toast('Could not read that file'); }; r.readAsText(f); }
function checkProgram(){
  ui.pending = null; ui.pendingErr = '';
  var txt = (ui.pj || '').trim();
  if (!txt) { ui.pendingErr = 'Paste or choose a program first.'; renderView(); return; }
  var obj;
  try { obj = JSON.parse(txt); } catch(e) { ui.pendingErr = 'That text is not valid JSON. Check for missing quotes or commas.'; renderView(); return; }
  var err = validateProgram(obj);
  if (err) ui.pendingErr = err; else ui.pending = normalizeProgram(obj);
  renderView();
}
function useProgram(){
  var old = S.program;
  archiveBlock({id: old.id + '-' + Date.now().toString(36), program: clone(old), tests: clone(S.profile.tests), clear: clone(S.profile.clear), archivedAt: Date.now()});
  S.program = ui.pending; S.profile = {clear:{}, tests:{}};
  ui.pending = null; ui.pj = ''; ui.tab = 'today'; ui.date = todayStr();
  saveProfile(); render(); window.scrollTo(0,0); toast('New block loaded');
}
function backupObj(){ return {app:'patella-rehab-log', v:1, exportedAt:new Date().toISOString(), program:S.program, profile:S.profile, logs:S.logs, blocks:S.blocks}; }
function exportBackup(){
  var text = JSON.stringify(backupObj(), null, 1), name = 'patella-rehab-backup-' + todayStr() + '.json';
  try {
    var url = URL.createObjectURL(new Blob([text], {type:'application/json'}));
    var a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function(){ URL.revokeObjectURL(url); }, 4000);
    toast('Backup downloaded');
  } catch(e) { ui.bk = text; renderView(); toast('Download unavailable. Copy the text below instead.'); }
}
function restoreBackup(){
  var obj; try { obj = JSON.parse(ui.bk || ''); } catch(e) { toast('That is not a valid backup'); return; }
  if (!obj || obj.app !== 'patella-rehab-log' || validateProgram(obj.program)) { toast('That is not a backup from this app'); return; }
  S.program = normalizeProgram(obj.program); S.profile = Object.assign({clear:{}, tests:{}}, obj.profile || {}); S.logs = obj.logs || {};
  saveProfile(); Object.keys(S.logs).forEach(function(d){ S.logs[d].done = S.logs[d].done || {}; saveLog(d); });
  (obj.blocks || []).forEach(function(b){ if (b && b.id && !S.blocks.some(function(x){ return x.id === b.id; })) archiveBlock(b); });
  ui.bk = ''; render(); toast('Backup restored');
}

/* ----- Red flags sheet ----- */
function openFlags(){
  var P = S.program, sh = document.getElementById('sheet'); sh.textContent = ''; sh.hidden = false;
  var close = function(){ sh.hidden = true; };
  var btn = h('button', {class:'btn primary', text:'Close', onclick:close});
  sh.append(h('div', {class:'panel', role:'dialog', 'aria-modal':'true', 'aria-label':'Red flags'},
    h('h2', {text:'Red flags'}),
    h('p', {class:'meta', text:'Stop what you are doing. Call the same day.'}),
    P.redFlags.emergency.length ? h('div', null, h('span', {class:'pill bad', text:'Emergency'}), h('ul', {class:'list'}, P.redFlags.emergency.map(function(t){ return h('li', {text:t}); }))) : null,
    h('div', null, h('span', {class:'pill warn', text:'Call your surgeon or hospital today'}), h('ul', {class:'list'}, P.redFlags.urgent.map(function(t){ return h('li', {text:t}); }))),
    h('p', {class:'meta', text:'This app is for planning and tracking only. Your surgeon and physio decide what you do and when.'}), btn));
  sh.onclick = function(e){ if (e.target === sh) close(); };
  btn.focus();
}
document.addEventListener('keydown', function(e){ if (e.key === 'Escape') document.getElementById('sheet').hidden = true; });

/* ---------- Device persistence ---------- */
document.addEventListener('visibilitychange', function(){ if (document.visibilityState === 'hidden') localSave(); });
window.addEventListener('pagehide', function(){ localSave(); });
try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch(e) {}
if ('serviceWorker' in navigator) window.addEventListener('load', function(){ navigator.serviceWorker.register('/sw.js').catch(function(){}); });

/* ---------- Boot ---------- */
render();
initStore().then(function(){ if (store.kind === 'db') render(); }).catch(function(){ store.kind = 'local'; setStatus('saved'); render(); });
})();
