// <pe-house-3d view="build|exterior|dollhouse|floorplan" progress="0..1" floor="all|1|2" highlight="…">
// Modern mountain-contemporary residence: stucco, stone-clad gable ends, standing-seam metal roofs,
// black-framed glass walls, white cable-rail deck, patio and pool. Daylight scene.
(function () {
  const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
  const TERRA = 0xb9603a;
  const cv = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); draw(g, w, h); return c; };
  const speckle = (g, w, h, n, a, dark) => { for (let i = 0; i < n; i++) { const v = Math.random(); g.fillStyle = dark ? `rgba(0,0,0,${a * v})` : `rgba(255,255,255,${a * v})`; g.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1 + Math.random() * 2); } };
  class PeHouse3D extends HTMLElement {
    static get observedAttributes() { return ['highlight', 'view', 'floor', 'progress']; }
    connectedCallback() {
      if (this._started) return; this._started = true;
      this.style.display = 'block'; this.style.position = 'relative'; this.style.width = this.style.width || '100%'; this.style.height = this.style.height || '100%';
      this.style.cursor = 'grab'; this.style.touchAction = 'none';
      this._yaw = 0.55; this._pitch = 0.42; this._pitchTarget = 0.42; this._idle = 0; this._drag = null; this._roofLift = 0; this._progress = 0;
      import(THREE_URL).then(T => this._init(T)).catch(e => console.error('house3d', e));
    }
    attributeChangedCallback(n, _o, v) { if (n === 'progress') { this._progress = Math.max(0, Math.min(1, parseFloat(v) || 0)); return; } this._apply(); }
    disconnectedCallback() { this._dead = true; this._ro && this._ro.disconnect(); this._renderer && this._renderer.dispose(); }
    _tex(T, canvas, rx, ry) { const t = new T.CanvasTexture(canvas); t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(rx, ry); t.colorSpace = T.SRGBColorSpace; t.anisotropy = 8; return t; }
    _init(T) {
      if (this._dead) return;
      this.T = T;
      const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap;
      renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0; renderer.outputColorSpace = T.SRGBColorSpace;
      renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
      this.appendChild(renderer.domElement); this._renderer = renderer;
      const scene = new T.Scene(); this._scene = scene;
      const sky = cv(16, 512, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#2f6fb5'); gr.addColorStop(0.4, '#7fb0e0'); gr.addColorStop(0.68, '#cfe1f0'); gr.addColorStop(0.8, '#e9eef2'); gr.addColorStop(1, '#d9d3c8'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
      const skyTex = new T.CanvasTexture(sky); skyTex.colorSpace = T.SRGBColorSpace; skyTex.mapping = T.EquirectangularReflectionMapping;
      scene.background = skyTex; scene.fog = new T.Fog(0xdfe6ec, 40, 110);
      const pm = new T.PMREMGenerator(renderer); scene.environment = pm.fromEquirectangular(skyTex).texture;
      const cam = new T.PerspectiveCamera(34, 1, 0.1, 160); this._cam = cam;
      scene.add(new T.HemisphereLight(0xbfd6f0, 0x8a7f6e, 0.75));
      const sun = new T.DirectionalLight(0xfff1dc, 2.6); sun.position.set(9, 14, 11); sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048); sun.shadow.camera.left = -16; sun.shadow.camera.right = 16; sun.shadow.camera.top = 16; sun.shadow.camera.bottom = -16; sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03; sun.shadow.radius = 3;
      scene.add(sun);
      // textures
      const stuccoTex = this._tex(T, cv(256, 256, (g, w, h) => { g.fillStyle = '#ede4d2'; g.fillRect(0, 0, w, h); speckle(g, w, h, 5000, 0.05, true); speckle(g, w, h, 3000, 0.08, false); }), 3, 3);
      const stoneTex = this._tex(T, cv(512, 512, (g, w, h) => { g.fillStyle = '#5e574f'; g.fillRect(0, 0, w, h); const cols = ['#b9a58a', '#a89477', '#cdbba0', '#8f8371', '#c2ad8e', '#9d8b70', '#bfb09a']; for (let y = 0; y < h; y += 44) { let x = -20 + Math.random() * 20; while (x < w) { const ww = 40 + Math.random() * 70, hh = 36 + Math.random() * 6; g.fillStyle = cols[(Math.random() * cols.length) | 0]; g.beginPath(); g.roundRect(x + 3, y + 3, ww - 6, hh - 4, 6); g.fill(); g.fillStyle = 'rgba(255,255,255,0.08)'; g.fillRect(x + 6, y + 6, ww - 12, 4); x += ww; } } speckle(g, w, h, 6000, 0.08, true); }), 1, 1);
      const roofTex = this._tex(T, cv(512, 512, (g, w, h) => { g.fillStyle = '#4b4742'; g.fillRect(0, 0, w, h); speckle(g, w, h, 4000, 0.06, false); for (let x = 0; x < w; x += 48) { g.fillStyle = 'rgba(255,255,255,0.14)'; g.fillRect(x, 0, 4, h); g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(x + 4, 0, 3, h); } }), 4, 1);
      const pavTex = this._tex(T, cv(512, 512, (g, w, h) => { g.fillStyle = '#c9bdb0'; g.fillRect(0, 0, w, h); speckle(g, w, h, 16000, 0.12, true); speckle(g, w, h, 6000, 0.1, false); g.strokeStyle = 'rgba(0,0,0,0.22)'; g.lineWidth = 3; for (let i = 0; i <= 2; i++) { g.beginPath(); g.moveTo(0, i * 256); g.lineTo(w, i * 256); g.stroke(); g.beginPath(); g.moveTo(i * 256, 0); g.lineTo(i * 256, h); g.stroke(); } }), 6, 4);
      const grassTex = this._tex(T, cv(512, 512, (g, w, h) => { g.fillStyle = '#7a8a48'; g.fillRect(0, 0, w, h); speckle(g, w, h, 30000, 0.2, true); for (let i = 0; i < 12000; i++) { g.fillStyle = `rgba(${150 + Math.random() * 60},${160 + Math.random() * 50},70,0.35)`; g.fillRect(Math.random() * w, Math.random() * h, 1, 2 + Math.random() * 3); } }), 16, 16);
      const waterTex = this._tex(T, cv(256, 256, (g, w, h) => { g.fillStyle = '#3fb1d6'; g.fillRect(0, 0, w, h); for (let i = 0; i < 40; i++) { g.strokeStyle = `rgba(255,255,255,${0.05 + Math.random() * 0.12})`; g.lineWidth = 1 + Math.random() * 3; g.beginPath(); const y = Math.random() * h; g.moveTo(0, y); g.bezierCurveTo(w * 0.3, y + 20 * (Math.random() - 0.5), w * 0.7, y + 20 * (Math.random() - 0.5), w, y); g.stroke(); } }), 2, 1);
      const M = o => new T.MeshStandardMaterial(Object.assign({ roughness: 0.85, metalness: 0, transparent: true }, o));
      const stuccoM = M({ map: stuccoTex, roughness: 0.9 });
      const taupeM = M({ color: 0x6b6252, roughness: 0.8 });          // dark taupe band / fascia
      const beamM = M({ color: 0x7a7066, roughness: 0.75 });           // exposed rafter tails
      const stoneM = M({ map: stoneTex, roughness: 0.95 });
      const roofM = M({ map: roofTex, roughness: 0.45, metalness: 0.45 });
      const frameM = M({ color: 0x15171a, roughness: 0.4, metalness: 0.3 });
      const whiteM = M({ color: 0xf2f2f0, roughness: 0.35, metalness: 0.2 });
      const cableM = M({ color: 0xc9ced3, roughness: 0.25, metalness: 0.9 });
      const concM = M({ map: pavTex, roughness: 0.95 });
      const glassM = new T.MeshPhysicalMaterial({ color: 0x8fb4cf, roughness: 0.04, metalness: 0.45, transmission: 0, transparent: true, opacity: 0.92, envMapIntensity: 2.2, emissive: 0x2a4152, emissiveIntensity: 0.35 });
      const waterM = new T.MeshPhysicalMaterial({ map: waterTex, color: 0x7fd6ee, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.92, envMapIntensity: 1.6 });
      const leafM = M({ color: 0x4f6a33, roughness: 0.95 }); const barkM = M({ color: 0x5a4a3a, roughness: 1 });
      const box = (w, h, d, m, x, y, z, grp, ry) => { const mesh = new T.Mesh(new T.BoxGeometry(w, h, d), m.clone()); mesh.position.set(x, y, z); if (ry) mesh.rotation.y = ry; mesh.castShadow = mesh.receiveShadow = true; grp.add(mesh); return mesh; };
      const groups = {}; const G = name => { const g = new T.Group(); g.name = name; groups[name] = g; scene.add(g); return g; };
      // ground
      const ground = new T.Mesh(new T.CircleGeometry(120, 72), M({ map: grassTex, roughness: 1 })); ground.rotation.x = -Math.PI / 2; ground.position.y = -0.2; ground.receiveShadow = true; scene.add(ground);
      // ---- site: patio, pool, planters, trees
      const gX = G('site');
      box(16, 0.08, 9, concM, 0, -0.16, 6.5, gX);                                   // patio
      const cut = box(7.0, 0.1, 3.4, M({ color: 0x9fd7e8 }), -1.2, -0.11, 7.4, gX); cut.castShadow = false; // pool basin floor tint
      box(7.2, 0.5, 3.6, M({ color: 0xd9cfc2 }), -1.2, -0.55, 7.4, gX);              // pool shell (top at -0.30, below patio)
      const water = box(6.8, 0.06, 3.2, waterM, -1.2, -0.13, 7.4, gX); water.castShadow = false;
      box(7.4, 0.06, 0.3, M({ color: 0xe6ddd0 }), -1.2, -0.09, 5.55, gX); box(7.4, 0.06, 0.3, M({ color: 0xe6ddd0 }), -1.2, -0.09, 9.25, gX); // coping
      box(0.3, 0.06, 4.0, M({ color: 0xe6ddd0 }), -4.95, -0.09, 7.4, gX); box(0.3, 0.06, 4.0, M({ color: 0xe6ddd0 }), 2.55, -0.09, 7.4, gX);
      box(2.6, 0.9, 1.2, M({ color: 0xb5ada2 }), -7.6, 0.25, 3.6, gX);              // retaining planter
      const tree = (x, z, s) => { const t = new T.Mesh(new T.CylinderGeometry(0.12 * s, 0.22 * s, 3.2 * s, 10), barkM.clone()); t.position.set(x, 1.4 * s, z); t.castShadow = true; gX.add(t); [[0, 3.6, 0, 1.6], [1.1, 3.0, 0.4, 1.1], [-1.0, 3.1, -0.5, 1.2], [0.2, 4.4, -0.3, 1.0], [-0.3, 2.6, 0.9, 0.9]].forEach(([dx, dy, dz, r]) => { const l = new T.Mesh(new T.SphereGeometry(r * s, 18, 14), leafM.clone()); l.position.set(x + dx * s, dy * s, z + dz * s); l.castShadow = true; gX.add(l); }); };
      tree(-10, -1, 1.25); tree(-8.5, -6, 1.1); tree(9.5, -5, 1.35); tree(11, 1.5, 0.95);
      for (let i = 0; i < 5; i++) { const s = new T.Mesh(new T.SphereGeometry(0.32, 12, 10), leafM.clone()); s.position.set(-8.3 + i * 0.5, 0.85, 3.6); s.castShadow = true; gX.add(s); }
      // ---- foundation
      const gF = G('foundation');
      box(11.4, 0.34, 6.4, M({ color: 0xa8a29a, roughness: 1 }), 0, 0, -0.2, gF);
      for (let i = 0; i < 5; i++) box(0.6, 1.0, 0.6, M({ color: 0x9a948c }), -4.4 + i * 2.2, -0.6, 2.4, gF);
      // ---- floor 1: walls (stucco piers + full-height glass sliders), deep covered walkway under the deck
      const gW1 = G('walls1'); const H1 = 3.0, Y1 = 0.17;
      const wall = (g, w, h, d, x, y, z, m) => box(w, h, d, m || stuccoM, x, y, z, g);
      wall(gW1, 11, H1, 0.22, 0, Y1 + H1 / 2, -2.9);                                       // back wall
      wall(gW1, 0.22, H1, 5.4, -5.4, Y1 + H1 / 2, -0.2); wall(gW1, 0.22, H1, 5.4, 5.4, Y1 + H1 / 2, -0.2); // sides
      // front wall: piers with sliders between
      const piers = [-5.4, -2.4, -1.1, 1.5, 2.9, 5.4];
      piers.forEach(x => wall(gW1, 0.5, H1, 0.26, x, Y1 + H1 / 2, 2.5));
      const slider = (g, x0, x1, y0, h, z, panels) => {
        const w = x1 - x0 - 0.5; const cx = (x0 + x1) / 2;
        box(w + 0.04, 0.1, 0.12, frameM, cx, y0 + h + 0.02, z, g); box(w + 0.04, 0.08, 0.12, frameM, cx, y0 + 0.02, z, g);
        const pw = w / panels;
        for (let i = 0; i < panels; i++) { const px = x0 + 0.25 + pw * (i + 0.5); const gl = new T.Mesh(new T.BoxGeometry(pw - 0.08, h - 0.1, 0.03), glassM.clone()); gl.position.set(px, y0 + h / 2, z); g.add(gl); box(0.07, h, 0.1, frameM, px - pw / 2 + 0.02, y0 + h / 2, z, g); }
        box(0.07, h, 0.1, frameM, x1 - 0.25, y0 + h / 2, z, g);
      };
      slider(gW1, -5.4, -2.4, Y1, 2.75, 2.5, 3); slider(gW1, -1.1, 1.5, Y1, 2.75, 2.5, 2); slider(gW1, 2.9, 5.4, Y1, 2.75, 2.5, 2);
      wall(gW1, 1.3, H1, 0.26, -1.75, Y1 + H1 / 2, 2.5); wall(gW1, 1.4, H1, 0.26, 2.2, Y1 + H1 / 2, 2.5);
      // side windows floor 1
      const win = (g, w, h, x, y, z, ry, cols, rows) => {
        const f = box(w + 0.12, h + 0.12, 0.1, frameM, x, y, z, g, ry); const gl = new T.Mesh(new T.BoxGeometry(w, h, 0.03), glassM.clone()); gl.position.set(x, y, z); gl.rotation.y = ry || 0; g.add(gl);
        const o = new T.Vector3(Math.sin(ry || 0), 0, Math.cos(ry || 0));
        for (let i = 1; i < (cols || 1); i++) { const m = box(0.05, h, 0.06, frameM, x, y, z, g, ry); m.position.add(o.clone().multiplyScalar(0.03)); m.translateX(-w / 2 + (w / cols) * i); }
        for (let j = 1; j < (rows || 1); j++) { const m = box(w, 0.05, 0.06, frameM, x, y - h / 2 + (h / rows) * j, z, g, ry); m.position.add(o.clone().multiplyScalar(0.03)); }
        f.position.add(o.clone().multiplyScalar(-0.02));
      };
      win(gW1, 1.6, 1.6, 5.52, 1.9, -1.0, Math.PI / 2, 2, 1); win(gW1, 1.6, 1.6, -5.52, 1.9, -1.0, -Math.PI / 2, 2, 1);
      // ---- floor 1 interior
      const gI1 = G('floor1'); const floorM = M({ color: 0xcdb896, roughness: 0.6 }); const partM = M({ color: 0xf1ebe1 });
      box(10.6, 0.06, 5.2, floorM, 0, Y1 + 0.03, -0.2, gI1); box(0.12, 2.9, 3.0, partM, -2.0, Y1 + 1.45, -1.4, gI1); box(0.12, 2.9, 3.0, partM, 2.3, Y1 + 1.45, -1.4, gI1);
      box(2.4, 0.9, 0.9, M({ color: 0xe9e4dc }), 0.2, Y1 + 0.45, -1.6, gI1); box(2.0, 0.45, 0.9, M({ color: 0x6f7d66 }), -3.6, Y1 + 0.23, 0.6, gI1);
      // ---- deck / balcony: dark taupe surround wrapping the ground floor + white cable rail
      const gB = G('balcony');
      box(11.8, 0.62, 7.2, taupeM, 0, 3.48, 0.4, gB);                                        // deck volume (top at 3.79)
      box(11.6, 0.04, 7.0, M({ color: 0xd8cfc3, roughness: 0.9 }), 0, 3.81, 0.4, gB);        // deck surface
      box(0.6, 3.1, 0.6, taupeM, -5.6, 1.7, 3.6, gB); box(0.6, 3.1, 0.6, taupeM, 5.6, 1.7, 3.6, gB); // deck columns
      const rail = (x0, x1, z, ry) => { const n = Math.round(Math.abs(x1 - x0) / 1.5); const L = Math.abs(x1 - x0); const cx = (x0 + x1) / 2;
        for (let i = 0; i <= n; i++) { const t = i / n; const p = box(0.07, 1.05, 0.07, whiteM, 0, 4.35, 0, gB); p.position.set(ry ? z : x0 + (x1 - x0) * t, 4.35, ry ? x0 + (x1 - x0) * t : z); }
        const top = box(L, 0.06, 0.1, whiteM, ry ? z : cx, 4.9, ry ? cx : z, gB, ry);
        for (let k = 1; k <= 8; k++) { box(L, 0.012, 0.012, cableM, ry ? z : cx, 3.92 + k * 0.11, ry ? cx : z, gB, ry); } return top; };
      rail(-5.8, 5.8, 3.9); rail(-3.0, 3.9, -5.8, Math.PI / 2); rail(-3.0, 3.9, 5.8, Math.PI / 2);
      // ---- floor 2: two gable volumes + link
      const gW2 = G('walls2'); const Y2 = 3.83, H2 = 2.7;
      const vol = (cx, w) => {
        wall(gW2, w, H2, 0.22, cx, Y2 + H2 / 2, -2.7); wall(gW2, 0.22, H2, 4.9, cx - w / 2, Y2 + H2 / 2, -0.3); wall(gW2, 0.22, H2, 4.9, cx + w / 2, Y2 + H2 / 2, -0.3);
        // front gable end: stucco sides + stone column with window grid
        wall(gW2, (w - 2.8) / 2, H2, 0.22, cx - w / 2 + (w - 2.8) / 4, Y2 + H2 / 2, 2.1); wall(gW2, (w - 2.8) / 2, H2, 0.22, cx + w / 2 - (w - 2.8) / 4, Y2 + H2 / 2, 2.1);
        box(2.8, H2, 0.3, stoneM, cx, Y2 + H2 / 2, 2.1, gW2);
        win(gW2, 2.2, 2.2, cx, Y2 + 1.35, 2.27, 0, 3, 2);
        // gable triangles (stucco) front and back, with stone triangle inset at front
        const tri = (base, hgt, m, z, d) => { const s = new T.Shape(); s.moveTo(-base / 2, 0); s.lineTo(base / 2, 0); s.lineTo(0, hgt); s.lineTo(-base / 2, 0); const gm = new T.ExtrudeGeometry(s, { depth: d, bevelEnabled: false }); const mesh = new T.Mesh(gm, m.clone()); mesh.position.set(cx, Y2 + H2, z); mesh.castShadow = mesh.receiveShadow = true; gW2.add(mesh); return mesh; };
        tri(w, 1.5, stuccoM, 2.0, 0.2); tri(w, 1.5, stuccoM, -2.9, 0.2); tri(2.8, 1.05, stoneM, 2.05, 0.25);
        win(gW2, 1.5, 0.6, cx, Y2 + H2 + 0.42, 2.32, 0, 3, 1);
        win(gW2, 1.4, 1.5, cx + w / 2 + 0.02, Y2 + 1.4, -0.6, Math.PI / 2, 2, 1); win(gW2, 1.4, 1.5, cx - w / 2 - 0.02, Y2 + 1.4, -0.6, -Math.PI / 2, 2, 1);
      };
      vol(-3.0, 4.4); vol(3.0, 4.4);
      wall(gW2, 1.8, H2 - 0.5, 0.22, 0, Y2 + (H2 - 0.5) / 2, 1.4); wall(gW2, 1.8, H2 - 0.5, 0.22, 0, Y2 + (H2 - 0.5) / 2, -2.7); // link volume
      win(gW2, 1.3, 1.6, 0, Y2 + 1.2, 1.52, 0, 2, 1);
      // ---- floor 2 interior
      const gI2 = G('floor2');
      box(11, 0.05, 5.0, floorM, 0, Y2 + 0.02, -0.3, gI2); box(1.6, 0.5, 2.1, M({ color: 0xe9e4dc }), -3.0, Y2 + 0.27, -1.2, gI2); box(1.6, 0.5, 2.1, M({ color: 0xe9e4dc }), 3.0, Y2 + 0.27, -1.2, gI2);
      // ---- roofs: standing-seam gables with deep overhangs, taupe fascia, exposed rafter tails
      const gR = G('roof');
      const gable = (cx, w) => {
        const ov = 0.75, base = w + ov * 2, hgt = 1.5 + ov * (1.5 / (w / 2)), depth = 4.9 + 0.22 + ov * 2;
        const s = new T.Shape(); s.moveTo(-base / 2, 0); s.lineTo(base / 2, 0); s.lineTo(0, hgt); s.lineTo(-base / 2, 0);
        const geo = new T.ExtrudeGeometry(s, { depth, bevelEnabled: false }); geo.translate(0, 0, -depth / 2 - 0.4);
        const uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 0.6, uv.getY(i) * 0.6);
        const r = new T.Mesh(geo, roofM.clone()); r.position.set(cx, Y2 + H2 + 0.08, 0); r.castShadow = r.receiveShadow = true; gR.add(r);
        const slope = Math.atan2(hgt, base / 2); const rl = Math.hypot(base / 2, hgt);
        [[1, -1], [-1, 1]].forEach(([sx, sr]) => {
          [2.55, -2.95].forEach(z => { const f = box(rl + 0.1, 0.22, 0.14, taupeM, cx + sx * base / 4, Y2 + H2 + 0.08 + hgt / 2 - 0.08, z, gR); f.rotation.z = sr * slope; });
          // rafter tails under the gable overhang
          [0.28, 0.62, 0.9].forEach(t => { const bx = cx + sx * (base / 2) * (1 - t), by = Y2 + H2 + hgt * t - 0.28; box(0.16, 0.28, 0.95, beamM, bx, by, 2.35, gR); box(0.16, 0.28, 0.95, beamM, bx, by, -2.75, gR); });
        });
        box(0.16, 0.16, depth, taupeM, cx, Y2 + H2 + 0.08 + hgt + 0.04, -0.4, gR); // ridge cap
        box(0.14, 0.2, depth, taupeM, cx - base / 2, Y2 + H2 + 0.02, -0.4, gR); box(0.14, 0.2, depth, taupeM, cx + base / 2, Y2 + H2 + 0.02, -0.4, gR); // eave fascia
      };
      gable(-3.0, 4.4); gable(3.0, 4.4);
      box(2.2, 0.16, 4.6, roofM, 0, Y2 + H2 - 0.42, -0.6, gR); box(2.2, 0.22, 0.14, taupeM, 0, Y2 + H2 - 0.42, 1.7, gR); // low link roof
      box(0.6, 1.0, 0.6, stoneM, 4.2, Y2 + H2 + 1.6, -1.6, gR); box(0.7, 0.08, 0.7, taupeM, 4.2, Y2 + H2 + 2.12, -1.6, gR); // chimney
      // downspouts (copper accent)
      const copperM = M({ color: 0xb5622f, roughness: 0.35, metalness: 0.6 });
      box(0.06, H2 + 0.6, 0.06, copperM, -5.32, Y2 + H2 / 2 + 0.2, 2.2, gW2); box(0.06, H2 + 0.6, 0.06, copperM, 5.32, Y2 + H2 / 2 + 0.2, 2.2, gW2);
      this._groups = groups;
      this._all = []; scene.traverse(o => { if (o.isMesh && o !== ground) this._all.push(o); });
      this._all.forEach(o => { o.userData.base = o.material.color.clone(); o.userData.em = o.material.emissive.clone(); o.userData.emI = o.material.emissiveIntensity; o.userData.grp = o.parent.name; o.userData.op = o.material.opacity; });
      this._apply();
      const el = this;
      el.addEventListener('pointerdown', e => { el._drag = { x: e.clientX, y: e.clientY }; el.style.cursor = 'grabbing'; el.setPointerCapture(e.pointerId); });
      el.addEventListener('pointermove', e => { if (!el._drag) return; el._yaw += (e.clientX - el._drag.x) * 0.008; if (el._view !== 'floorplan') el._pitchTarget = el._pitch = Math.max(0.08, Math.min(1.3, el._pitch + (e.clientY - el._drag.y) * 0.005)); el._drag = { x: e.clientX, y: e.clientY }; el._idle = 0; });
      const up = () => { el._drag = null; el.style.cursor = 'grab'; };
      el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
      this._ro = new ResizeObserver(() => this._resize()); this._ro.observe(this); this._resize();
      this._last = performance.now();
      const loop = t => { if (this._dead) return; requestAnimationFrame(loop); const dt = Math.min(0.05, (t - this._last) / 1000); this._last = t; if (this._view === 'build') { this._build(dt); } else { if (!this._drag) { this._idle += dt; if (this._idle > 1.5 && this._view !== 'floorplan') this._yaw += dt * 0.12; } this._pitch += (this._pitchTarget - this._pitch) * Math.min(1, dt * 4); const lift = this._view === 'exterior' ? 0 : 1; this._roofLift += (lift - this._roofLift) * Math.min(1, dt * 4); this._groups.roof.position.y = this._roofLift * 2.6; } this._frame(); };
      requestAnimationFrame(loop);
    }
    _build(dt) {
      const p = this._progress || 0; const ease = x => 1 - Math.pow(1 - x, 3);
      const W = { site: [0, 0.12, 0], foundation: [0.08, 0.28, -1.6], floor1: [0.28, 0.42, -1.2], walls1: [0.34, 0.52, -2.6], floor2: [0.5, 0.62, 2.2], walls2: [0.56, 0.72, 2.8], balcony: [0.68, 0.82, 3.4], roof: [0.78, 0.94, 4.2] };
      const smooth = (cur, tgt) => cur + (tgt - cur) * Math.min(1, dt * 6);
      this._sm = this._sm || {};
      for (const g in W) {
        const [a, b, off] = W[g]; const raw = Math.max(0, Math.min(1, (p - a) / (b - a)));
        const t = this._sm[g] = smooth(this._sm[g] ?? raw, raw); const e = ease(t);
        const grp = this._groups[g]; grp.position.y = (1 - e) * off; grp.visible = t > 0.001;
        grp.children.forEach(o => { if (o.material) { o.material.opacity = e * (o.userData.op ?? 1); o.material.depthWrite = e > 0.5; } });
      }
      this._yaw = 2.4 - p * 1.85; this._pitch = 0.62 - p * 0.3; this._pitchTarget = this._pitch;
    }
    _resize() { const w = this.clientWidth || 600, h = this.clientHeight || 400; this._renderer.setSize(w, h, false); this._cam.aspect = w / h; this._cam.updateProjectionMatrix(); this._dist = 27 * Math.max(1, 1.25 / (w / h)); }
    _frame() {
      const r = (this._dist || 27) * (this._view === 'floorplan' ? 0.85 : 1), cy = 3.2; const c = this._cam;
      c.position.set(Math.sin(this._yaw) * Math.cos(this._pitch) * r, cy + Math.sin(this._pitch) * r, Math.cos(this._yaw) * Math.cos(this._pitch) * r);
      c.lookAt(0, cy, 1.0); this._renderer.render(this._scene, c);
    }
    _apply() {
      if (!this._groups) return;
      const view = (this.getAttribute('view') || 'exterior').toLowerCase();
      const floor = (this.getAttribute('floor') || 'all').toLowerCase();
      const hl = (this.getAttribute('highlight') || 'none').toLowerCase();
      const prevView = this._view; this._view = view;
      this.style.pointerEvents = view === 'build' ? 'none' : 'auto';
      if (view === 'build') { this._all.forEach(o => { o.visible = true; o.material.color.copy(o.userData.base); o.material.emissive.copy(o.userData.em); o.material.emissiveIntensity = o.userData.emI; }); return; }
      Object.values(this._groups).forEach(g => { g.position.y = 0; g.visible = true; });
      if (view === 'floorplan') this._pitchTarget = 1.5; else if (prevView === 'floorplan') this._pitchTarget = 0.42;
      const hlGroups = hl === 'framing' ? ['walls1', 'walls2'] : hl === 'none' ? [] : [hl];
      const cut = view !== 'exterior';
      this._all.forEach(o => {
        const g = o.userData.grp; const m = o.material;
        let visible = true, opacity = o.userData.op ?? 1;
        if (cut) {
          if (g === 'roof') opacity = 0.12;
          if (g === 'walls1' || g === 'walls2') opacity = view === 'floorplan' ? 0.9 : 0.28;
          if (g === 'balcony') opacity = 0.5;
          if (floor === '1' && (g === 'floor2' || g === 'walls2' || g === 'roof' || g === 'balcony')) visible = false;
          if (floor === '2' && (g === 'floor1' || g === 'walls1')) opacity = 0.15;
        }
        o.visible = visible;
        m.color.copy(o.userData.base); m.emissive.copy(o.userData.em); m.emissiveIntensity = o.userData.emI;
        if (hlGroups.length) {
          if (hlGroups.includes(g)) { m.emissive.setHex(TERRA); m.emissiveIntensity = 0.55; opacity = 1; }
          else { m.emissiveIntensity = o.userData.emI * 0.2; opacity = Math.min(opacity, g === 'site' ? 0.5 : 0.22); }
        }
        m.opacity = opacity; m.depthWrite = opacity > 0.5;
      });
    }
  }
  if (!customElements.get('pe-house-3d')) customElements.define('pe-house-3d', PeHouse3D);
})();
