const projects = [
  { title: 'Timmo', subtitle: 'Timmer with leaderboard and analytics.', live: true,
    description: 'A clean productivity app for tracking time and staying consistent. Focus, manage tasks, and visualize your progress with insightful stats.',
    tags: ['React', 'Tailwind CSS', 'Shadcn UI'], web: '#', github: '#' },
  { title: 'Timmo', subtitle: 'Timmer with leaderboard and analytics.', live: true,
    description: 'A clean productivity app for tracking time and staying consistent. Focus, manage tasks, and visualize your progress with insightful stats.',
    tags: ['React', 'Tailwind CSS', 'Shadcn UI'], web: '#', github: '#' },
  { title: 'Timmo', subtitle: 'Timmer with leaderboard and analytics.', live: true,
    description: 'A clean productivity app for tracking time and staying consistent. Focus, manage tasks, and visualize your progress with insightful stats.',
    tags: ['React', 'Tailwind CSS', 'Shadcn UI'], web: '#', github: '#' },
];

const webIcon = '<img src="assets/web.svg" width="20" height="20" alt="" />';
const ghIcon = '<img src="assets/github.svg" width="20" height="20" alt="" />';

document.getElementById('project-list').innerHTML = projects.map(p => `
  <article class="card">
    <div class="card-img"></div>
    <div class="card-body">
      <div class="title-row">
        <div><h3>${p.title}</h3><p class="sub">${p.subtitle}</p></div>
        ${p.live ? '<span class="live"><img src="assets/dot.svg" width="6" height="6" alt="" />Live</span>' : ''}
      </div>
      <p class="desc">${p.description}</p>
      <div class="card-foot">
        <div class="tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>
        <div class="links"><a href="${p.web}" aria-label="Website">${webIcon}</a><a href="${p.github}" aria-label="GitHub">${ghIcon}</a></div>
      </div>
    </div>
  </article>`).join('');

/* ---- black strings pinned between elements ---- */
const column = document.querySelector('.column');
const SVG_NS = 'http://www.w3.org/2000/svg';
const pinTargets = () => [
  ['.note-left', 0.9], ['.photo', 0.5], ['.note-right', 0.1],
  ...[...document.querySelectorAll('.card-img')].map(el => [el, 0.5]),
  ['.cta .btn', 0.5], ['.quote p', 0.5], ['.footer p', 0.5],
];

function drawStrings() {
  column.querySelectorAll('.strings, .pins').forEach(n => n.remove());
  const box = column.getBoundingClientRect();
  const border = column.clientLeft;
  const pts = pinTargets().map(([sel, fx]) => {
    const el = typeof sel === 'string' ? document.querySelector(sel) : sel;
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left - box.left - border + r.width * fx, y: r.top - box.top - column.clientTop + 4 };
  }).filter(Boolean);

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'strings');
  svg.setAttribute('height', column.clientHeight);
  const add = (tag, attrs, parent = svg) => {
    const n = document.createElementNS(SVG_NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    parent.appendChild(n); return n;
  };

  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i], b = pts[i + 1];
    const dist = Math.hypot(b.x - a.x, b.y - a.y);
    const sag = Math.min(90, dist * 0.18);
    const d = `M${a.x},${a.y} Q${(a.x + b.x) / 2},${(a.y + b.y) / 2 + sag} ${b.x},${b.y}`;
    add('path', { d, class: 'string-shadow', transform: 'translate(2,4)' });
    add('path', { d, class: 'string' });
  }
  const pinSvg = document.createElementNS(SVG_NS, 'svg');
  pinSvg.setAttribute('class', 'pins');
  pinSvg.setAttribute('height', column.clientHeight);
  const addP = (tag, attrs, parent = pinSvg) => {
    const n = document.createElementNS(SVG_NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    parent.appendChild(n); return n;
  };
  const pdefs = addP('defs', {});
  const pf = addP('filter', { id: 'pin-shadow', x: '-50%', y: '-50%', width: '200%', height: '200%' }, pdefs);
  addP('feDropShadow', { dx: 1.5, dy: 3, stdDeviation: 2, 'flood-opacity': .4 }, pf);
  pts.forEach(p => {
    const g = addP('g', { filter: 'url(#pin-shadow)' });
    addP('circle', { cx: p.x, cy: p.y, r: 8, fill: '#d62839' }, g);
    addP('circle', { cx: p.x, cy: p.y, r: 8, fill: 'none', stroke: '#8f1322', 'stroke-width': 1.5 }, g);
    addP('circle', { cx: p.x - 2.5, cy: p.y - 2.5, r: 2.5, fill: '#fff', 'fill-opacity': .55 }, g);
  });
  column.appendChild(svg);
  column.appendChild(pinSvg);
}

window.addEventListener('load', drawStrings);
window.addEventListener('resize', drawStrings);
document.fonts?.ready.then(drawStrings);
drawStrings();
