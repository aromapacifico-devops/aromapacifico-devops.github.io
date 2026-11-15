import '@fontsource/outfit/300.css';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import '@fontsource/outfit/900.css';
import '@fontsource/roboto-mono/500.css';
import '@fontsource/roboto-mono/700.css';
import './style.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import * as d from './data.js';

gsap.registerPlugin(ScrollTrigger);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const fmt = (n, dec = 0) => n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
const metric = (m) => `
  <div class="metric fade">
    <b>${m.pre || ''}<span data-count="${m.n}">${fmt(m.n)}</span>${m.u ? `<small>${m.u}</small>` : ''}</b>
    <span>${m.l}</span><i>${m.s}</i>
  </div>`;

/* ---------------------------------------------------------------- render */
function render() {
  $('#metrics').innerHTML = d.metrics.map(metric).join('');
  $('#compare').insertAdjacentHTML('beforeend', d.compare.map(([a, b]) => `<div class="cmp"><span>${a}</span><span>${b}</span></div>`).join(''));

  $('#jrStops').innerHTML = d.journey.map((j, i) => `<button type="button" role="tab" data-i="${i}"><span class="node">${i + 1}</span><b>${j.place}</b></button>`).join('');

  $('#layersNav').innerHTML = d.layers.map((l, i) => `<li><a href="#layer-${i}">${l.name}</a></li>`).join('');
  $('#layersList').innerHTML = d.layers.map((l, i) => `
    <article class="layer" id="layer-${i}">
      <h3 class="fade">${l.title}</h3>
      <p class="fade">${l.text}</p>
      <div class="layer-facts fade">${l.facts.map(([b, s]) => `<div><b>${b}</b><span>${s}</span></div>`).join('')}</div>
      <figure class="diagram" data-zoom>
        <div class="inner"><img src="img/diagrams/${l.img}.svg" alt="Diagram: ${l.cap}" loading="lazy"></div>
        <figcaption>${l.cap}</figcaption>
      </figure>
    </article>`).join('');

  $('#failures').insertAdjacentHTML('beforeend', d.failures.map(([a, b, c]) => `<div class="fail-row"><b>${a}</b><span>${b}</span><span class="lost${/^No/.test(c) ? ' none' : ''}">${c}</span></div>`).join(''));

  $('#pipeSteps').innerHTML = d.pipeline.map((p, i) => `<li><span class="node">${i + 1}</span><div><h3>${p.t}</h3><p>${p.p}</p></div></li>`).join('');
  $('#proof').innerHTML = d.proof.map(metric).join('');
  const maxH = Math.max(...d.boxes.map((b) => b[2]));
  $('#boxes').innerHTML = d.boxes.map(([c, n, h]) => `<div class="box"><span class="mono">${c}</span><b>${n}</b><div class="box-t"><i data-w="${h / maxH}"></i></div><span class="mono">${h} h</span></div>`).join('');
  $('#modules').innerHTML = d.modules.map(([n, v, r, t]) => `<a class="mod" href="${d.links.org}/${n}" target="_blank" rel="noopener"><div><b class="mono">${n}</b><p>${t}</p></div><div class="mod-n"><span class="mono">${v}</span><i>${r} resources</i></div></a>`).join('');
  $('#unproven').innerHTML = d.unproven.map(([a, b]) => `<div><b>${a}</b><span>${b}</span></div>`).join('');

  const top = d.yearShare[0][1], total = d.yearShare.reduce((s, x) => s + x[1], 0);
  $('#yearBars').innerHTML = d.yearShare.map(([l, v]) => `<div class="bar"><span>${l}</span><div class="bar-t"><i data-w="${Math.max(v / top, 0.004)}"></i></div><span class="mono">${fmt(v)}</span><span class="mono pct">${(v / total * 100).toFixed(v / total < 0.01 ? 1 : 0)}%</span></div>`).join('');
  $('#costs').innerHTML = d.costs.map((c) => `<article class="cost fade"><span class="cost-l">${c.l}</span><div class="cost-v mono">${c.v}</div><p class="cost-n">${c.note}</p></article>`).join('');

  $('#viewTabs').innerHTML = d.views.map((v, i) => `<button type="button" role="tab" data-i="${i}">${v.name}</button>`).join('');
  $('#palette').innerHTML = d.palette.map(([n, h, c, u]) => `<div class="sw" style="background:${h};color:${c}"><span>${n}</span><i>${u}</i><b class="mono">${h}</b></div>`).join('');
  $('#badges').innerHTML = d.badges.map(([k, n, p]) => `<div class="bd"><span class="badge" data-state="${k}">${n}</span><span>${p}</span></div>`).join('');
  $('#alerts').innerHTML = d.alerts.map(([k, t, p]) => `<div class="al" data-level="${k}"><b lang="es">${t}</b><span>${p}</span></div>`).join('');

  $('#ev').innerHTML = d.evidence.map((e) => `<a class="ev-card fade" href="${e.href}" target="_blank" rel="noopener"><b class="mono"><span data-count="${e.n}">${e.n}</span></b><h3>${e.l}</h3><p>${e.s}</p></a>`).join('');
  $('#gallery').innerHTML = d.diagrams.map(([f, t, q]) => `
    <figure class="g" data-zoom>
      <div class="g-img"><img src="img/diagrams/${f}.svg" alt="Diagram: ${t}. ${q}" loading="lazy"></div>
      <figcaption><span class="mono">${f.slice(0, 2)}</span><b>${t}</b><i>${q}</i></figcaption>
    </figure>`).join('');
  $('#repos').innerHTML = d.repos.map(([n, t, h]) => `<a class="repo" href="${h}" target="_blank" rel="noopener"><b class="mono">${n}</b><span>${t}</span></a>`).join('');

  $('#outroArch').href = d.links.overview;
  $('#outroOrg').href = d.links.org;
}

