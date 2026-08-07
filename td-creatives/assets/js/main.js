/* ═══════════════════════════════════════════════════════════════════
   TD Creatives — site behavior (vanilla JS, no dependencies)
   Every feature checks for its elements first, so the script is safe
   to load on every page and degrades gracefully if markup is absent.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Mobile nav toggle ─────────────────────────────────────────── */
  var toggle = document.querySelector('.pp-nav__toggle');
  var links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // Close the menu when a link is chosen (mobile)
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* ── Sticky nav: scrolled state, progress bar, active section ─── */
  var nav = document.querySelector('.pp-nav');
  var bar = document.querySelector('.pp-nav__progress');
  var anchorLinks = nav ? [].slice.call(nav.querySelectorAll('.pp-nav__links a[href^="#"]')) : [];
  var sectionIds = ['services', 'who-we-serve', 'work', 'why', 'results'];
  var raf = null;
  function updateNav() {
    raf = null;
    if (!nav) return;
    nav.classList.toggle('scrolled', window.scrollY > 24);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0) + '%';
    var act = null;
    for (var i = 0; i < sectionIds.length; i++) {
      var el = document.getElementById(sectionIds[i]);
      if (el && el.getBoundingClientRect().top < window.innerHeight * 0.45) act = sectionIds[i];
    }
    anchorLinks.forEach(function (a) {
      var on = a.getAttribute('href') === '#' + act;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  function onScroll() { if (!raf) raf = requestAnimationFrame(updateNav); }
  if (nav && !nav.classList.contains('pp-nav--solid')) {
    updateNav();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }

  /* ── Scroll reveal ─────────────────────────────────────────────── */
  var revealEls = document.querySelectorAll('.pp-reveal');
  if (revealEls.length) {
    if (!('IntersectionObserver' in window) || reducedMotion) {
      revealEls.forEach(function (el) { el.classList.add('in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ── Magnetic buttons ──────────────────────────────────────────── */
  if (!reducedMotion) {
    var cur = null;
    var resetMag = function () { if (cur) { cur.style.transform = ''; cur = null; } };
    document.addEventListener('pointermove', function (e) {
      var b = e.target && e.target.closest ? e.target.closest('.pp-btn') : null;
      if (cur && cur !== b) resetMag();
      if (!b) return;
      cur = b;
      var r = b.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      var dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      b.style.transform = 'translate(' + (dx * 8).toFixed(1) + 'px, ' + (dy * 6 - 2).toFixed(1) + 'px)';
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', resetMag);
  }

  /* ── Count-up numbers: <span data-count-to="120" data-decimals="1"> ── */
  var counters = document.querySelectorAll('[data-count-to]');
  if (counters.length && 'IntersectionObserver' in window && !reducedMotion) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        var el = e.target;
        var to = parseFloat(el.getAttribute('data-count-to')) || 0;
        var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
        var dur = 1700, t0 = performance.now();
        (function tick(t) {
          var p = Math.min(1, (t - t0) / dur);
          var v = to * (1 - Math.pow(1 - p, 3));
          el.textContent = dec ? v.toFixed(dec) : Math.round(v).toLocaleString();
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(function (el) {
      var to = parseFloat(el.getAttribute('data-count-to')) || 0;
      var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
      el.textContent = dec ? to.toFixed(dec) : Math.round(to).toLocaleString();
    });
  }

  /* ── Result bars: .pp-result__bar i[data-bar="78"] ─────────────── */
  var bars = document.querySelectorAll('.pp-result__bar i[data-bar]');
  if (bars.length && 'IntersectionObserver' in window) {
    var bio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        bio.unobserve(e.target);
        e.target.style.width = e.target.getAttribute('data-bar') + '%';
      });
    }, { threshold: 0.3 });
    bars.forEach(function (b) { bio.observe(b); });
  } else {
    bars.forEach(function (b) { b.style.width = b.getAttribute('data-bar') + '%'; });
  }

  /* ── Service card glow + tilt ──────────────────────────────────── */
  document.querySelectorAll('.pp-service').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      if (reducedMotion) return;
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty('--sry', (px * 5).toFixed(2) + 'deg');
      card.style.setProperty('--srx', (-py * 4).toFixed(2) + 'deg');
    });
    card.addEventListener('pointerleave', function () {
      card.style.setProperty('--sry', '0deg');
      card.style.setProperty('--srx', '0deg');
    });
  });

  /* ── Hero browser tilt ─────────────────────────────────────────── */
  var visual = document.querySelector('.pp-hero__visual');
  var tilt = document.querySelector('.pp-tilt');
  if (visual && tilt && !reducedMotion) {
    visual.addEventListener('pointermove', function (e) {
      var r = visual.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;
      var py = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.setProperty('--ty', (px * 11).toFixed(2) + 'deg');
      tilt.style.setProperty('--tx', (-py * 9).toFixed(2) + 'deg');
    });
    visual.addEventListener('pointerleave', function () {
      tilt.style.setProperty('--ty', '0deg');
      tilt.style.setProperty('--tx', '0deg');
    });
  }

  /* ── Hero blob parallax ────────────────────────────────────────── */
  var blobs = document.querySelectorAll('.pp-hero .pp-blob');
  if (blobs.length && !reducedMotion) {
    var braf = null;
    window.addEventListener('scroll', function () {
      if (braf) return;
      braf = requestAnimationFrame(function () {
        var y = window.scrollY;
        blobs.forEach(function (b, i) { b.style.transform = 'translate3d(0,' + (y * (0.06 + i * 0.04)) + 'px,0)'; });
        braf = null;
      });
    }, { passive: true });
  }

  /* ── Portfolio filter chips ────────────────────────────────────── */
  var chips = document.querySelectorAll('.pp-filter .pp-chip');
  var cases = document.querySelectorAll('.pp-case[data-filter]');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var k = chip.getAttribute('data-key');
      chips.forEach(function (c) { c.classList.toggle('active', c === chip); });
      cases.forEach(function (card) {
        card.classList.toggle('hide', k !== 'all' && card.getAttribute('data-filter') !== k);
      });
    });
  });

  /* ── Testimonial carousel ──────────────────────────────────────── */
  var carousel = document.querySelector('.pp-carousel');
  if (carousel) {
    var track = carousel.querySelector('.pp-carousel__track');
    var slides = carousel.querySelectorAll('.pp-tslide');
    var dots = carousel.querySelectorAll('.pp-carousel__dot');
    var prev = carousel.querySelector('[data-dir="prev"]');
    var next = carousel.querySelector('[data-dir="next"]');
    var idx = 0, n = slides.length, paused = false;
    var setIdx = function (i) {
      idx = ((i % n) + n) % n;
      track.style.transform = 'translateX(-' + idx * 100 + '%)';
      dots.forEach(function (d, j) { d.classList.toggle('active', j === idx); });
    };
    if (prev) prev.addEventListener('click', function () { setIdx(idx - 1); });
    if (next) next.addEventListener('click', function () { setIdx(idx + 1); });
    dots.forEach(function (d, j) { d.addEventListener('click', function () { setIdx(j); }); });
    carousel.addEventListener('mouseenter', function () { paused = true; });
    carousel.addEventListener('mouseleave', function () { paused = false; });
    carousel.addEventListener('focusin', function () { paused = true; });
    carousel.addEventListener('focusout', function () { paused = false; });
    if (!reducedMotion) setInterval(function () { if (!paused) setIdx(idx + 1); }, 5500);
  }

  /* ── Live-sites explorer ───────────────────────────────────────── */
  var explorer = document.getElementById('explore');
  if (explorer) {
    var tabs = explorer.querySelectorAll('.pp-explorer__tab');
    var shots = explorer.querySelectorAll('.pp-bigbrowser__shot');
    var urlEl = explorer.querySelector('.pp-bigbrowser__url span');
    var stage = explorer.querySelector('.pp-explorer__stage');
    var eIdx = 0, hovered = false;
    var setSite = function (i) {
      eIdx = i % tabs.length;
      tabs.forEach(function (t, j) { t.classList.toggle('active', j === eIdx); });
      shots.forEach(function (s, j) { s.classList.toggle('active', j === eIdx); });
      if (urlEl) urlEl.textContent = tabs[eIdx].getAttribute('data-url');
    };
    tabs.forEach(function (t, j) { t.addEventListener('click', function () { setSite(j); }); });
    if (stage) {
      stage.addEventListener('mouseenter', function () { hovered = true; });
      stage.addEventListener('mouseleave', function () { hovered = false; });
    }
    if (!reducedMotion) setInterval(function () { if (!hovered) setSite(eIdx + 1); }, 5000);
  }

  /* ── After Hours CallBot ROI calculator ────────────────────────── */
  var calc = document.getElementById('calculator');
  if (calc) {
    var $ = function (id) { return document.getElementById(id); };
    var inputs = { calls: $('roi-calls'), rate: $('roi-rate'), value: $('roi-value') };
    var fmt = function (v) { return '$' + Math.round(v).toLocaleString(); };
    var recompute = function () {
      var calls = +inputs.calls.value, rate = +inputs.rate.value, val = +inputs.value.value;
      var captured = Math.round(calls * 4.33);
      var bookings = Math.round(captured * rate / 100);
      var revenue = bookings * val;
      var cost = 269, net = revenue - cost;
      $('roi-calls-out').textContent = calls + ' calls';
      $('roi-rate-out').textContent = rate + '%';
      $('roi-value-out').textContent = fmt(val);
      $('roi-revenue').textContent = fmt(revenue);
      $('roi-detail').textContent = 'from ' + captured + ' captured calls \u2192 ' + bookings + ' new bookings';
      $('roi-net').textContent = '+' + fmt(net);
      $('roi-annual').textContent = fmt(net * 12);
      $('roi-roi').textContent = Math.round(net / cost * 100).toLocaleString() + '%';
    };
    if (inputs.calls && inputs.rate && inputs.value) {
      Object.keys(inputs).forEach(function (k) { inputs[k].addEventListener('input', recompute); });
      recompute();
    }
  }

  /* ── Contact form: validate → POST to FormSubmit (AJAX) → thank-you.
       Endpoint is set on the form's data-endpoint attribute in contact.html.
       If the network call fails, we fall back to a prefilled mailto so a
       lead is never silently lost. ─────────────────────────────────────── */
  var form = document.getElementById('contact-form');
  if (form) {
    var TO = form.getAttribute('data-email') || 'hello@tdcreativesagency.com';
    var ENDPOINT = form.getAttribute('data-endpoint') || ('https://formsubmit.co/ajax/' + TO);
    var btn = form.querySelector('.pp-leadform__submit');
    var btnHTML = btn ? btn.innerHTML : '';
    var status = document.createElement('div');
    status.className = 'pp-leadform__status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.style.cssText = 'margin-top:12px;font-size:14px;line-height:1.5;display:none';
    if (btn && btn.parentNode) { btn.parentNode.insertBefore(status, btn.nextSibling); }

    var say = function (msg, color) {
      status.innerHTML = msg;
      status.style.color = color || '#AEB2C9';
      status.style.display = 'block';
    };

    var buildLines = function (d, needs) {
      return [
        'Name: ' + d.get('name'),
        'Business Name: ' + (d.get('business') || '\u2014'),
        'Email: ' + d.get('email'),
        'Phone: ' + (d.get('phone') || '\u2014'),
        'Website: ' + (d.get('website') || '\u2014'),
        'Needs: ' + (needs.join(', ') || '\u2014'),
        '',
        'What the business does: ' + (d.get('does') || '\u2014'),
        'Products / services: ' + (d.get('offers') || '\u2014'),
        'Target audience: ' + (d.get('audience') || '\u2014'),
        'What makes it unique: ' + (d.get('unique') || '\u2014')
      ];
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var hp = form.querySelector('[name="company_website_url"]');
      if (hp && hp.value) return; // honeypot — silently drop bots
      if (!form.checkValidity()) { form.reportValidity(); return; }

      var d = new FormData(form);
      var needs = [];
      form.querySelectorAll('input[name="needs"]:checked').forEach(function (c) { needs.push(c.value); });
      var subject = 'New project inquiry \u2014 ' + (d.get('business') || d.get('name'));

      var payload = new FormData();
      payload.append('Name', d.get('name') || '');
      payload.append('Business Name', d.get('business') || '');
      payload.append('Email', d.get('email') || '');
      payload.append('Phone', d.get('phone') || '');
      payload.append('Current Website', d.get('website') || '');
      payload.append('Needs', needs.join(', '));
      payload.append('What the business does', d.get('does') || '');
      payload.append('Products / services', d.get('offers') || '');
      payload.append('Target audience', d.get('audience') || '');
      payload.append('What makes it unique', d.get('unique') || '');
      payload.append('_subject', subject);
      payload.append('_template', 'table');
      payload.append('_captcha', 'false');
      if (d.get('email')) { payload.append('_replyto', d.get('email')); }

      if (btn) { btn.disabled = true; btn.innerHTML = 'Sending\u2026'; }
      say('Sending your details\u2026');

      fetch(ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: payload
      }).then(function (res) {
        if (!res.ok) { throw new Error('HTTP ' + res.status); }
        return res.json().catch(function () { return {}; });
      }).then(function (data) {
        // FormSubmit answers 200 even when it refuses (e.g. form not activated)
        if (data && String(data.success) === 'false') {
          throw new Error(data.message || 'Endpoint rejected the submission');
        }
        try { if (window.gtag) { gtag('event', 'generate_lead', { form: 'contact' }); } } catch (err) {}
        window.location.href = 'thank-you.html';
      }).catch(function () {
        if (btn) { btn.disabled = false; btn.innerHTML = btnHTML; }
        say('We couldn\u2019t send that automatically. <a href="mailto:' + TO +
            '?subject=' + encodeURIComponent(subject) +
            '&body=' + encodeURIComponent(buildLines(d, needs).join('\n')) +
            '">Click here to email it to us instead</a> \u2014 or call 805-225-4843.', '#FFB4B4');
      });
    });
  }
})();
