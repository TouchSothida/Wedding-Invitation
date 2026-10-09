import { wedding } from './data/wedding.js';
import { tx, bi, khDigits } from './i18n.js';
import { crestSVG, cornerSVG, dividerSVG, scallopPath, lotusSVG, candleSVG } from './decor.js';
import { logoHTML, playLogo, showLogoStatic } from './logo.js';
import gallery from './data/gallery.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const weak = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 3;
const coarse = matchMedia('(pointer: coarse)').matches;
const img = (id, w) => `/img/${id}-${w}.webp`;
const num = (v, km) => km ? khDigits(v) : String(v);
const numBi = v => `<span class="km">${khDigits(v)}</span><span class="en">${v}</span>`;
const pic = (id, alt = '', sizes = '100vw', cls = '') => `<img class="${cls}" alt="${alt}" loading="lazy" decoding="async" src="${img(id, 1280)}" srcset="${img(id, 640)} 640w, ${img(id, 1280)} 1280w, ${img(id, 2000)} 2000w" sizes="${sizes}">`;
const parents = p => `<p class="par"><span class="km">${tx.mr.km} ${p.father}</span><span class="en">${tx.mr.en} ${p.father}</span></p><p class="par"><span class="km">${tx.and.km} ${p.mother}</span><span class="en">${tx.and.en} ${p.mother}</span></p>`;
const head = (key, extra = '') => `<header class="sec-head">${crestSVG('sm')}<h2 class="moul foil-text foil-deep ${extra}"><span class="reveal-line">${bi(key)}</span></h2>${dividerSVG()}</header>`;

const D = wedding.date;
const TIME12 = t => { const [h, m] = t.split(':').map(Number); const pm = h >= 12; const h12 = h % 12 || 12; return { h12, m: String(m).padStart(2, '0'), pm }; };
const timeBi = t => { const x = TIME12(t); const mm = x.m; return `<span class="km">${khDigits(x.h12)}:${khDigits(mm)} ${x.pm ? tx.pm.km : tx.am.km}</span><span class="en">${x.h12}:${mm} ${x.pm ? tx.pm.en : tx.am.en}</span>`; };

const ICONS = [
  '<path d="M18 22h12v18H18z"/><path d="M24 8c4 5 5 8 0 12c-5-4-4-7 0-12z"/><path d="M14 40h20"/><path d="M24 20v2"/>',
  '<path d="M10 22h28v18H10z"/><path d="M8 16h32v6H8z"/><path d="M24 16v24"/><path d="M24 16c-6-8-12-2-6 0M24 16c6-8 12-2 6 0"/>',
  '<circle cx="18" cy="29" r="10"/><circle cx="30" cy="29" r="10"/><path d="M24 7l4 5-4 5-4-5z"/>',
  '<path d="M12 24c0-8 12-8 12 0s12 8 12 0-12-8-12 0-12 8-12 0z"/><path d="M8 34c4 4 8 5 12 3M40 34c-4 4-8 5-12 3"/>',
  '<path d="M12 10h12l-2 12a4 4 0 0 1-8 0z"/><path d="M18 26v10M13 38h10"/><path d="M26 10h12l-2 12a4 4 0 0 1-8 0z"/><path d="M32 26v10M27 38h10"/>',
];