/* ---------------------------------------------------------------- scroll and navigation */
let lenis;
function setupScroll() {
  if (!reduce) {
    lenis = new Lenis({ lerp: 0.09 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const t = a.getAttribute('href') === '#top' ? 0 : $(a.getAttribute('href'));
    if (t === null) return;
    e.preventDefault();
    lenis ? lenis.scrollTo(t, { offset: t ? -96 : 0, duration: 1.4 }) : (t ? t.scrollIntoView() : scrollTo(0, 0));
  });

  const nav = $('.nav');
  let last = 0;
  const onScroll = (y) => {
    nav.classList.toggle('scrolled', y > 24);
    nav.classList.toggle('hide', y > 400 && y > last);
    last = y;
  };
  lenis ? lenis.on('scroll', ({ scroll }) => onScroll(scroll)) : addEventListener('scroll', () => onScroll(scrollY));

  $$('.nav-links a').forEach((a) => {
    ScrollTrigger.create({ trigger: $(a.getAttribute('href')), start: 'top 50%', end: 'bottom 50%', onToggle: (s) => a.classList.toggle('on', s.isActive) });
  });
  ScrollTrigger.create({ trigger: '#code', start: 'top 60px', end: 'bottom 60px', onToggle: (s) => nav.classList.toggle('on-dark', s.isActive) });
}

/* ---------------------------------------------------------------- reveals */
function count(el, dur = 1.6) {
  const n = +el.dataset.count, o = { v: 0 };
  gsap.to(o, { v: n, duration: dur, ease: 'power3.out', onUpdate: () => { el.textContent = fmt(o.v); } });
}

function setupReveals() {
  const bars = (sel) => $$(sel).forEach((b, i) => gsap.to(b, { scaleX: +b.dataset.w, duration: 1.4, ease: 'expo.out', delay: reduce ? 0 : 0.15 + i * 0.06 }));
  if (reduce) { bars('.box-t i'); bars('.bar-t i'); return; }

  $$('.fade, .rise').forEach((el) => {
    if (el.closest('.hero')) return;
    gsap.set(el, { opacity: 0, y: 28 });
    ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' }) });
  });

  $$('.cmp, .fail-row, .g, .repo').forEach((r) => {
    gsap.set(r, { opacity: 0, y: 20 });
    ScrollTrigger.create({ trigger: r, start: 'top 94%', once: true, onEnter: () => gsap.to(r, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }) });
  });

  $$('.diagram, .fig-img').forEach((f) => {
    gsap.fromTo(f, { clipPath: 'inset(10% 5% 10% 5% round 14px)', opacity: 0 }, { clipPath: 'inset(0% 0% 0% 0% round 14px)', opacity: 1, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: f, start: 'top 90%', once: true } });
  });

  ScrollTrigger.create({ trigger: '#proof', start: 'top 88%', once: true, onEnter: () => $$('#proof [data-count]').forEach((el) => count(el, 1.4)) });
  ScrollTrigger.create({ trigger: '#ev', start: 'top 88%', once: true, onEnter: () => $$('#ev [data-count]').forEach((el) => count(el, 1.4)) });
  ScrollTrigger.create({ trigger: '#boxes', start: 'top 85%', once: true, onEnter: () => bars('.box-t i') });
  ScrollTrigger.create({ trigger: '#yearBars', start: 'top 85%', once: true, onEnter: () => bars('.bar-t i') });
}

