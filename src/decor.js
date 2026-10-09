// Original decorative elements, drawn in code. No Khmer text is ever placed inside SVG.
const NS = 'http://www.w3.org/2000/svg';

export const foilDefs = `
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <linearGradient id="g-foil" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#7d5019"/><stop offset=".22" stop-color="#d9a94a"/>
    <stop offset=".38" stop-color="#fff2c2"/><stop offset=".52" stop-color="#c8923a"/>
    <stop offset=".78" stop-color="#8a5a1c"/><stop offset="1" stop-color="#e2b95a"/>
  </linearGradient>
  <linearGradient id="g-foil-h" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#9a6a24"/><stop offset=".3" stop-color="#f1d58a"/>
    <stop offset=".5" stop-color="#fff2c2"/><stop offset=".7" stop-color="#cf9a3e"/><stop offset="1" stop-color="#8a5a1c"/>
  </linearGradient>
  <radialGradient id="g-seal" cx=".35" cy=".3" r=".9">
    <stop offset="0" stop-color="#f4d583"/><stop offset=".5" stop-color="#c8923a"/><stop offset="1" stop-color="#7a4a14"/>
  </radialGradient>
  <filter id="seal-fx" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="7" result="n"/>
    <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G" result="d"/>
    <feGaussianBlur in="d" stdDeviation="2.2" result="h"/>
    <feSpecularLighting in="h" surfaceScale="5" specularConstant="1.1" specularExponent="26" lighting-color="#fff3cf" result="s">
      <fePointLight x="-40" y="-60" z="120"/>
    </feSpecularLighting>
    <feComposite in="s" in2="d" operator="in" result="sIn"/>
    <feDiffuseLighting in="h" surfaceScale="4" diffuseConstant="1" lighting-color="#ffe9a8" result="df">
      <feDistantLight azimuth="235" elevation="55"/>
    </feDiffuseLighting>
    <feComposite in="df" in2="d" operator="in" result="dfIn"/>
    <feBlend in="d" in2="dfIn" mode="multiply" result="lit"/>
    <feComposite in="lit" in2="sIn" operator="arithmetic" k1="0" k2="1" k3=".9" k4="0"/>
  </filter>
</defs></svg>`;

// Scalloped flap path in w x h units. Scallops run along the two slanted edges.
export function flapPath(w, h, n = 9, amp = 0.016, withTop = true) {
  const tip = [w / 2, h];
  const edge = (a, b, sign) => {
    let d = '';
    const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy);
    const nx = (dy / len) * sign, ny = (-dx / len) * sign;
    for (let i = 0; i < n; i++) {
      const p0 = [a[0] + dx * i / n, a[1] + dy * i / n], p1 = [a[0] + dx * (i + 1) / n, a[1] + dy * (i + 1) / n];
      const cx = (p0[0] + p1[0]) / 2 + nx * amp * w * 2, cy = (p0[1] + p1[1]) / 2 + ny * amp * w * 2;
      d += `Q${cx.toFixed(2)} ${cy.toFixed(2)} ${p1[0].toFixed(2)} ${p1[1].toFixed(2)}`;
    }
    return d;
  };
  // outward = away from triangle interior
  const right = edge([w, 0], tip, 1), left = edge(tip, [0, 0], 1);
  return (withTop ? `M0 0L${w} 0` : `M${w} 0`) + right + left + (withTop ? 'Z' : '');
}
export function flapClipSVG(ratio) {
  // normalised clipPath (objectBoundingBox) so it scales with the flap element
  const d = flapPath(1, ratio, 9, 0.016).replace(/(-?\d+\.?\d*) (-?\d+\.?\d*)/g,
    (_, x, y) => `${(+x).toFixed(4)} ${(+y / ratio).toFixed(4)}`);
  return `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <clipPath id="flap-clip" clipPathUnits="objectBoundingBox"><path d="${d}"/></clipPath></defs></svg>`;
}

export function crestSVG(cls = '') {
  let rays = '';
  for (let k = -3; k <= 3; k++) {
    const L = 46 - Math.abs(k) * 4.5, w = 5.4 - Math.abs(k) * .35;
    rays += `<g transform="translate(50 60) rotate(${k * 19})"><path d="M0 0Q${w} ${-L / 2} 0 ${-L}Q${-w} ${-L / 2} 0 0Z" fill="url(#g-foil)" stroke="#6b4210" stroke-width=".35"/><path d="M0 -4V${-L + 7}" stroke="#fff0bb" stroke-width=".35" opacity=".8"/></g>`;
  }
  return `<svg class="crest ${cls}" viewBox="0 0 100 70" aria-hidden="true">
    ${rays}
    <path d="M14 64Q32 54 50 62Q68 54 86 64" fill="none" stroke="url(#g-foil)" stroke-width="2" stroke-linecap="round"/>
    <path d="M26 67Q50 60 74 67" fill="none" stroke="url(#g-foil)" stroke-width="1.1" stroke-linecap="round"/>
    <circle cx="50" cy="60" r="2.6" fill="url(#g-foil)" stroke="#6b4210" stroke-width=".3"/></svg>`;
}