export function buildSections() {
  const g = wedding.groom, b = wedding.bride;
  const html = `
<section class="sec sec-invite" id="invite">
  <div class="paper rose"></div>
  <div class="sec-corners"></div>
  <div class="wrap">
    <div class="arch-wrap"><div class="arch-frame"><div class="arch" data-reveal="arch">${pic(wedding.photos.arch, '', 'min(86vw,420px)')}</div></div></div>
    <p class="invite-text lines" data-reveal="lines">${bi('inviteIntro')}</p>
    ${dividerSVG()}
    <div class="parents-grid">
      <div class="pbox" data-reveal="rise"><h3 class="moul foil-text foil-deep"><span>${bi('groomParents')}</span></h3>${parents(g.parents)}</div>
      <div class="pbox" data-reveal="rise"><h3 class="moul foil-text foil-deep"><span>${bi('brideParents')}</span></h3>${parents(b.parents)}</div>
    </div>
  </div>
</section>

<section class="sec sec-couple" id="couple">
  <div class="paper cream"></div>
  <div class="wrap">
    ${head('coupleTitle')}
    <div class="scallop-frame" data-reveal="scallop">
      <svg width="0" height="0" style="position:absolute"><defs><clipPath id="scl" clipPathUnits="objectBoundingBox"><path d="${scallopPath(22)}"/></clipPath></defs></svg>
      <div class="sc-photo" style="clip-path:url(#scl)">${pic('p12', '', 'min(80vw,380px)')}</div>
      <svg class="sc-line" viewBox="0 0 1 1" preserveAspectRatio="none"><path d="${scallopPath(22)}" fill="none" stroke="url(#g-foil)" stroke-width="3" vector-effect="non-scaling-stroke"/><path d="${scallopPath(22, .435, .478)}" fill="none" stroke="url(#g-foil)" stroke-width="1" opacity=".7" vector-effect="non-scaling-stroke"/></svg>
    </div>
    <div class="names2">
      <div class="nm nm-l" data-reveal="fromL"><small>${bi('groom')}</small><h3 class="moul foil-text foil-deep">${g.km}</h3><p class="en-name">${g.en}</p><div class="of"><small>${bi('sonOf')}</small>${parents(g.parents)}</div></div>
      <div class="amp" aria-hidden="true">&amp;</div>
      <div class="nm nm-r" data-reveal="fromR"><small>${bi('bride')}</small><h3 class="moul foil-text foil-deep">${b.km}</h3><p class="en-name">${b.en}</p><div class="of"><small>${bi('daughterOf')}</small>${parents(b.parents)}</div></div>
    </div>
  </div>
</section>

<section class="sec sec-count" id="count">
  <div class="marquee" aria-hidden="true"><div class="mq-track">${Array(6).fill(0).map(() => `<span>${bi('marquee')}</span>`).join('')}</div></div>
  <div class="wrap">
    ${head('countTitle', 'on-dark')}
    <div class="cd" id="cd" role="timer">${['d', 'h', 'm', 's'].map(k => `<div class="cd-cell"><b data-k="${k}">00</b><small>${bi(k)}</small></div>`).join('')}</div>
  </div>
</section>

<section class="sec sec-prog" id="prog">
  <div class="paper cream"></div>
  <div class="wrap">
    ${head('programme')}
    <ol class="prog" id="prog-list">
      <li class="thread" aria-hidden="true"><i id="thread-fill"></i></li>
      ${wedding.programme.map((p, i) => `<li class="pi" data-i="${i}"><div class="node"><svg viewBox="0 0 48 48" fill="none" stroke="url(#g-foil)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[i % ICONS.length].replace(/<(path|circle)/g, '<$1 pathLength="1" class="ic"')}</svg></div>
        <div class="pt"><b>${timeBi(p.time)}</b><span><span class="km">${p.km}</span><span class="en">${p.en}</span></span></div></li>`).join('')}
    </ol>
  </div>
</section>

<section class="story" id="story" style="--n:${5}">
  <div class="story-pin">
    <div class="story-bg"></div>
    <div class="story-head"><h2 class="moul foil-text foil-deep"><span>${bi('storyTitle')}</span></h2></div>
    <div class="strip" id="strip">${[['p02', 0], ['p06', 1], ['p04', 2], ['p13', 3], ['p17', 4]].map(([id, i]) => `<figure class="slide"><div class="slide-ph">${pic(id, '', '70vw')}</div><figcaption class="lines">${bi_story(i)}</figcaption></figure>`).join('')}</div>
    <div class="story-bar"><i id="story-bar"></i></div>
  </div>
</section>

<section class="sec sec-candle" id="candle">
  <div class="candle-bg">${pic('p01', '', '100vw')}</div>
  <div class="candle-shade"></div>
  <canvas id="ripples" aria-hidden="true"></canvas>
  <div class="lanterns" id="lanterns"></div>
  <div class="candle-in"><h2 class="moul foil-text"><span>${bi('candleTitle')}</span></h2><p>${bi('candleHint')}</p></div>
</section>

<section class="sec sec-gallery" id="gallery">
  <div class="wrap wide">
    ${head('galleryTitle', 'on-dark')}
    <div class="masonry" id="masonry">${gallery.map((p, i) => `<button class="mi" data-i="${i}" style="aspect-ratio:${p.w}/${p.h}" aria-label="Photo ${i + 1}">${pic(p.id, '', '(min-width:900px) 30vw, 48vw')}</button>`).join('')}</div>
  </div>
</section>

<section class="sec sec-venue" id="venue">
  <div class="paper cream"></div>
  <div class="wrap">
    ${head('venueTitle')}
    ${wedding.venue.name ? `<h3 class="venue-name moul">${wedding.venue.name}</h3>` : ''}
    <p class="addr">${wedding.venue.address}</p>
    <div class="map" data-reveal="rise"><iframe title="Map" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://maps.google.com/maps?q=${wedding.venue.lat},${wedding.venue.lng}&output=embed"></iframe></div>
    <div class="btns"><a class="btn" id="openMaps" href="https://www.google.com/maps?q=${wedding.venue.lat},${wedding.venue.lng}" target="_blank" rel="noopener">${bi('openMaps')}</a>
    <button class="btn ghost" id="saveCal">${bi('saveCal')}</button></div>
  </div>
</section>

<section class="sec sec-gift" id="gift">
  <div class="paper rose"></div>
  <div class="wrap">
    ${head('giftTitle')}
    <p class="gift-sub">${bi('giftSub')}</p>
    <div class="qrs">${wedding.gift.map(q => `<figure class="qr" data-reveal="rise"><img alt="${q.label}" src="${q.img}" width="905" height="1280" loading="lazy"><figcaption>${q.label}</figcaption><a class="btn" href="${q.img}" download="${q.label.replace(/[^\w]+/g, '-')}.jpg">${bi('saveQr')}</a></figure>`).join('')}</div>
    <p class="hint">${bi('qrHint')}</p>
  </div>
</section>

<section class="sec sec-thanks" id="thanks">
  <div class="wrap">
    <div class="candles" id="candles">${[0, 1, 2, 3, 4].map(() => candleSVG()).join('')}</div>
    <h2 class="moul foil-text thanks-h"><span>${bi('thanks')}</span></h2>
    <p class="thanks-sub">${bi('thanksSub')}</p>
    <div class="thanks-logo" id="thanksLogo">${logoHTML()}</div>
    <p class="share-t">${bi('shareTitle')}</p>
    <div class="shares" id="shares">
      <a class="sh tg" id="shTg" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#27a7e7"/><path d="M5.4 11.7l11.8-4.6c.5-.2 1 .1.8.9l-2 9.4c-.1.7-.6.9-1.2.5l-3.1-2.3-1.5 1.4c-.2.2-.3.3-.6.3l.2-3.2 5.8-5.2c.3-.2-.1-.4-.4-.2l-7.200 4.500-3.100-1c-.7-.2-.7-.7.200-1z" fill="#fff"/></svg><span>${bi('shTg')}</span></a>
      <a class="sh ms" id="shMs" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><defs><linearGradient id="gms" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#0099ff"/><stop offset=".6" stop-color="#a033ff"/><stop offset="1" stop-color="#ff5280"/></linearGradient></defs><path d="M12 1C5.900 1 1 5.600 1 11.300c0 3.200 1.600 6 4 7.900V23l3.700-2c1 .3 2.100.4 3.300.4 6.100 0 11-4.600 11-10.300S18.100 1 12 1z" fill="url(#gms)"/><path d="M4.800 14.300l3.700-5.800c.6-.9 1.800-1.100 2.600-.5l2.900 2.200c.3.200.6.200.9 0l3.900-3c.5-.4 1.200.2.800.8l-3.700 5.800c-.6.900-1.800 1.100-2.600.5l-2.900-2.200c-.3-.2-.6-.2-.9 0l-3.900 3c-.5.400-1.200-.2-.8-.8z" fill="#fff"/></svg><span>${bi('shMs')}</span></a>
      <a class="sh fb" id="shFb" target="_blank" rel="noopener"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#1877f2"/><path d="M13.300 19v-6.300h2.100l.4-2.600h-2.500V8.500c0-.8.300-1.300 1.400-1.300h1.200V4.900c-.2 0-1-.1-1.900-.1-2 0-3.300 1.200-3.300 3.400v1.900H8.600v2.600h2.100V19z" fill="#fff"/></svg><span>${bi('shFb')}</span></a>
      <button class="sh cp" id="shCp"><svg viewBox="0 0 24 24" fill="none" stroke="#e9c46a" stroke-width="1.8" stroke-linecap="round"><path d="M10 14a4 4 0 0 0 5.700 0l3-3a4 4 0 0 0-5.700-5.700l-1 1"/><path d="M14 10a4 4 0 0 0-5.700 0l-3 3a4 4 0 0 0 5.700 5.700l1-1"/></svg><span class="lbl">${bi('shCopy')}</span></button>
    </div>
    <footer class="credit"><a href="https://somethphay.me" target="_blank" rel="noopener">Design inspired by Someth Phay · somethphay.me</a></footer>
  </div>
</section>

<div class="viewer" id="viewer" hidden aria-modal="true" role="dialog">
  <button class="v-close" id="vClose" aria-label="Close">&times;</button>
  <div class="v-track" id="vTrack"></div>
  <div class="v-count" id="vCount"></div>
  <button class="v-nav prev" id="vPrev" aria-label="Previous">&#8249;</button><button class="v-nav next" id="vNext" aria-label="Next">&#8250;</button>
</div>`;
  $('#site').insertAdjacentHTML('beforeend', html);
}
function bi_story(i) { return `<span class="km">${tx.story[i].km}</span><span class="en">${tx.story[i].en}</span>`; }

