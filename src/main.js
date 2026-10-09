import { wedding } from './data/wedding.js';
import { i18n, khDigits } from './i18n.js';
import { foilDefs, flapClipSVG, crestSVG, cornerSVG, sealSVG } from './decor.js';
import { logoHTML, playLogo, showLogoStatic } from './logo.js';
import { buildSections, initSections } from './sections.js';

const $ = (s, r = document) => r.querySelector(s);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const img = (id, w) => `/img/${id}-${w}.webp`;
let lang = 'km';
try { lang = localStorage.getItem('lang') || 'km'; } catch {}

// ---------- build ----------
document.body.insertAdjacentHTML('afterbegin', foilDefs + flapClipSVG(0.56));
const FLAP_H = 0.56; // flap height as fraction of envelope height

$('#app').innerHTML = `
<section id="env-screen" aria-label="Invitation envelope">
  <div class="env-bg" style="background-image:url(${img(wedding.photos.envelope, 1280)})"></div>
  <header class="env-title"><h1 class="moul foil-text"><span class="t-km"></span></h1><p class="env-sub"></p></header>
  <div class="env-stage-wrap"><div class="float"><div class="tilt" id="tilt"><div class="stage" id="stage">
    <div class="p back"></div>
    <div class="p card" id="card"><div class="card-in">${logoHTML()}<p class="card-line moul"></p></div></div>
    <div class="p pk pk-bottom"><div class="pk-face"></div></div>
    <div class="p pk pk-left"><div class="pk-face"></div></div>
    <div class="p pk pk-right"><div class="pk-face"></div></div>
    <div class="p flap-shadow" id="flapShadow"></div>
    <div class="p flap" id="flap">
      <div class="flap-face front"><div class="flap-paper"></div>
        <svg class="flap-line" viewBox="0 0 1000 560" preserveAspectRatio="none"></svg>
        <div class="flap-logo">${logoHTML()}</div></div>
      <div class="flap-face back"><div class="flap-paper lining"></div></div>
    </div>
    <button class="p seal" id="seal" aria-label="Open the invitation"><span class="seal-shadow"></span>${sealSVG()}</button>
  </div></div></div></div>
  <p class="env-hint" id="hint"></p>
</section>
<main id="site" aria-hidden="true">
  <section class="cover" id="cover">
    <div class="cover-photo"><img alt="" src="${img(wedding.photos.cover, 1280)}" srcset="${img(wedding.photos.cover, 640)} 640w, ${img(wedding.photos.cover, 1280)} 1280w, ${img(wedding.photos.cover, 2000)} 2000w" sizes="100vw"></div>
    <div class="cover-shade"></div>
    <div class="corners"></div>
    <div class="cover-in">
      <div class="cv-top"><div class="cv-crest">${crestSVG()}</div>
      <p class="cv-bless moul foil-text"><span class="reveal-line"></span></p></div>
      <div class="cv-main">${logoHTML()}
      <p class="cv-en"></p>
      <p class="cv-invite"></p>
      <div class="cv-date" id="cvDate"></div>
      <p class="cv-lunar"></p>
      <p class="cv-venue"></p></div>
    </div>
    <div class="cv-scroll"><span></span><i></i></div>
  </section>
</main>
<div class="topbar" id="topbar"><div class="topbar-bg"></div>
  <div class="tb-logo" id="tbLogo"></div>
  <div class="tb-btns"><button id="langBtn" class="pill"></button></div></div>
<div class="fade" id="fade"></div>`;

buildSections();
// flap gold scalloped line (inset), drawn from same generator
import('./decor.js').then(({ flapPath }) => {
  const W = 1000, H = 560;
  const d = flapPath(W, H, 9, 0.016, false);
  $('.flap-line').innerHTML = `<g transform="translate(500 0) scale(.93 .9) translate(-500 0)"><path d="${d}" fill="none" stroke="url(#g-foil)" stroke-width="2.4" vector-effect="non-scaling-stroke" stroke-linecap="round"/></g>`;
});
// corners (mirrored inside svg)
const cs = $('.corners');
[[false, false, 'tl'], [true, false, 'tr'], [false, true, 'bl'], [true, true, 'br']].forEach(([fx, fy, k]) => {
  const s = cornerSVG({ flipX: fx, flipY: fy }); s.classList.add(k); cs.appendChild(s);
});
$('#tbLogo').innerHTML = logoHTML();

