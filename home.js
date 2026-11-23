(function () {
  const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Postcards ---------- */
  const cards = document.getElementById('cards');
  cards.innerHTML = window.PROJECTS.map(p => `
    <a class="postcard" id="project-${p.slug}" href="case-study.html?project=${p.slug}" style="--tilt:${p.tilt}deg">
      <img src="${p.image}" alt="" style="filter:hue-rotate(${p.hue}deg)" />
      <h3>${p.title}</h3>
      <p>${p.blurb}</p>
    </a>`).join('');

  // Coming back from a case study: land on the same postcard.
  if (location.hash.startsWith('#project-')) {
    const el = document.querySelector(location.hash);
    if (el) requestAnimationFrame(() => { el.scrollIntoView({ block: 'center' }); el.focus({ preventScroll: true }); });
  }

  /* ---------- Peel to meet Kirti ---------- */
  const stack = document.getElementById('note-stack');
  const notes = [...stack.querySelectorAll('.note')];
  const portrait = document.getElementById('portrait');
  const cue = document.getElementById('peel-cue');
  const status = document.getElementById('peel-status');
  const GRAY = [1, 0.72, 0.45, 0.2, 0];           // colour returns a little with each peel
  const NS = 'http://www.w3.org/2000/svg';
  let idx = 0, busy = false;

  // Geometry: the fold line is x + y = s, sweeping from the bottom-right corner to the top-left.
  function clipHalf(poly, s, keepLE) {
    const out = [];
    for (let i = 0; i < poly.length; i++) {
      const a = poly[i], b = poly[(i + 1) % poly.length];
      const fa = a[0] + a[1] - s, fb = b[0] + b[1] - s;
      const ia = keepLE ? fa <= 0 : fa >= 0, ib = keepLE ? fb <= 0 : fb >= 0;
      if (ia) out.push(a);
      if (ia !== ib) { const t = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]); }
    }
    return out;
  }

  notes.forEach((note, i) => {
    // Slightly offset edges so the stack reads as a stack.
    const dx = i * 3, dy = i * 4, rot = (i % 2 ? 1 : -1) * i * 1.1 + (i === 0 ? -0.8 : 0);
    note.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
    note.style.zIndex = 10 - i;
    note.dataset.rot = rot;
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('class', 'flap');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = `<defs><linearGradient id="fg${i}" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#c9bb72"/><stop offset=".5" stop-color="#e8dc96"/><stop offset="1" stop-color="#f3e9b0"/></linearGradient></defs><polygon fill="url(#fg${i})" stroke="rgba(0,0,0,.12)" stroke-width=".8"/>`;
    note.appendChild(svg);
    note._s = null;
    if (i > 0) { note.inert = true; note.tabIndex = -1; }
  });

  function render(note, s) {
    const w = note.offsetWidth, h = note.offsetHeight;
    note._s = s;
    const rect = [[0, 0], [w, 0], [w, h], [0, h]];
    const face = clipHalf(rect, s, true);
    const gone = clipHalf(rect, s, false);
    const flap = gone.map(([x, y]) => [s - y, s - x]);
    const f = note.querySelector('.face');
    f.style.clipPath = face.length >= 3 ? 'polygon(' + face.map(p => p[0] + 'px ' + p[1] + 'px').join(',') + ')' : 'polygon(0 0,0 0,0 0)';
    const g = note.querySelector('linearGradient');
    g.setAttribute('x1', s / 2); g.setAttribute('y1', s / 2); g.setAttribute('x2', s / 2 - 70); g.setAttribute('y2', s / 2 - 70);
    note.querySelector('polygon').setAttribute('points', flap.length >= 3 ? flap.map(p => p.join(',')).join(' ') : '');
  }

  const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  function tween(note, to, dur, onDone, fade) {
    const from = note._s, t0 = performance.now();
    (function step(now) {
      const t = Math.min(1, (now - t0) / dur), e = ease(t);
      render(note, from + (to - from) * e);
      if (fade) {
        const k = t > 0.78 ? (t - 0.78) / 0.22 : 0;
        note.style.opacity = 1 - k;
        note.style.translate = `${-30 * k}px ${-26 * k}px`;
      }
      if (t < 1) requestAnimationFrame(step); else onDone && onDone();
    })(t0);
  }

  const dims = n => n.offsetWidth + n.offsetHeight;
  notes.forEach(n => render(n, dims(n)));

  function hover(on) {
    const n = notes[idx];
    if (!n || busy || reduce()) return;
    tween(n, dims(n) - (on ? 30 : 0), 180);
  }
  stack.addEventListener('pointerover', e => { if (e.target.closest('.note') === notes[idx]) hover(true); });
  stack.addEventListener('pointerout', e => { if (e.target.closest('.note') === notes[idx]) hover(false); });
  stack.addEventListener('focusin', e => { if (e.target === notes[idx]) hover(true); });
  stack.addEventListener('focusout', e => { if (e.target === notes[idx]) hover(false); });

  function setProgress(n, save) {
    portrait.style.setProperty('--gray', GRAY[n]);
    portrait.classList.toggle('full-colour', n >= notes.length);
    cue.classList.toggle('gone', n > 0);
    if (save) { try { sessionStorage.setItem('kg-peeled', n); } catch (e) {} }
  }

  function advance() {
    notes[idx].remove();
    idx++;
    setProgress(idx, true);
    busy = false;
    if (idx < notes.length) {
      const next = notes[idx];
      next.inert = false; next.tabIndex = 0;
      next.setAttribute('aria-label', `Note ${idx + 1} of ${notes.length}. ${idx < notes.length - 1 ? 'Peel to read the next.' : 'Peel to see the full photo.'}`);
      next.focus({ preventScroll: true });
      status.textContent = `Note ${idx + 1} of ${notes.length}`;
    } else {
      status.textContent = 'All notes peeled. The portrait is now in full colour.';
      stack.hidden = true;
    }
  }

  stack.addEventListener('click', e => {
    const note = e.target.closest('.note');
    if (!note || note !== notes[idx] || busy) return;
    busy = true;
    if (reduce()) {
      note.style.transition = 'opacity .25s';
      note.style.opacity = 0;
      setTimeout(advance, 260);
    } else {
      tween(note, dims(note) * 0.12, 1000, advance, true);
    }
  });

  // Restore progress after leaving and coming back.
  let saved = 0;
  try { saved = Math.min(notes.length, parseInt(sessionStorage.getItem('kg-peeled') || '0', 10) || 0); } catch (e) {}
  if (saved) {
    for (let i = 0; i < saved; i++) notes[i].remove();
    idx = saved;
    setProgress(idx, false);
    if (idx < notes.length) { notes[idx].inert = false; notes[idx].tabIndex = 0; } else stack.hidden = true;
  }

  /* ---------- Process folder ---------- */
  const folder = document.getElementById('folder');
  const toggle = document.getElementById('folder-toggle');
  const folderCue = document.getElementById('folder-cue');
  const tabs = [...folder.querySelectorAll('.sheet-tabs [role=tab]')];
  const sheets = [...folder.querySelectorAll('.sheet')];
  let active = 0;

  function showSheet(i, focus) {
    active = i;
    sheets.forEach((s, k) => s.classList.toggle('is-active', k === i));
    tabs.forEach((t, k) => { t.setAttribute('aria-selected', k === i); t.tabIndex = k === i ? 0 : -1; });
    if (focus) tabs[i].focus();
  }
  function setOpen(open) {
    folder.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
    folderCue.textContent = open ? 'Close folder ↑' : 'Open folder ↓';
    tabs.forEach(t => { if (!open) t.tabIndex = -1; });
    if (open) showSheet(active, false);
    else sheets.forEach(s => s.classList.remove('is-active'));
  }
  toggle.addEventListener('click', () => setOpen(!folder.classList.contains('open')));
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => showSheet(i, false));
    t.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); showSheet((i + 1) % tabs.length, true); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); showSheet((i + tabs.length - 1) % tabs.length, true); }
    });
  });
  setOpen(false);

  /* ---------- Nav: current section while scrolling ---------- */
  const work = document.getElementById('work');
  function spy() {
    const y = window.scrollY + 140;
    window.setNavCurrent(y >= work.offsetTop + work.offsetParent.offsetTop ? 'work' : 'home');
  }
  addEventListener('scroll', spy, { passive: true });
  addEventListener('resize', () => notes.forEach(n => n.isConnected && render(n, n._s ?? dims(n))));
  spy();
})();