// ---------- behaviours ----------
export function initSections() {
  // corners for invitation
  const sc = $('.sec-corners');
  [[false, false, 'tl'], [true, false, 'tr'], [false, true, 'bl'], [true, true, 'br']].forEach(([fx, fy, k]) => { const s = cornerSVG({ flipX: fx, flipY: fy }); s.classList.add(k); sc.appendChild(s); });

  // reveals
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .18, rootMargin: '0px 0px -6% 0px' });
  // clipped elements report zero visible area, so observe the wrapper instead
  new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { $('.arch').classList.add('in'); o.disconnect(); } }), { threshold: .25 }).observe($('.arch-frame'));
  $$('[data-reveal]:not([data-reveal=arch]),.sec-head,.divider,.thanks-logo,.candles,.mi,.scallop-frame').forEach(el => io.observe(el));
  $$('.sec-head').forEach(h => h.addEventListener('transitionend', () => {}, { once: true }));

  // scroll state: top bar + progress for thread / story / lanterns
  const topbar = document.body;
  const thread = $('#thread-fill'), plist = $('#prog-list'), pis = $$('.pi');
  const story = $('#story'), strip = $('#strip'), sbar = $('#story-bar'), sbg = $('.story-bg'), sTitle = $('.story-head');
  const day = [243, 214, 196], dusk = [38, 14, 30];
  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  let ticking = false;
  const update = () => {
    ticking = false;
    const y = scrollY, vh = innerHeight;
    document.body.classList.toggle('scrolled', y > 40);
    // programme thread
    const r = plist.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (vh * .62 - r.top) / r.height));
    thread.style.transform = `scaleY(${p.toFixed(4)})`;
    pis.forEach(li => { const n = li.querySelector('.node').getBoundingClientRect(); li.classList.toggle('lit', n.top < vh * .62); });
    // story
    const sr = story.getBoundingClientRect(), total = sr.height - vh;
    const sp = Math.min(1, Math.max(0, -sr.top / total));
    const maxX = strip.scrollWidth - innerWidth;
    strip.style.transform = `translate3d(${(-sp * maxX).toFixed(1)}px,0,0)`;
    sbar.style.transform = `scaleX(${sp.toFixed(4)})`;
    const c = mix(day, dusk, Math.min(1, sp * 1.15)), c2 = mix([250, 232, 214], [92, 36, 60], sp);
    sbg.style.background = `linear-gradient(180deg, rgb(${c}) 0%, rgb(${c2}) 100%)`;
    story.classList.toggle('dusk', sp > .5);
    $$('.slide', strip).forEach((s, i) => { const t = Math.abs(sp * 4 - i); s.style.setProperty('--f', Math.max(0, 1 - t * .6).toFixed(3)); });
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  addEventListener('resize', update); update();

  // countdown (first programme item, Cambodia time)
  const target = new Date(`${D.iso}T${wedding.programme[0].time}:00+07:00`).getTime();
  const cells = $$('#cd b'); let last = [];
  const tick = () => {
    let diff = Math.max(0, target - Date.now()); const vals = { d: Math.floor(diff / 864e5), h: Math.floor(diff % 864e5 / 36e5), m: Math.floor(diff % 36e5 / 6e4), s: Math.floor(diff % 6e4 / 1e3) };
    cells.forEach(el => { const k = el.dataset.k, v = String(vals[k]).padStart(2, '0'); if (el.dataset.v !== v) { el.dataset.v = v; el.innerHTML = `<span class="km">${khDigits(v)}</span><span class="en">${v}</span>`; if (!reduce) el.animate([{ transform: 'translateY(-30%)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 450, easing: 'cubic-bezier(.2,.8,.2,1)' }); } });
  };
  tick(); setInterval(tick, 1000);

  // logo on thanks
  const tl = $('#thanksLogo'); new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { reduce ? showLogoStatic(tl) : playLogo(tl, 300); o.disconnect(); } }), { threshold: .5 }).observe(tl);
  // candles light one by one
  const candles = $('#candles'); new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { $$('.candle', candles).forEach((c, i) => setTimeout(() => c.classList.add('lit'), reduce ? 0 : 500 + i * 650)); o.disconnect(); } }), { threshold: .5 }).observe(candles);

  initRipples();
  initGallery();
  initVenue();
  initShare();
}