export function heartSVG() {
  return `<svg class="heart" viewBox="0 0 24 22" aria-hidden="true"><path d="M12 21C4 14.5 1.5 10.5 1.5 7a5.2 5.2 0 0 1 10.5-1.4A5.2 5.2 0 0 1 22.500 7C22.500 10.500 20 14.500 12 21Z" fill="url(#g-foil)" stroke="#7a4a14" stroke-width=".5"/></svg>`;
}
export function butterflySVG() {
  const wing = `<path d="M0 0C-5-9-17-12-20-5C-22 1-14 5-6 3C-14 6-16 14-10 16C-5 17-1 10 0 4Z" fill="url(#g-foil)" stroke="#7a4a14" stroke-width=".5"/><path d="M-3 1C-9-1-14-3-17-4" stroke="#fff0bb" stroke-width=".4" fill="none"/>`;
  return `<svg class="butterfly" viewBox="-24 -16 48 36" aria-hidden="true">${wing}<g transform="scale(-1 1)">${wing}</g>
    <path d="M0-3V9" stroke="#7a4a14" stroke-width="1.2" stroke-linecap="round"/><path d="M0-3Q-2-9-5-10M0-3Q2-9 5-10" stroke="#7a4a14" stroke-width=".5" fill="none"/></svg>`;
}
export function flourishSVG() {
  return `<svg class="flourish" viewBox="0 0 220 60" preserveAspectRatio="none" aria-hidden="true">
   <path class="draw" d="M6 12C40 10 52 40 86 38C104 37 104 22 96 22C88 22 90 34 110 34C130 34 138 20 156 22C180 24 190 50 214 48" fill="none" stroke="url(#g-foil-h)" stroke-width="1.5" stroke-linecap="round" pathLength="1"/></svg>`;
}

// Leaf scroll corner built along a spiral stem. Mirroring happens on an inner <g>.
export function cornerSVG({ flipX = false, flipY = false } = {}) {
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', '0 0 200 200'); svg.setAttribute('class', 'corner'); svg.setAttribute('aria-hidden', 'true');
  const sx = flipX ? -1 : 1, sy = flipY ? -1 : 1;
  const g = document.createElementNS(NS, 'g');
  g.setAttribute('transform', `translate(${flipX ? 200 : 0} ${flipY ? 200 : 0}) scale(${sx} ${sy})`);
  const stem = 'M6 6C70 8 128 30 150 84C166 124 128 156 100 140C78 127 90 98 112 104';
  const p = document.createElementNS(NS, 'path');
  p.setAttribute('d', stem); p.setAttribute('fill', 'none'); p.setAttribute('stroke', 'url(#g-foil)');
  p.setAttribute('stroke-width', '1.6'); p.setAttribute('stroke-linecap', 'round'); g.appendChild(p);
  const p2 = document.createElementNS(NS, 'path');
  p2.setAttribute('d', 'M6 6C10 60 24 112 66 140C92 158 116 150 120 136'); p2.setAttribute('fill', 'none');
  p2.setAttribute('stroke', 'url(#g-foil)'); p2.setAttribute('stroke-width', '1.1'); p2.setAttribute('stroke-linecap', 'round'); g.appendChild(p2);
  svg.appendChild(g); document.body.appendChild(svg);
  const addLeaves = (path, count, size, side) => {
    const len = path.getTotalLength();
    for (let i = 1; i <= count; i++) {
      const t = i / (count + 1), L = len * t, a = path.getPointAtLength(L), b = path.getPointAtLength(L + 1);
      const ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI + side * 52 * (i % 2 ? 1 : -1);
      const s = size * (1.1 - t * .55);
      const leaf = document.createElementNS(NS, 'path');
      leaf.setAttribute('d', `M0 0Q${s * .45} ${-s * .32} ${s} 0Q${s * .45} ${s * .32} 0 0Z`);
      leaf.setAttribute('transform', `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${ang.toFixed(1)})`);
      leaf.setAttribute('fill', 'url(#g-foil)'); leaf.setAttribute('stroke', '#6b4210'); leaf.setAttribute('stroke-width', '.3');
      g.appendChild(leaf);
    }
  };
  addLeaves(p, 9, 22, 1); addLeaves(p2, 6, 16, -1);
  const dot = document.createElementNS(NS, 'circle');
  dot.setAttribute('cx', '112'); dot.setAttribute('cy', '104'); dot.setAttribute('r', '3'); dot.setAttribute('fill', 'url(#g-foil)'); g.appendChild(dot);
  document.body.removeChild(svg);
  return svg;
}