// ---------- language ----------
function setLang(l) {
  lang = l; try { localStorage.setItem('lang', l); } catch {}
  const t = i18n[l], km = l === 'km', d = wedding.date;
  document.documentElement.lang = km ? 'km' : 'en';
  document.documentElement.dataset.lang = l;
  const num = v => km ? khDigits(v) : String(v);
  $('.t-km').textContent = t.blessing;
  $('.env-sub').textContent = t.envTitleSub;
  $('#hint').textContent = t.tap;
  $('.card-line').textContent = t.blessing;
  $('.cv-bless .reveal-line').textContent = t.blessing;
  $('.cv-en').textContent = `${wedding.groom.shortEn} & ${wedding.bride.shortEn}`;
  $('.cv-invite').textContent = t.invite;
  $('#cvDate').innerHTML = [[t.day, t.weekdays[d.weekdayIdx]], [t.no, num(d.day)], [t.month, t.months[d.month - 1]], [t.year, num(d.year)]]
    .map(([a, b]) => `<div><small>${a}</small><b>${b}</b></div>`).join('');
  $('.cv-lunar').textContent = km ? wedding.lunarKm : '';
  $('.cv-lunar').style.display = km ? '' : 'none';
  $('.cv-venue').textContent = wedding.venue.short;
  $('#langBtn').textContent = t.langBtn;
}
setLang(lang);
initSections();
$('#langBtn').addEventListener('click', () => setLang(lang === 'km' ? 'en' : 'km'));

// ---------- music (button appears only when a track is configured) ----------
let audio = null;
if (wedding.music) {
  audio = new Audio(wedding.music); audio.loop = true; audio.preload = 'none';
  const mb = document.createElement('button'); mb.className = 'pill'; mb.id = 'musicBtn'; mb.setAttribute('aria-label', 'Music'); mb.textContent = '♪';
  $('.tb-btns').prepend(mb);
  mb.addEventListener('click', () => { if (audio.paused) { audio.play().catch(() => {}); mb.classList.remove('off'); } else { audio.pause(); mb.classList.add('off'); } });
}
// ---------- idle float + tilt ----------
const tilt = $('#tilt'); let tx = 0, ty = 0, cx = 0, cy = 0, idle = true;
addEventListener('pointermove', e => { if (e.pointerType === 'touch') return; tx = (e.clientX / innerWidth - .5) * 2; ty = (e.clientY / innerHeight - .5) * 2; });
addEventListener('deviceorientation', e => { if (e.gamma == null) return; tx = Math.max(-1, Math.min(1, e.gamma / 30)); ty = Math.max(-1, Math.min(1, (e.beta - 50) / 30)); });
(function loop() {
  if (idle && !reduce) { cx += (tx - cx) * .06; cy += (ty - cy) * .06; }
  else { cx *= .9; cy *= .9; }
  tilt.style.transform = `rotateX(${(-cy * 5).toFixed(2)}deg) rotateY(${(cx * 7).toFixed(2)}deg)`;
  requestAnimationFrame(loop);
})();

// ---------- opening timeline (deterministic, seekable) ----------
const stage = $('#stage'), flap = $('#flap'), card = $('#card'), seal = $('#seal');
const bez = (x1, y1, x2, y2) => t => { // cubic-bezier easing
  if (t <= 0) return 0; if (t >= 1) return 1;
  let a = 0, b = 1, m, x; for (let i = 0; i < 24; i++) { m = (a + b) / 2; x = 3 * (1 - m) ** 2 * m * x1 + 3 * (1 - m) * m * m * x2 + m ** 3; x < t ? a = m : b = m; }
  return 3 * (1 - m) ** 2 * m * y1 + 3 * (1 - m) * m * m * y2 + m ** 3;
};
const E = { io: bez(.65, 0, .35, 1), out: bez(.2, .7, .2, 1), in: bez(.6, 0, .9, .5), soft: bez(.45, .05, .25, 1), lin: t => t };
const lerp = (a, b, t) => a + (b - a) * t;
const seg = (t, a, b, ease = E.io) => ease(Math.min(1, Math.max(0, (t - a) / (b - a))));
const TOTAL = 5500; let cardMetrics = null;

