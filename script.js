/* ===== RHSC Lessons – Shared Script (v4 stable) ===== */
document.addEventListener('DOMContentLoaded', () => {

  // --- cache elements after DOM is ready
  const buttons = Array.from(document.querySelectorAll('.tab-button'));
  const panels  = Array.from(document.querySelectorAll('.tab-content'));

  // Guard: if no tabs found, nothing to wire
  if (buttons.length === 0 || panels.length === 0) return;

  function showTab(id){
    if(!id) return;

    // Panels
    panels.forEach(p => {
      const active = p.id === id;
      p.classList.toggle('active', active);
      p.setAttribute('aria-hidden', String(!active));
    });

    // Buttons
    buttons.forEach(b => {
      const active = b.dataset.tab === id;
      b.classList.toggle('active', active);
      b.setAttribute('aria-selected', String(active));
      b.setAttribute('tabindex', active ? '0' : '-1');
    });

    // Sync hash without jump
    const newHash = '#' + id;
    if (location.hash !== newHash) {
      history.replaceState(null, '', newHash);
    }

    // Build Show All when needed
    if (id === 'all') buildShowAll();
  }

  function buildShowAll(){
    const all = document.getElementById('all');
    if(!all) return;

    // Remove prior clones
    Array.from(all.querySelectorAll('.__clone')).forEach(n => n.remove());

    // Order to display (only include if present)
    const order = ['do-now','learn','vocab','cs-activity','it-activity','exit-ticket'];
    order.forEach(pid => {
      const src = document.getElementById(pid);
      if(!src) return;
      const clone = src.cloneNode(true);
      clone.classList.add('active','__clone');

      // Remove any reveal button in the clone to avoid confusion
      const rb = clone.querySelector('#reveal-all');
      if (rb) rb.remove();

      all.appendChild(clone);
    });
  }

  // Wire tab buttons
  buttons.forEach(btn => {
    btn.setAttribute('role','tab');
    btn.addEventListener('click', () => showTab(btn.dataset.tab));
  });

  const tablist = document.querySelector('.tabs');
  if (tablist) tablist.setAttribute('role','tablist');

  panels.forEach(p => {
    p.setAttribute('role','tabpanel');
    p.setAttribute('aria-hidden', String(!p.classList.contains('active')));
  });

  // Keyboard navigation (Up/Down for sidebar, Left/Right for top)
  document.addEventListener('keydown', (e) => {
    if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) return;
    const currentIdx = buttons.findIndex(b => b.classList.contains('active'));
    if (currentIdx < 0) return;
    const forward = (e.key === 'ArrowRight' || e.key === 'ArrowDown');
    const delta = forward ? 1 : -1;
    const nextIdx = (currentIdx + delta + buttons.length) % buttons.length;
    buttons[nextIdx].focus();
    showTab(buttons[nextIdx].dataset.tab);
  });

  // Initialise from hash or first tab
  const initial = (location.hash || '').replace('#','') || (buttons[0] && buttons[0].dataset.tab);
  if (initial) showTab(initial);

  // ===== Reveal Answers (single toggle per page) =====
  // Works if the page includes a button with id="reveal-all"
  (function setupRevealToggle(){
    const revealBtn = document.getElementById('reveal-all');
    if (!revealBtn) return;
    let visible = false;
    const setVisible = (on) => {
      visible = on;
      document.querySelectorAll('.answer, .answer.badge').forEach(el => {
        el.style.display = visible ? 'inline-block' : 'none';
      });
      revealBtn.classList.toggle('active', visible);
      revealBtn.textContent = visible ? 'Hide Answers' : 'Reveal Answers';
    };
    setVisible(false);
    revealBtn.addEventListener('click', () => setVisible(!visible));
  })();

  // ===== Per-activity Sample Answers toggles =====
  // Any button:  data-toggle="samples" data-target="#elementId"
  (function setupSamplesToggles(){
    document.querySelectorAll('[data-toggle="samples"]').forEach((btn) => {
      const sel = btn.getAttribute('data-target');
      if (!sel) return;
      const target = document.querySelector(sel);
      if (!target) return;

      // init hidden
      target.classList.remove('active');
      btn.classList.remove('active');
      if (!btn.textContent.trim()) btn.textContent = 'Show Sample Answers';

      btn.addEventListener('click', () => {
        const isOpen = target.classList.toggle('active');
        btn.classList.toggle('active', isOpen);
        btn.textContent = isOpen ? 'Hide Sample Answers' : 'Show Sample Answers';
      });
    });
  })();

  // ===== Force scroll-to-top on load (after layout stabilises) =====
  window.addEventListener('load', () => {
    setTimeout(() => {
      // standards
      window.scrollTo(0, 0);
      // Safari variants
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }, 50);
  });

});