export function sealSVG() {
  // poured, uneven edge: seeded lobes
  let s = 11; const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const N = 28, pts = [];
  for (let i = 0; i < N; i++) { const a = i / N * Math.PI * 2, r = 44 + rnd() * 5 + (i % 3 === 0 ? 2.5 : 0); pts.push([50 + Math.cos(a) * r, 50 + Math.sin(a) * r]); }
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < N; i++) { const p = pts[(i + 1) % N], q = pts[i]; d += `Q${((q[0] + p[0]) / 2 * 1.01 - .5).toFixed(1)} ${((q[1] + p[1]) / 2 * 1.01 - .5).toFixed(1)} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`; }
  d += 'Z';
  return `<svg class="seal-svg" viewBox="-6 -6 112 112" aria-hidden="true">
   <g filter="url(#seal-fx)"><path d="${d}" fill="url(#g-seal)"/>
   <circle cx="50" cy="50" r="33" fill="none" stroke="#7a4a14" stroke-opacity=".55" stroke-width="1.4"/>
   <circle cx="50" cy="50" r="30.600" fill="none" stroke="#ffe9a8" stroke-opacity=".5" stroke-width=".8"/></g>
   <g transform="translate(26 24) scale(.48)" opacity=".9" style="mix-blend-mode:multiply">${crestSVG().replace(/<svg[^>]*>|<\/svg>/g, '').replace(/url\(#g-foil\)/g, '#8a5a1c')}</g>
   <g transform="translate(25.600 23.200) scale(.48)" opacity=".55">${crestSVG().replace(/<svg[^>]*>|<\/svg>/g, '').replace(/url\(#g-foil\)/g, '#ffeab0').replace(/stroke="#6b4210"/g,'stroke="none"')}</g></svg>`;
}


export function dividerSVG() {
  return `<svg class="divider" viewBox="0 0 220 24" aria-hidden="true">
   <g fill="none" stroke="url(#g-foil-h)" stroke-width="1.3" stroke-linecap="round">
    <path class="dr" pathLength="1" d="M4 12C30 12 40 4 62 12S88 20 100 12"/>
    <path class="dr" pathLength="1" d="M216 12C190 12 180 4 158 12S132 20 120 12"/></g>
   <path d="M110 4l6 8-6 8-6-8z" fill="url(#g-foil)" stroke="#6b4210" stroke-width=".4"/></svg>`;
}
// scalloped frame clip + gold outline (objectBoundingBox)
export function scallopPath(n = 20, r0 = .455, r1 = .5) {
  let d = '';
  const pt = (a, r) => [(.5 + Math.cos(a) * r).toFixed(4), (.5 + Math.sin(a) * r).toFixed(4)];
  for (let i = 0; i < n; i++) {
    const a0 = i / n * Math.PI * 2, a1 = (i + 1) / n * Math.PI * 2, am = (a0 + a1) / 2;
    const p0 = pt(a0, r0), p1 = pt(a1, r0), c = pt(am, r1 + .012);
    d += (i ? '' : `M${p0[0]} ${p0[1]}`) + `Q${c[0]} ${c[1]} ${p1[0]} ${p1[1]}`;
  }
  return d + 'Z';
}
export function lotusSVG() {
  const petal = (a, s) => `<path transform="rotate(${a} 30 46) scale(${s})" style="transform-origin:30px 46px" d="M30 46C20 36 22 20 30 8C38 20 40 36 30 46Z" fill="url(#g-lotus)" stroke="#a24a68" stroke-width=".5"/>`;
  return `<svg class="lotus" viewBox="0 0 60 60" aria-hidden="true">
   <defs><radialGradient id="g-lotus" cx=".5" cy=".9" r=".9"><stop offset="0" stop-color="#fff0c8"/><stop offset=".5" stop-color="#f4a9bd"/><stop offset="1" stop-color="#d7587f"/></radialGradient></defs>
   <ellipse cx="30" cy="50" rx="24" ry="5" fill="#fff1c4" opacity=".3"/>
   ${petal(-62, .86)}${petal(62, .86)}${petal(-34, .96)}${petal(34, .96)}${petal(0, 1.04)}
   <path d="M14 48Q30 56 46 48Q30 52 14 48Z" fill="#8a5a1c"/></svg>`;
}
export function candleSVG() {
  return `<svg class="candle" viewBox="0 0 40 120" aria-hidden="true">
   <defs><radialGradient id="g-glow"><stop offset="0" stop-color="#ffd27a" stop-opacity=".9"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient>
   <linearGradient id="g-wax" x1="0" x2="1"><stop offset="0" stop-color="#e9d5b0"/><stop offset=".4" stop-color="#fff6e0"/><stop offset="1" stop-color="#cdb184"/></linearGradient></defs>
   <circle class="glow" cx="20" cy="30" r="34" fill="url(#g-glow)"/>
   <rect x="9" y="42" width="22" height="70" rx="2" fill="url(#g-wax)"/><path d="M9 44Q20 50 31 44" fill="none" stroke="#bfa070" stroke-width=".8"/>
   <path d="M20 42V36" stroke="#3a2a1a" stroke-width="1.4"/>
   <path class="flame" d="M20 34C14 28 16 20 20 12C24 20 26 28 20 34Z" fill="#ffcf6b"/><path class="flame in" d="M20 33C17 29 18 24 20 19C22 24 23 29 20 33Z" fill="#fff4cf"/></svg>`;
}
