/* ===== RHSC Lessons – Shared Script (v3, toggle reveal) ===== */
(function(){
  const buttons = Array.from(document.querySelectorAll('.tab-button'));
  const panels  = Array.from(document.querySelectorAll('.tab-content'));

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

    // Keep hash in sync (no jump)
    const newHash = '#'+id;
    if(location.hash !== newHash){
      history.replaceState(null, '', newHash);
    }

    // Auto-build "Show All"
    if(id === 'all'){ buildShowAll(); }
  }

  function buildShowAll(){
    const all = document.getElementById('all');
    if(!all) return;

    // Remove previous clones (keep first child elements that are not __clone)
    Array.from(all.querySelectorAll('.__clone')).forEach(n => n.remove());

    const ids = panels.map(p => p.id).filter(pid => pid && pid !== 'all');
    ids.forEach(pid => {
      const src = document.getElementById(pid);
      if(!src) return;
      const clone = src.cloneNode(true);
      clone.classList.add('active','__clone'); // ensure visible, mark as clone

      // In "Show All", remove reveal button to avoid confusion
      const btn = clone.querySelector('#reveal-all');
      if(btn) btn.remove();

      all.appendChild(clone);
    });
  }

  // Click handlers
  buttons.forEach(btn => {
    btn.setAttribute('role','tab');
    btn.addEventListener('click', () => showTab(btn.dataset.tab));
  });
  const tablist = document.querySelector('.tabs');
  if(tablist) tablist.setAttribute('role','tablist');
  panels.forEach(p => {
    p.setAttribute('role','tabpanel');
    p.setAttribute('aria-hidden', String(!p.classList.contains('active')));
  });

  // Keyboard nav (Up/Down for sidebar, Left/Right for topbar)
  document.addEventListener('keydown', (e) => {
    const horiz = ['ArrowLeft','ArrowRight'].includes(e.key);
    const vert  = ['ArrowUp','ArrowDown'].includes(e.key);
    if(!horiz && !vert) return;
    const currentIdx = buttons.findIndex(b => b.classList.contains('active'));
    if(currentIdx < 0) return;
    const delta = (e.key === 'ArrowRight' || e.key === 'ArrowDown') ? 1 : -1;
    const nextIdx = (currentIdx + delta + buttons.length) % buttons.length;
    buttons[nextIdx].focus();
    showTab(buttons[nextIdx].dataset.tab);
  });

  // Init from hash or default to first button
  const initial = (location.hash || '').replace('#','') || (buttons[0] && buttons[0].dataset.tab);
  if(initial) showTab(initial);

  // ===== Global Reveal Toggle =====
  // Any page can include:
  //  - <button id="reveal-all" class="reveal">Reveal Answers</button>
  //  - answers marked with .answer or .answer.badge
  const reveal = document.getElementById('reveal-all');
  if(reveal){
    let visible = false;
    const setVisible = (on) => {
      visible = on;
      document.querySelectorAll('.answer, .answer.badge').forEach(el => {
        el.style.display = visible ? 'inline-block' : 'none';
      });
      reveal.classList.toggle('active', visible);
      reveal.textContent = visible ? 'Hide Answers' : 'Reveal Answers';
    };

    // init state (hidden)
    setVisible(false);
    reveal.addEventListener('click', () => setVisible(!visible));
  }

  // ===== Force scroll-to-top on load =====
  // ensures Do Now section + title visible when file first opens
  window.addEventListener('load', () => {
    // Delay a fraction to let layout stabilise
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
      document.body.scrollTop = 0;        // Safari
      document.documentElement.scrollTop = 0;
    }, 50);
  });
  // ===== Global Reveal Toggle =====
  const reveal = document.getElementById('reveal-all');
  if(reveal){
    let visible = false;
    const setVisible = (on) => {
      visible = on;
      document.querySelectorAll('.answer, .answer.badge').forEach(el => {
        el.style.display = visible ? 'inline-block' : 'none';
      });
      reveal.classList.toggle('active', visible);
      reveal.textContent = visible ? 'Hide Answers' : 'Reveal Answers';
    };
    setVisible(false);
    reveal.addEventListener('click', () => setVisible(!visible));
  }

  // ===== Per-activity Sample Answers toggles =====
  // Any button with data-toggle="samples" and data-target="#id" will toggle that block
  document.querySelectorAll('[data-toggle="samples"]').forEach((btn) => {
    const target = document.querySelector(btn.dataset.target);
    if (!target) return;

    // init hidden
    target.classList.remove('active');
    btn.classList.remove('active');
    btn.textContent = btn.textContent || 'Show Sample Answers';

    btn.addEventListener('click', () => {
      const isOpen = target.classList.toggle('active');
      btn.classList.toggle('active', isOpen);
      btn.textContent = isOpen ? 'Hide Sample Answers' : 'Show Sample Answers';
    });
  });

})();

})();

