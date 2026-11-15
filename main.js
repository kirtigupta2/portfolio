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
