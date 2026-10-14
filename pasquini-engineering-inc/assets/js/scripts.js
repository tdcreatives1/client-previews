/*
 * Pasquini Engineering, Inc. — site scripts
 * Vanilla JS, no dependencies. Loaded with `defer` on every page.
 *
 *  1. Mobile navigation toggle
 *  2. Scroll motion (reveals, count-ups, rule draw-ins, card lift, image settle, hero parallax)
 *  3. Home · scroll-driven 3D build sequence   (index.html only)
 *  4. Projects · category filter + plan/built compare sliders   (projects.html only)
 *  5. Chat agent mock (lead qualifier) — replace with GoHighLevel embed at launch
 *
 * Every module checks for its markup first, so this one file is safe on every page.
 * All motion is skipped when the visitor has "reduce motion" enabled.
 */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EASE = 'cubic-bezier(.22,1,.36,1)';
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

  /* ------------------------------------------------------------------
   * 1. Mobile navigation
   * ------------------------------------------------------------------ */
  function initNav() {
    var btn = $('[data-js="nav-toggle"]');
    var nav = $('#site-nav');
    if (!btn || !nav) return;
    function set(open) {
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      nav.classList.toggle('is-open', open);
    }
    btn.addEventListener('click', function () { set(btn.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { set(false); btn.focus(); }
    });
    window.matchMedia('(min-width: 961px)').addEventListener('change', function (m) { if (m.matches) set(false); });
  }

  /* ------------------------------------------------------------------
   * 2. Scroll motion
   *    - Section children fade/slide up (26px, .7s/.8s, 80ms stagger)
   *    - Grid children stagger individually
   *    - Big numbers ("9,000+", "30+") count up over 1.4s, ease-out cubic
   *    - [data-rule] hairlines draw in from the left
   *    - [data-lift] cards rise 6px with a soft shadow on hover
   *    - Section photos settle from scale(1.04) to 1
   *    - [data-parallax] backgrounds drift at 18% of scroll speed
   * ------------------------------------------------------------------ */
  function initMotion() {
    if (reduce) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { show(e.target); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    function show(el) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      if (el.__peCount) countUp(el);
      $$('[data-rule]', el).forEach(function (r) { r.style.transform = 'scaleX(1)'; });
    }

    function prep(el, i) {
      if (el.__pe) return; el.__pe = true;
      var cs = getComputedStyle(el);
      if (cs.animationName !== 'none' || cs.position === 'fixed' || cs.position === 'absolute') return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(26px)';
      el.style.transition = 'opacity .7s ' + EASE + ' ' + (i * 0.08) + 's, transform .8s ' + EASE + ' ' + (i * 0.08) + 's';
      var t = (el.textContent || '').trim();
      if (/^[\d,]{1,7}\+?$/.test(t) && el.children.length === 0 && parseFloat(cs.fontSize) >= 26) el.__peCount = t;
      io.observe(el);
    }

    function countUp(el) {
      var raw = el.__peCount; el.__peCount = null;
      var n = parseInt(raw.replace(/[^\d]/g, ''), 10); if (!n || n < 5) return;
      var suffix = /\+$/.test(raw) ? '+' : '';
      var comma = raw.indexOf(',') > -1;
      var t0 = performance.now(), dur = 1400;
      function step(t) {
        var p = Math.min(1, (t - t0) / dur);
        var v = Math.round(n * (1 - Math.pow(1 - p, 3)));
        el.textContent = (comma ? v.toLocaleString('en-US') : String(v)) + suffix;
        if (p < 1) requestAnimationFrame(step); else el.textContent = raw;
      }
      requestAnimationFrame(step);
    }

    var parallax = [];

    $$('main section').forEach(function (sec) {
      var kids = Array.prototype.slice.call(sec.children);
      // A section with a single wrapper animates the wrapper's children instead.
      var targets = (kids.length === 1 && kids[0].children.length > 1) ? Array.prototype.slice.call(kids[0].children) : kids;
      var i = 0;
      targets.forEach(function (el) {
        var inGrid = getComputedStyle(el).display.indexOf('grid') > -1 && el.children.length > 1 && el.children.length <= 12;
        if (inGrid) { Array.prototype.slice.call(el.children).forEach(function (c, j) { prep(c, j); }); el.__pe = true; }
        else prep(el, i++);
      });
      if (sec.hasAttribute('data-parallax')) parallax.push(sec);
    });

    $$('[data-rule]').forEach(function (r) {
      r.style.transformOrigin = 'left center';
      r.style.transform = 'scaleX(0)';
      r.style.transition = 'transform .9s ' + EASE + ' .2s';
      if (!r.closest('[style*="opacity: 0"]')) setTimeout(function () { r.style.transform = 'scaleX(1)'; }, 300);
    });

    $$('[data-lift]').forEach(function (a) {
      a.addEventListener('mouseenter', function () {
        a.style.transition = (a.style.transition ? a.style.transition + ', ' : '') + 'transform .35s ' + EASE + ', box-shadow .35s ' + EASE;
        a.style.transform = 'translateY(-6px)';
        a.style.boxShadow = '0 18px 40px rgba(30,42,53,0.14)';
      });
      a.addEventListener('mouseleave', function () { a.style.transform = 'translateY(0)'; a.style.boxShadow = 'none'; });
    });

    $$('main section img').forEach(function (img) {
      if (img.closest('a')) return;
      var o = new IntersectionObserver(function (es) {
        if (img.height < 120) { img.style.transform = 'none'; o.disconnect(); return; }
        if (es[0].isIntersecting) { img.style.transform = 'scale(1)'; o.disconnect(); }
      }, { threshold: 0.2 });
      img.style.transition = 'transform 1.4s ' + EASE;
      img.style.transform = 'scale(1.04)';
      o.observe(img);
    });

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        ticking = false;
        parallax.forEach(function (sec) {
          var r = sec.getBoundingClientRect();
          if (r.bottom < 0 || r.top > innerHeight) return;
          sec.style.backgroundPosition = 'center calc(50% + ' + Math.round(r.top * -0.18) + 'px)';
        });
      });
    }, { passive: true });
  }

  /* ------------------------------------------------------------------
   * 3. Home · scroll-driven 3D build
   *    The section is 520vh tall; its inner stage is sticky (100vh).
   *    Scroll progress 0→1 (rounded to 1/200) drives:
   *      - <pe-house-3d progress="…"> (js/house3d.js)
   *      - step number / title / description / tags (from #build-steps JSON)
   *      - progress bar width and the "keep scrolling" hint
   * ------------------------------------------------------------------ */
  function initBuild() {
    var sec = $('[data-js="build"]');
    var data = $('#build-steps');
    if (!sec || !data) return;
    var steps = JSON.parse(data.textContent);
    var house = $('pe-house-3d', sec);
    var bar = $('[data-js="build-bar"]', sec);
    var hint = $('[data-js="build-hint"]', sec);
    function bind(k) { return $('[data-bind="' + k + '"]', sec); }
    var firstTag = $('[data-tag]', sec);
    var tagWrap = firstTag && firstTag.parentElement;
    var tagClass = firstTag ? firstTag.className : '';
    var lastStep = -1, lastP = -1, raf = 0;

    function render(bp) {
      var si = 0;
      steps.forEach(function (s, i) { if (bp >= s.at) si = i; });
      if (bp !== lastP) {
        lastP = bp;
        if (house) house.setAttribute('progress', String(bp));
        if (bar) bar.style.width = Math.round(bp * 100) + '%';
        if (hint) hint.style.opacity = bp < 0.03 ? '1' : '0';
      }
      if (si !== lastStep) {
        lastStep = si;
        var s = steps[si];
        bind('stepNum').textContent = String(si + 1).padStart(2, '0');
        bind('stepTitle').textContent = s.title;
        bind('stepDesc').textContent = s.desc;
        bind('stepCount').textContent = 'STEP ' + (si + 1) + ' / ' + steps.length;
        if (tagWrap) {
          tagWrap.textContent = '';
          s.tags.forEach(function (t) {
            var sp = document.createElement('span');
            sp.className = tagClass; sp.setAttribute('data-tag', ''); sp.textContent = t;
            tagWrap.appendChild(sp);
          });
        }
      }
    }
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        var r = sec.getBoundingClientRect();
        var range = r.height - innerHeight;
        var p = Math.max(0, Math.min(1, -r.top / Math.max(1, range)));
        render(Math.round(p * 200) / 200);
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  /* ------------------------------------------------------------------
   * 4. Projects · filters + plan/built compare
   * ------------------------------------------------------------------ */
  function initProjects() {
    var btns = $$('[data-filter]');
    var figs = $$('figure[data-cat]');
    if (!btns.length || !figs.length) return;
    var count = $('[data-js="count"]');
    var active = btns.filter(function (b) { return b.getAttribute('aria-pressed') === 'true'; })[0];
    var idle = btns.filter(function (b) { return b.getAttribute('aria-pressed') !== 'true'; })[0];
    var activeCls = active.className, idleCls = idle.className;

    function apply(f) {
      btns.forEach(function (b) {
        var on = b.getAttribute('data-filter') === f;
        b.className = on ? activeCls : idleCls;
        b.setAttribute('aria-pressed', String(on));
      });
      var n = 0;
      figs.forEach(function (fg) {
        var vis = f === 'All' || fg.getAttribute('data-cat') === f;
        fg.hidden = !vis; if (vis) n++;
      });
      if (count) count.textContent = n + ' project' + (n === 1 ? '' : 's') + (f === 'All' ? '' : ' · ' + f) + ' · drag the handle or hover to compare';
    }
    btns.forEach(function (b) { b.addEventListener('click', function () { apply(b.getAttribute('data-filter')); }); });

    figs.forEach(function (fg) {
      var input = $('input[type="range"]', fg);
      var plan = $('[data-js="plan"]', fg);
      var handle = $('[data-js="handle"]', fg);
      if (!input || !plan || !handle) return;
      input.addEventListener('input', function () {
        var v = Number(input.value);
        plan.style.clipPath = 'inset(0 ' + (100 - v) + '% 0 0)';
        handle.style.left = v + '%';
      });
    });
  }

  /* ------------------------------------------------------------------
   * 5. Chat agent mock
   *    Mirrors the GoHighLevel qualifying flow: project → location →
   *    timeline → name → phone, then a summary card.
   *    PRODUCTION: delete the chat-widget markup + this module and paste
   *    the GHL embed (widgets.leadconnectorhq.com) before </body>.
   * ------------------------------------------------------------------ */
  var CHAT_STEPS = [
    { key: 'project', quick: ['ADU / garage conversion', 'Home addition', 'Fire rebuild', 'New custom home', 'Remodel / structural repair', 'Something else'] },
    { key: 'location', quick: ['Bakersfield', 'Los Angeles area', 'Santa Rosa', 'Central Coast', 'Sacramento', 'Outside California'] },
    { key: 'timeline', quick: ['Ready to start now', 'Within 3 months', 'Later this year', 'Just exploring'] },
    { key: 'name', quick: [] },
    { key: 'phone', quick: [] }
  ];
  var CHAT_PROMPTS = {
    location: function () { return 'Where is the property? City or zip is fine.'; },
    timeline: function () { return 'When are you hoping to start?'; },
    name: function () { return 'Great. Who am I speaking with?'; },
    phone: function (a) { return 'Thanks, ' + a.name + ". What's the best phone number to reach you? Our team follows up by text and email right away."; },
    done: function (a) { return "Perfect. I've flagged this as a " + a.project.toLowerCase() + ' in ' + a.location + " for our team. You'll get a confirmation email now, and an engineer will call within one business day."; }
  };

  /* Lead submission: posts to /api/lead.php, which emails the lead and forwards it
   * to the GoHighLevel inbound webhook (configure both at the top of api/lead.php). */
  var LEAD_ENDPOINT = '/client-previews/pasquini-engineering-inc/api/lead.php';
  function submitLead(a) {
    var payload = { project: a.project, location: a.location, timeline: a.timeline, name: a.name, phone: a.phone, page: location.pathname, website: '' };
    return fetch(LEAD_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { if (!r.ok || !j.ok) throw new Error('lead failed'); return j; }); })
      .then(function (j) { if (window.gtag) window.gtag('event', 'generate_lead', { form_name: 'chat_qualifier', project_type: a.project }); return j; });
  }

  function initChat() {
    var root = $('[data-component="chat-widget"]');
    if (!root) return;
    var panel = $('#chat-panel');
    var pill = $('[data-js="chat-pill"]', root);
    var launcher = $('[data-js="chat-launcher"]', root);
    var closeBtn = $('[data-js="chat-close"]', root);
    var log = $('[data-js="chat-log"]', root);
    var input = $('[data-js="chat-input"]', root);
    var sendBtn = $('[data-js="chat-send"]', root);
    var prog = $('[data-js="chat-progress"]', root);
    var typing = $('[data-if="typing"]', log);
    var quickWrap = $('[data-if="showQuick"]', log);
    var done = $('[data-if="done"]', log);
    var iconOpen = $('[data-if="open"]', launcher);
    var iconClosed = $('[data-if="closed"]', launcher);
    var meTpl = $('[data-msg="me"]', log);
    var themMsg = $('[data-msg="them"]', log);
    var meCls = meTpl.className, themCls = themMsg.className;
    meTpl.parentNode.removeChild(meTpl);
    var quickCls = $('[data-quick]', quickWrap).className;

    var open = false, step = 0, answers = {}, busy = false;

    function scroll() { requestAnimationFrame(function () { log.scrollTop = log.scrollHeight; }); }
    function addMsg(who, text) {
      var d = document.createElement('div');
      d.className = who === 'me' ? meCls : themCls;
      d.setAttribute('data-msg', who);
      d.textContent = text;
      log.insertBefore(d, typing);
      scroll();
    }
    function renderQuick() {
      var s = CHAT_STEPS[step];
      quickWrap.textContent = '';
      var show = !!s && s.quick.length > 0 && !busy;
      quickWrap.hidden = !show;
      if (!show) return;
      s.quick.forEach(function (label) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = quickCls; b.setAttribute('data-quick', ''); b.textContent = label;
        b.addEventListener('click', function () { answer(label); });
        quickWrap.appendChild(b);
      });
    }
    function renderMeta() {
      var s = CHAT_STEPS[step];
      prog.style.width = Math.min(100, Math.round(step / CHAT_STEPS.length * 100)) + '%';
      input.placeholder = s ? (s.key === 'phone' ? '(555) 555-5555' : s.key === 'name' ? 'Your name' : 'Type your answer…') : 'Anything else we should know?';
      input.setAttribute('type', s && s.key === 'phone' ? 'tel' : 'text');
      var fin = step >= CHAT_STEPS.length;
      done.hidden = !fin;
      if (fin) {
        $('[data-sum="project"]', done).textContent = answers.project || '';
        $('[data-sum="location"]', done).textContent = answers.location || '';
        $('[data-sum="timeline"]', done).textContent = answers.timeline || '';
      }
      renderQuick();
    }
    function bot(text) {
      busy = true; typing.hidden = false; renderQuick(); scroll();
      setTimeout(function () {
        busy = false; typing.hidden = true;
        addMsg('them', text); renderMeta();
      }, 800);
    }
    function answer(text) {
      var s = CHAT_STEPS[step]; if (!s) return;
      answers[s.key] = text; step++;
      input.value = '';
      addMsg('me', text); renderMeta();
      var next = CHAT_STEPS[step] ? CHAT_STEPS[step].key : 'done';
      if (next !== 'done') return bot(CHAT_PROMPTS[next](answers));
      submitLead(answers).then(function () {
        bot(CHAT_PROMPTS.done(answers));
      }, function () {
        bot("Sorry, that didn't go through. Please call us at (661) 328-9600 or text (888) 509-9252 and we'll take it from there.");
      });
    }
    function send() {
      var t = input.value.trim(); if (!t || busy) return;
      if (step < CHAT_STEPS.length) return answer(t);
      input.value = ''; addMsg('me', t);
      bot("Noted — I've added that to your file. Talk soon.");
    }
    function toggle() {
      open = !open;
      panel.hidden = !open;
      if (pill) { pill.parentNode.removeChild(pill); pill = null; }
      iconOpen.hidden = !open; iconClosed.hidden = open;
      launcher.setAttribute('aria-expanded', String(open));
      launcher.setAttribute('aria-label', open ? 'Close chat' : 'Open chat');
      if (open) { scroll(); setTimeout(function () { input.focus(); }, 50); }
    }

    launcher.addEventListener('click', toggle);
    closeBtn.addEventListener('click', function () { toggle(); launcher.focus(); });
    if (pill) pill.addEventListener('click', toggle);
    sendBtn.addEventListener('click', send);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) { toggle(); launcher.focus(); } });
    renderMeta();
  }

  function init() { initNav(); initMotion(); initBuild(); initProjects(); initChat(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
