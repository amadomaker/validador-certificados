export function initMobileMenu() {
  const btn = document.querySelector('.hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  const open = () => {
    btn.classList.add('is-open');
    btn.setAttribute('aria-expanded','true');
    menu.hidden = false;
  };
  const close = () => {
    btn.classList.remove('is-open');
    btn.setAttribute('aria-expanded','false');
    menu.hidden = true;
  };
  const toggle = () => (menu.hidden ? open() : close());

  btn.addEventListener('click', toggle);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) close();
  });
  document.addEventListener('click', (e) => {
    if (menu.hidden) return;
    if (!menu.contains(e.target) && !btn.contains(e.target)) close();
  });
}