function setupLayers() {
  const links = $$('#layersNav a');
  $$('.layer').forEach((l, i) => {
    ScrollTrigger.create({ trigger: l, start: 'top 55%', end: 'bottom 55%', onToggle: (s) => { if (s.isActive) links.forEach((a, j) => a.classList.toggle('on', j === i)); } });
  });
  links[0].classList.add('on');
  gsap.to('#layersBar', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '#layersList', start: 'top 55%', end: 'bottom 55%', scrub: true } });
}

function setupPipeline() {
  const steps = $$('#pipeSteps li');
  if (reduce) { steps.forEach((s) => s.classList.add('on')); gsap.set('#pipeFill', { scaleX: 1 }); return; }
  ScrollTrigger.create({
    trigger: '#pipe', start: 'top 80%', end: 'top 35%', scrub: true,
    onUpdate: (s) => {
      gsap.set('#pipeFill', { scaleX: s.progress });
      $('#pipeDot').style.left = s.progress * 100 + '%';
      steps.forEach((st, i) => st.classList.toggle('on', i / (steps.length - 1) <= s.progress + 0.01));
    }
  });
}

/* ---------------------------------------------------------------- hero label */
function setupTag() {
  // Decorative code pattern with three finder squares, drawn from a fixed seed
  const N = 21, finder = (r, c) => { const a = r < 7 ? r : r - (N - 7), b = c < 7 ? c : c - (N - 7); return a === 0 || a === 6 || b === 0 || b === 6 || (a > 1 && a < 5 && b > 1 && b < 5); };
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  let cells = '';
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const corner = (r < 7 && c < 7) || (r < 7 && c >= N - 7) || (r >= N - 7 && c < 7);
    const gap = (r < 8 && c < 8) || (r < 8 && c >= N - 8) || (r >= N - 8 && c < 8);
    cells += `<i${(corner ? finder(r, c) : !gap && rnd() < 0.5) ? ' class="on"' : ''}></i>`;
  }
  $('#tagQr').innerHTML = cells;

  const state = $('#tagState'), states = ['In preparation', 'In transit', 'Accepted at the center', 'In transit', 'Delivered'];
  if (reduce) { state.textContent = states[1]; return; }
  let n = 0;
  setInterval(() => {
    n = (n + 1) % states.length;
    gsap.to(state, { opacity: 0, duration: 0.25, onComplete: () => { state.textContent = states[n]; gsap.to(state, { opacity: 1, duration: 0.35 }); } });
  }, 2400);
}

/* ---------------------------------------------------------------- journey */
function setupJourney() {
  const stops = $$('#jrStops button'), panel = $('#jrPanel');
  let cur = -1, auto = true;
  const go = (i) => {
    if (i === cur) return;
    cur = i;
    const j = d.journey[i];
    stops.forEach((b, k) => { b.classList.toggle('on', k === i); b.classList.toggle('done', k < i); b.setAttribute('aria-selected', k === i); });
    gsap.to('#jrFill', { scaleX: i / (stops.length - 1), duration: reduce ? 0 : 0.8, ease: 'expo.out' });
    panel.innerHTML = `
      <div class="jr-copy">
        <span class="badge" data-state="${j.state}">${j.badge}</span>
        <h3>${j.title}</h3>
        <p>${j.text}</p>
      </div>
      <div class="jr-side">
        <div class="jr-off"><span>${i === 4 ? 'Under load' : 'With no signal'}</span><p>${j.off}</p></div>
        <div class="jr-state"><span>State of the sack</span><b class="mono">${j.code}</b></div>
      </div>`;
    if (!reduce) gsap.from(panel.children, { opacity: 0, y: 16, duration: 0.7, stagger: 0.08, ease: 'power3.out' });
  };
  stops.forEach((b, i) => b.addEventListener('click', () => { auto = false; go(i); }));
  go(0);
  if (reduce) return;
  ScrollTrigger.create({
    trigger: '.jr', start: 'top 75%', end: 'top 15%', scrub: true,
    onUpdate: (s) => { if (auto) go(Math.min(stops.length - 1, Math.floor(s.progress * stops.length))); }
  });
}