function measure() {
  const r = card.getBoundingClientRect(), sr = stage.getBoundingClientRect();
  const k = innerWidth <= innerHeight ? .9 : .6;
  cardMetrics = { w: r.width, h: r.height, cx: r.left + r.width / 2, cy: r.top + r.height / 2, sh: sr.height, sw: sr.width,
    s: Math.min(innerWidth * .92 / r.width, innerHeight * .8 / r.height, 2.4) , vcx: innerWidth / 2, vcy: innerHeight / 2 };
}
function render(t) {
  const m = cardMetrics || (measure(), cardMetrics);
  const sh = m.sh, sw = m.sw;
  // seal: press, lift, set aside
  const press = seg(t, 0, 450, E.soft), lift = seg(t, 450, 1250, E.soft), aside = seg(t, 1250, 2000, E.in);
  const sealS = 1 - .06 * press + .2 * lift;
  seal.style.transform = `translate3d(calc(-50% + ${(aside * innerWidth * .7).toFixed(1)}px), calc(-50% - ${(lift * sh * .05 + aside * sh * .35).toFixed(1)}px), 6px) scale(${sealS.toFixed(3)}) rotate(${(aside * 40).toFixed(1)}deg)`;
  seal.style.setProperty('--sh', (lift * 1 + press * -.3).toFixed(3));
  seal.style.opacity = aside >= 1 ? 0 : 1;
  // flap 0 -> 180
  const f = seg(t, 1500, 2900, E.soft), deg = f * 180;
  const front = deg < 90;
  flap.style.transform = `translate3d(0, var(--ey,0px), ${front ? 4 : .4}px) rotateX(${deg.toFixed(2)}deg)`;
  $('#flapShadow').style.opacity = (1 - Math.min(1, f * 2.2)).toFixed(3);
  // envelope drops: the shared translation drives every envelope plane through --ey
  const drop = seg(t, 3700, 4700, E.in), nudge = seg(t, 2900, 3900, E.soft);
  const ey = nudge * sh * .07 + drop * (innerHeight * 1.1 + sh), er = drop * 5;
  stage.style.setProperty('--ey', ey.toFixed(1) + 'px'); stage.style.setProperty('--er', er.toFixed(2) + 'deg');
  // card drawn out at an angle, then to camera
  const draw = seg(t, 2800, 3900, E.soft), cam = seg(t, 4100, 5200, E.soft);
  const up = draw * sh * .62, rot = lerp(draw * -4, 0, cam);
  const dx = (m.vcx - m.cx) * cam, dy = (m.vcy - m.cy) * cam - up * (1 - cam);
  const sc = lerp(1 + draw * .04, m.s, cam);
  const cz = t > 3400 ? 10 : 1;
  card.style.transform = `translate3d(${dx.toFixed(1)}px, ${dy.toFixed(1)}px, ${cz}px) rotate(${rot.toFixed(2)}deg) scale(${sc.toFixed(3)})`;
  $('#hint').style.opacity = 1 - seg(t, 0, 400, E.lin);
  $('.env-title').style.opacity = 1 - seg(t, 3000, 4000, E.lin);
  // fade through dark
  const fade = seg(t, 4950, 5300, E.lin) * (t > 5400 ? 0 : 1);
  $('#fade').style.opacity = t >= TOTAL ? 0 : fade;
}
window.__seek = ms => { idle = false; tilt.style.transform = ''; render(ms); };

let opened = false;
function openInvite() {
  if (opened) return; opened = true; idle = false; measure();
  if (audio) audio.play().catch(() => {});
  $('#env-screen').classList.add('opening');
  $('#env-screen').dataset.state = 'opening';
  const t0 = performance.now(); const dur = reduce ? 900 : TOTAL;
  (function step(now) {
    let t = (now - t0) / dur * TOTAL;
    if (t < TOTAL) { render(t); requestAnimationFrame(step); } else finish();
  })(t0);
}
function finish() {
  $('#env-screen').style.display = 'none';
  const site = $('#site'); site.classList.add('on'); site.removeAttribute('aria-hidden');
  document.body.classList.add('opened'); scrollTo(0, 0);
  const fade = $('#fade'); fade.style.transition = 'opacity .9s ease'; fade.style.opacity = 0;
  startCover();
}
function startCover() {
  const c = $('#cover');
  c.classList.add('in');
  playLogo(c, 500);
  playLogo($('#tbLogo'), 1200).forEach(a => a.updatePlaybackRate?.(1.4));
}
window.__open = openInvite; window.__finish = finish;
seal.addEventListener('click', openInvite);
$('.env-stage-wrap').addEventListener('click', openInvite);
if (location.hash === '#skip') { measure(); finish(); showLogoStatic(document); }
