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

const webIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.700 3.800 5.700 3.800 9S14.500 18.300 12 21c-2.500-2.700-3.800-5.700-3.800-9S9.500 5.700 12 3z"/></svg>';
const ghIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-3.200 19.500c.5.100.7-.2.7-.5v-1.800c-2.800.6-3.400-1.200-3.400-1.200-.5-1.200-1.100-1.500-1.100-1.500-.9-.6.100-.6.100-.6 1 .1 1.500 1 1.500 1 .9 1.500 2.400 1.100 2.900.8.1-.7.4-1.100.6-1.400-2.200-.3-4.600-1.100-4.600-5 0-1.100.4-2 1-2.700-.1-.3-.4-1.300.1-2.700 0 0 .8-.3 2.800 1a9.600 9.600 0 015 0c1.900-1.300 2.800-1 2.800-1 .5 1.400.2 2.400.1 2.700.6.700 1 1.600 1 2.700 0 3.900-2.400 4.700-4.600 5 .4.300.7.900.7 1.900v2.800c0 .3.200.6.700.5A10 10 0 0012 2z"/></svg>';

document.getElementById('project-list').innerHTML = projects.map(p => `
  <article class="card">
    <div class="card-img"></div>
    <div class="card-body">
      <div class="title-row">
        <div><h3>${p.title}</h3><p class="sub">${p.subtitle}</p></div>
        ${p.live ? '<span class="live"><i></i>Live</span>' : ''}
      </div>
      <p class="desc">${p.description}</p>
      <div class="card-foot">
        <div class="tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>
        <div class="links"><a href="${p.web}" aria-label="Website">${webIcon}</a><a href="${p.github}" aria-label="GitHub">${ghIcon}</a></div>
      </div>
    </div>
  </article>`).join('');
