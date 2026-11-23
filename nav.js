/* Shared navigation behaviour: current-page underline, Resume link, toast. */
(function () {
  const page = document.body.dataset.page;               // home | work | about
  const links = document.querySelectorAll('.nav a[data-nav]');
  const setCurrent = (name) => links.forEach(a =>
    a.dataset.nav === name ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
  window.setNavCurrent = setCurrent;
  if (page) setCurrent(page);

  const toast = document.createElement('div');
  toast.className = 'toast'; toast.setAttribute('role', 'status');
  document.body.appendChild(toast);
  let t;
  window.showToast = (msg) => {
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(t); t = setTimeout(() => toast.classList.remove('show'), 3200);
  };

  const resume = document.getElementById('resume-link');
  const url = (window.SITE && window.SITE.resumeUrl) || '';
  if (resume) {
    if (url) resume.href = url;
    else resume.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Resume PDF not added yet. Set resumeUrl in config.js.');
    });
  }

  // Home link on the homepage scrolls to the top instead of reloading.
  const home = document.querySelector('.nav a[data-nav="home"]');
  if (home && page === 'home') home.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    history.replaceState(null, '', location.pathname);
  });
})();
