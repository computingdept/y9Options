/* Tab controller with URL hash + ARIA for accessibility */
(function(){
  const buttons = Array.from(document.querySelectorAll('.tab-button'));
  const panels  = Array.from(document.querySelectorAll('.tab-content'));

  function showTab(id){
    // Update panels
    panels.forEach(p => {
      const isActive = p.id === id;
      p.classList.toggle('active', isActive);
      p.setAttribute('aria-hidden', String(!isActive));
    });

    // Update buttons
    buttons.forEach(b => {
      const isActive = b.dataset.tab === id;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-selected', String(isActive));
      b.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    // Keep location hash in sync (no scroll jump)
    const newHash = '#' + id;
    if (location.hash !== newHash) {
      history.replaceState(null, '', newHash);
    }
  }

  // Click handling
  buttons.forEach(btn => {
    btn.setAttribute('role', 'tab');
    btn.addEventListener('click', () => showTab(btn.dataset.tab));
  });
  const tablist = document.querySelector('.tabs');
  if (tablist) tablist.setAttribute('role', 'tablist');
  panels.forEach(p => {
    p.setAttribute('role', 'tabpanel');
    p.setAttribute('aria-hidden', String(!p.classList.contains('active')));
  });

  // Keyboard navigation (Left/Right)
  document.addEventListener('keydown', (e) => {
    if (!['ArrowLeft','ArrowRight'].includes(e.key)) return;
    const currentIdx = buttons.findIndex(b => b.classList.contains('active'));
    if (currentIdx < 0) return;
    const delta = e.key === 'ArrowRight' ? 1 : -1;
    const nextIdx = (currentIdx + delta + buttons.length) % buttons.length;
    buttons[nextIdx].focus();
    showTab(buttons[nextIdx].dataset.tab);
  });

  // Initialise from hash (default to first tab)
  const initial = (location.hash || '').replace('#','') || (buttons[0] && buttons[0].dataset.tab);
  if (initial) showTab(initial);
})();
