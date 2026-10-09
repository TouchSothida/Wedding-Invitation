import { crestSVG, heartSVG, butterflySVG, flourishSVG } from './decor.js';
import { wedding } from './data/wedding.js';

export function logoHTML() {
  return `<div class="logo"><div class="logo-in">
    <div class="logo-crest">${crestSVG()}</div>
    <div class="logo-body">
      <span class="n n1 foil-text"><span class="reveal">${wedding.groom.shortKm}</span></span>
      ${flourishSVG()}
      <span class="mid">${heartSVG()}</span>
      <span class="bf">${butterflySVG()}</span>
      <span class="n n2 foil-text"><span class="reveal">${wedding.bride.shortKm}</span></span>
    </div></div></div>`;
}

const EASE = 'cubic-bezier(.22,.8,.2,1)';
// names reveal L->R, flourish draws, heart pops, butterfly flies in. Clip-path cleared afterwards.
export function playLogo(root, delay = 0) {
  const q = s => root.querySelector(s);
  const out = [];
  root.querySelectorAll('.reveal').forEach((el, i) => {
    const a = el.animate([{ clipPath: 'inset(-40% 110% -40% -10%)' }, { clipPath: 'inset(-40% -10% -40% -10%)' }],
      { duration: 1100, delay: delay + i * 650, easing: EASE, fill: 'both' });
    a.finished.then(() => { a.cancel(); el.style.clipPath = 'none'; }).catch(() => {});
    out.push(a);
  });
  const fl = q('.flourish .draw');
  if (fl) out.push(fl.animate([{ strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDasharray: 1, strokeDashoffset: 0 }], { duration: 1500, delay: delay + 500, easing: 'cubic-bezier(.6,0,.2,1)', fill: 'both' }));
  const h = q('.mid'); if (h) out.push(h.animate([{ transform: 'translate(-50%,-50%) scale(0)', opacity: 0 }, { transform: 'translate(-50%,-50%) scale(1.35)', opacity: 1, offset: .6 }, { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 }], { duration: 800, delay: delay + 1500, easing: 'cubic-bezier(.3,1.6,.5,1)', fill: 'both' }));
  const b = q('.bf'); if (b) out.push(b.animate([
    { transform: 'translate(-120%,70%) rotate(-40deg) scale(.4)', opacity: 0 },
    { transform: 'translate(-50%,-20%) rotate(12deg) scale(1.1)', opacity: 1, offset: .55 },
    { transform: 'translate(0,0) rotate(0) scale(1)', opacity: 1 }], { duration: 1500, delay: delay + 1900, easing: EASE, fill: 'both' }));
  return out;
}
export function showLogoStatic(root) {
  root.querySelectorAll('.reveal').forEach(e => e.style.clipPath = 'none');
  root.querySelectorAll('.flourish .draw').forEach(e => { e.style.strokeDasharray = 1; e.style.strokeDashoffset = 0; });
  root.querySelectorAll('.mid,.bf').forEach(e => e.style.opacity = 1);
}