function initRipples() {
  const sec = $('#candle'), cv = $('#ripples'), ctx = cv.getContext('2d'), lant = $('#lanterns');
  let rings = [], raf = 0, visible = false, W = 0, H = 0;
  const size = () => { const r = sec.getBoundingClientRect(); const dpr = Math.min(devicePixelRatio || 1, 2); W = r.width; H = r.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  new ResizeObserver(size).observe(sec); size();
  new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible && rings.length && !raf) raf = requestAnimationFrame(draw); }).observe(sec);
  function draw(now) {
    raf = 0; if (!visible) return;
    ctx.clearRect(0, 0, W, H);
    rings = rings.filter(r => now - r.t0 < r.life);
    for (const r of rings) {
      const k = (now - r.t0) / r.life, rad = r.max * (1 - Math.pow(1 - k, 3));
      for (let j = 0; j < 3; j++) { const rr = rad - j * 14; if (rr <= 0) continue; ctx.beginPath(); ctx.ellipse(r.x, r.y, rr, rr * .38, 0, 0, Math.PI * 2); ctx.strokeStyle = `rgba(255,236,190,${(1 - k) * (.55 - j * .15)})`; ctx.lineWidth = 1.6 - j * .4; ctx.stroke(); }
    }
    if (rings.length) raf = requestAnimationFrame(draw);
  }
  sec.addEventListener('pointerdown', e => {
    const r = sec.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    rings.push({ x, y, t0: performance.now(), life: reduce ? 400 : 2400, max: Math.min(W, 520) * .45 });
    if (!raf) raf = requestAnimationFrame(draw);
    const el = document.createElement('div'); el.className = 'lantern'; el.style.left = x + 'px'; el.style.top = y + 'px'; el.innerHTML = lotusSVG();
    lant.appendChild(el); if (lant.children.length > 10) lant.firstChild.remove();
    el.style.setProperty('--dx', (Math.random() * 60 - 30).toFixed(0) + 'px');
    el.addEventListener('animationend', () => el.remove());
  });
}

