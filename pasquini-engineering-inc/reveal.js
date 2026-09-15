// Site-wide motion: scroll reveals, stat count-ups, rule draw-ins, card lift, hero parallax.
(function () {
  if (window.__peReveal) return; window.__peReveal = true;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  const EASE = 'cubic-bezier(.22,1,.36,1)';
  const io = new IntersectionObserver(entries => {
    for (const e of entries) if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  function show(el) {
    el.style.opacity = '1'; el.style.transform = 'none';
    if (el.__peCount) countUp(el);
    el.querySelectorAll('[data-pe-rule]').forEach(r => { r.style.transform = 'scaleX(1)'; });
  }
  function prep(el, i) {
    if (el.__pe) return; el.__pe = true;
    const cs = getComputedStyle(el);
    if (cs.animationName !== 'none' || cs.position === 'fixed' || cs.position === 'absolute') return;
    el.style.opacity = '0'; el.style.transform = 'translateY(26px)';
    el.style.transition = `opacity .7s ${EASE} ${i * 0.08}s, transform .8s ${EASE} ${i * 0.08}s`;
    const t = (el.textContent || '').trim();
    if (/^[\d,]{1,7}\+?$/.test(t) && el.children.length === 0 && parseFloat(cs.fontSize) >= 26) el.__peCount = t;
    io.observe(el);
  }
  function countUp(el) {
    const raw = el.__peCount; el.__peCount = null;
    const n = parseInt(raw.replace(/[^\d]/g, ''), 10); if (!n || n < 5) return;
    const suffix = raw.endsWith('+') ? '+' : ''; const comma = raw.includes(',');
    const t0 = performance.now(), dur = 1400;
    const step = t => { const p = Math.min(1, (t - t0) / dur); const v = Math.round(n * (1 - Math.pow(1 - p, 3))); el.textContent = (comma ? v.toLocaleString('en-US') : String(v)) + suffix; if (p < 1) requestAnimationFrame(step); else el.textContent = raw; };
    requestAnimationFrame(step);
  }
  function scan(root) {
    root.querySelectorAll('section').forEach(sec => {
      if (sec.__peScanned) return; sec.__peScanned = true;
      const kids = [...sec.children];
      // if the section has a single wrapper, animate the wrapper's children instead
      const targets = (kids.length === 1 && kids[0].children.length > 1) ? [...kids[0].children] : kids;
      let i = 0;
      targets.forEach(el => {
        const inGrid = getComputedStyle(el).display.includes('grid') && el.children.length > 1 && el.children.length <= 12;
        if (inGrid) { [...el.children].forEach((c, j) => prep(c, j)); el.__pe = true; } else prep(el, i++);
      });
      // hero parallax
      if (/url\(/.test(sec.style.backgroundImage || sec.getAttribute('style') || '')) parallax.push(sec);
    });
    // hairline rules draw in
    root.querySelectorAll('span[style*="height:1px"], span[style*="height: 1px"]').forEach(r => {
      if (r.__peR) return; r.__peR = true; r.setAttribute('data-pe-rule', '');
      r.style.transformOrigin = 'left center'; r.style.transform = 'scaleX(0)'; r.style.transition = `transform .9s ${EASE} .2s`;
      if (!r.closest('[style*="opacity: 0"]')) { setTimeout(() => { r.style.transform = 'scaleX(1)'; }, 300); }
    });
    // card lift
    root.querySelectorAll('a[style*="flex-direction:column"], a[style*="flex-direction: column"]').forEach(a => {
      if (a.__peL) return; a.__peL = true;
      a.addEventListener('mouseenter', () => { a.style.transition = (a.style.transition ? a.style.transition + ', ' : '') + `transform .35s ${EASE}, box-shadow .35s ${EASE}`; a.style.transform = 'translateY(-6px)'; a.style.boxShadow = '0 18px 40px rgba(30,42,53,0.14)'; });
      a.addEventListener('mouseleave', () => { a.style.transform = 'translateY(0)'; a.style.boxShadow = 'none'; });
    });
    // images: gentle zoom-in on reveal
    root.querySelectorAll('section img').forEach(img => {
      if (img.__peI) return; img.__peI = true;
      if (img.height < 120 || img.closest('a')) return;
      img.style.transition = `transform 1.4s ${EASE}`; img.style.transform = 'scale(1.04)';
      const o = new IntersectionObserver(es => { if (es[0].isIntersecting) { img.style.transform = 'scale(1)'; o.disconnect(); } }, { threshold: 0.2 }); o.observe(img);
    });
  }
  const parallax = [];
  let ticking = false;
  addEventListener('scroll', () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      for (const sec of parallax) {
        const r = sec.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) continue;
        const y = Math.round(r.top * -0.18);
        sec.style.backgroundPosition = `center calc(50% + ${y}px)`;
      }
    });
  }, { passive: true });
  const run = () => scan(document);
  const mo = new MutationObserver(() => { clearTimeout(mo.t); mo.t = setTimeout(run, 120); });
  const start = () => { run(); mo.observe(document.body, { childList: true, subtree: true }); };
  document.body ? start() : addEventListener('DOMContentLoaded', start);
})();