/* ---------------------------------------------------------------- outage demo */
function setupOutage() {
  const range = $('#oRange'), cells = $('#oCells');
  cells.innerHTML = Array.from({ length: 36 }, (_, i) => `<i style="--i:${i}"></i>`).join('');
  const cs = $$('i', cells);
  const update = () => {
    const h = +range.value, sent = Math.min(h, 23), drop = h - sent;
    $('#oHours').textContent = h;
    $('#oSent').textContent = sent;
    $('#oDrop').textContent = drop;
    $('#oDelay').textContent = `${sent + 1} h`;
    // oldest reading on the left, the readings of the last 23 hours survive
    cs.forEach((c, i) => { c.className = i >= h ? 'c-idle' : i < drop ? 'c-drop' : 'c-sent'; });
    const badge = $('#oBadge'), note = $('#oNote');
    if (h === 0) {
      badge.dataset.state = 'ok'; badge.textContent = 'Signal is up';
      note.textContent = 'The node connects once an hour, so a reading reaches the platform within 1 hour.';
    } else if (drop === 0) {
      badge.dataset.state = 'ok'; badge.textContent = 'Nothing is lost';
      note.textContent = 'Every reading waits in the buffer and drains oldest first when the signal returns. An alert from a buffered reading goes out then, with the time of the reading.';
    } else {
      badge.dataset.state = 'warn'; badge.textContent = 'Oldest readings expire';
      note.textContent = 'Records of 24 hours or more are deleted before the node connects. Each one adds to a counter, so the platform knows exactly what is missing.';
    }
  };
  range.addEventListener('input', update);
  update();
}

/* ---------------------------------------------------------------- views */
function setupViews() {
  const tabs = $$('#viewTabs button');
  const go = (i) => {
    const v = d.views[i];
    tabs.forEach((b, k) => { b.classList.toggle('on', k === i); b.setAttribute('aria-selected', k === i); });
    $('#viewText').textContent = `${v.text} ${v.n} screens designed.`;
    $('#shots').innerHTML = v.shots.map(([n, cap]) => `<figure class="shot" data-zoom><div class="phone"><img src="img/screens/${v.k}-${n}.webp" alt="${v.name} screen: ${cap}" loading="lazy"></div><figcaption>${cap}</figcaption></figure>`).join('')
      + (v.wide ? `<figure class="shot wide" data-zoom><div class="phone"><img src="img/screens/${v.k}-${v.wide[0]}.webp" alt="${v.name} screen: ${v.wide[1]}" loading="lazy"></div><figcaption>${v.wide[1]}</figcaption></figure>` : '');
    if (!reduce) gsap.from('#shots .shot', { opacity: 0, y: 24, duration: 0.8, stagger: 0.07, ease: 'power3.out' });
  };
  tabs.forEach((b, i) => b.addEventListener('click', () => go(i)));
  go(0);
}

/* ---------------------------------------------------------------- lightbox */
function setupLightbox() {
  const lb = $('#lightbox'), sc = $('.lb-scroll'), im = $('.lb-scroll img');
  const close = () => { lb.hidden = true; lenis && lenis.start(); };
  document.addEventListener('click', (e) => {
    const f = e.target.closest('[data-zoom]');
    if (!f) return;
    const i = $('img', f); im.src = i.src; im.alt = i.alt;
    sc.classList.remove('zoom'); sc.classList.toggle('tall', i.naturalHeight > i.naturalWidth);
    lb.hidden = false; lenis && lenis.stop();
  });
  sc.addEventListener('click', (e) => { if (e.target === sc) close(); else sc.classList.toggle('zoom'); });
  $('.lb-close').addEventListener('click', close);
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lb.hidden) close(); });
}

/* ---------------------------------------------------------------- intro */
function intro() {
  const pre = $('#pre'), rises = $$('.hero .rise, .hero .fade');
  if (reduce) { pre.remove(); document.body.classList.remove('is-loading'); return; }
  gsap.set(rises, { opacity: 0, y: 28 });
  gsap.set('.nav', { yPercent: -100 });
  gsap.set('.pre-band i', { scaleX: 0 });
  gsap.set('.pre-mark', { opacity: 0, y: 12 });

  gsap.timeline()
    .to('.pre-mark', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
    .to('.pre-band i', { scaleX: 1, duration: 0.7, ease: 'expo.inOut', stagger: 0.12 }, '-=0.3')
    .to(pre, { opacity: 0, duration: 0.6, ease: 'power2.out', delay: 0.15, onStart: () => document.body.classList.remove('is-loading') })
    .to(rises, { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', stagger: 0.09 }, '-=0.3')
    .to('.nav', { yPercent: 0, duration: 1, ease: 'expo.out' }, '-=1')
    .add(() => { pre.remove(); $$('#metrics [data-count]').forEach((el) => count(el)); });
}

/* ---------------------------------------------------------------- start */
render();
setupScroll();
setupLightbox();
setupTag();
setupOutage();
setupViews();

document.fonts.ready.then(() => {
  setupReveals();
  intro();
  setupJourney();
  setupLayers();
  setupPipeline();
  ScrollTrigger.refresh();
  addEventListener('load', () => ScrollTrigger.refresh());
  // Lazy images change the height of the page, so trigger positions are measured again
  let t;
  document.addEventListener('load', (e) => { if (e.target.tagName === 'IMG') { clearTimeout(t); t = setTimeout(() => ScrollTrigger.refresh(), 200); } }, true);
});