function initGallery() {
  const v = $('#viewer'), track = $('#vTrack'), count = $('#vCount'); let cur = 0, built = false;
  const build = () => { if (built) return; built = true; track.innerHTML = gallery.map(p => `<div class="v-slide"><img alt="" loading="lazy" src="${img(p.id, 1280)}" srcset="${img(p.id, 1280)} 1280w, ${img(p.id, 2000)} 2000w" sizes="100vw"></div>`).join(''); };
  const go = (i, smooth = true) => { cur = (i + gallery.length) % gallery.length; track.scrollTo({ left: cur * track.clientWidth, behavior: smooth && !reduce ? 'smooth' : 'auto' }); count.textContent = `${cur + 1} / ${gallery.length}`; };
  const open = i => { build(); v.hidden = false; document.body.classList.add('lock'); requestAnimationFrame(() => go(i, false)); };
  const close = () => { v.hidden = true; document.body.classList.remove('lock'); };
  $('#masonry').addEventListener('click', e => { const b = e.target.closest('.mi'); if (b) open(+b.dataset.i); });
  $('#vClose').onclick = close; $('#vPrev').onclick = () => go(cur - 1); $('#vNext').onclick = () => go(cur + 1);
  track.addEventListener('scroll', () => { const i = Math.round(track.scrollLeft / track.clientWidth); if (i !== cur) { cur = i; count.textContent = `${cur + 1} / ${gallery.length}`; } }, { passive: true });
  addEventListener('keydown', e => { if (v.hidden) return; if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft') go(cur - 1); if (e.key === 'ArrowRight') go(cur + 1); });
  v.addEventListener('click', e => { if (e.target === v || e.target.classList.contains('v-slide')) close(); });
}

function initVenue() {
  $('#saveCal').addEventListener('click', () => {
    const z = (d, t) => { const [y, m, dd] = d.split('-'); const [h, mi] = t.split(':'); const u = new Date(Date.UTC(+y, +m - 1, +dd, +h - 7, +mi)); return u.toISOString().replace(/[-:]|\.\d{3}/g, ''); };
    const first = wedding.programme[0], last = wedding.programme[wedding.programme.length - 1];
    const [lh, lm] = last.time.split(':').map(Number); const endT = `${String(lh + 4).padStart(2, '0')}:${String(lm).padStart(2, '0')}`;
    const desc = wedding.programme.map(p => `${p.time} ${p.en} / ${p.km}`).join('\\n');
    const ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Wedding Invitation//EN', 'BEGIN:VEVENT', `UID:wedding-${D.iso}@invitation`, `DTSTAMP:${new Date().toISOString().replace(/[-:]|\.\d{3}/g, '')}`,
      `DTSTART:${z(D.iso, first.time)}`, `DTEND:${z(D.iso, endT)}`, `SUMMARY:Wedding of ${wedding.groom.en} & ${wedding.bride.en}`, `LOCATION:${wedding.venue.address.replace(/,/g, '\\,')}`,
      `GEO:${wedding.venue.lat};${wedding.venue.lng}`, `DESCRIPTION:${desc}`, 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' })); a.download = 'wedding.ics'; document.body.appendChild(a); a.click(); a.remove();
  });
}

function initShare() {
  const url = location.origin + location.pathname, text = `${tx.shareText.km}`;
  $('#shTg').href = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
  $('#shMs').href = `fb-messenger://share/?link=${encodeURIComponent(url)}`;
  $('#shFb').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  $('#shCp').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(url); } catch { const t = document.createElement('textarea'); t.value = url; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch {} t.remove(); }
    const l = $('#shCp .lbl'), old = l.innerHTML; l.innerHTML = bi('copied'); setTimeout(() => l.innerHTML = old, 1800);
  });
}
