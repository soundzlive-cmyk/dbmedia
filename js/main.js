/* DB Media — site interactions */

// Where quote requests are sent. Replace with your real address.
const CONTACT_EMAIL = 'hello@yourdomain.com';

document.addEventListener('DOMContentLoaded', () => {
  // Footer year
  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  // Mobile menu
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // Hero rotating word + chips
  const rotator = document.querySelector('[data-rotator]');
  const chips = [...document.querySelectorAll('[data-word]')];
  if (rotator && chips.length) {
    let i = 0;
    const show = (n) => {
      i = n;
      rotator.textContent = chips[n].dataset.word;
      rotator.classList.remove('in'); void rotator.offsetWidth; rotator.classList.add('in');
      chips.forEach((c, k) => c.setAttribute('aria-pressed', String(k === n)));
    };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let timer = reduce ? null : setInterval(() => show((i + 1) % chips.length), 2400);
    chips.forEach((c, k) => c.addEventListener('click', () => { clearInterval(timer); timer = null; show(k); }));
  }

  // Service tabs
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  if (tabs.length) {
    const select = (tab) => {
      tabs.forEach((t) => {
        const on = t === tab;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
    };
    tabs.forEach((t, k) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', (e) => {
        if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(e.key)) return;
        e.preventDefault();
        const dir = (e.key === 'ArrowDown' || e.key === 'ArrowRight') ? 1 : -1;
        const next = tabs[(k + dir + tabs.length) % tabs.length];
        select(next); next.focus();
      });
    });
  }

  // Work filters
  const filters = [...document.querySelectorAll('[data-filter]')];
  const projects = [...document.querySelectorAll('.project')];
  filters.forEach((f) => f.addEventListener('click', () => {
    const cat = f.dataset.filter;
    filters.forEach((x) => x.setAttribute('aria-pressed', String(x === f)));
    projects.forEach((p) => { p.hidden = !(cat === 'All' || p.dataset.cat === cat); });
  }));

  // Lightbox
  const lb = document.querySelector('.lightbox');
  if (lb) {
    const img = lb.querySelector('img');
    const url = lb.querySelector('.lightbox-url');
    const title = lb.querySelector('h3');
    const visit = lb.querySelector('[data-visit]');
    const close = lb.querySelector('[data-close]');
    let lastFocus = null;
    const openLb = (p) => {
      lastFocus = document.activeElement;
      img.src = p.dataset.img; img.alt = p.dataset.name + ' homepage';
      url.textContent = p.dataset.domain; title.textContent = p.dataset.name; visit.href = p.dataset.url;
      lb.classList.add('open'); document.body.style.overflow = 'hidden'; close.focus();
    };
    const closeLb = () => { lb.classList.remove('open'); document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); };
    document.querySelectorAll('[data-preview]').forEach((b) => b.addEventListener('click', () => openLb(b.closest('.project'))));
    close.addEventListener('click', closeLb);
    lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lb.classList.contains('open')) closeLb(); });
  }

  // Process steps
  const steps = [...document.querySelectorAll('.step')];
  const bar = document.querySelector('.progress div');
  steps.forEach((s, k) => s.addEventListener('click', () => {
    steps.forEach((x) => x.setAttribute('aria-expanded', String(x === s)));
    if (bar) bar.style.width = ((k + 1) / steps.length * 100) + '%';
  }));

  // Quote builder
  const builder = document.querySelector('[data-builder]');
  if (builder) {
    const summary = document.querySelector('.summary');
    const typeOut = summary.querySelector('[data-out="type"]');
    const featOut = summary.querySelector('[data-out="features"]');
    const timeOut = summary.querySelector('[data-out="time"]');
    const state = { type: 'New website', features: ['Mobile-friendly design'], time: '1–2 months' };

    const render = () => {
      typeOut.textContent = state.type;
      timeOut.textContent = state.time;
      featOut.innerHTML = '';
      if (!state.features.length) {
        const em = document.createElement('em'); em.textContent = 'No features picked yet'; featOut.appendChild(em);
      }
      state.features.forEach((f) => { const s = document.createElement('span'); s.textContent = f; featOut.appendChild(s); });
      builder.querySelectorAll('[data-group]').forEach((b) => {
        const g = b.dataset.group; const v = b.dataset.value;
        const on = g === 'features' ? state.features.includes(v) : state[g] === v;
        b.setAttribute('aria-pressed', String(on));
        if (g === 'features') b.textContent = (on ? '✓ ' : '+ ') + v;
      });
    };

    builder.querySelectorAll('[data-group]').forEach((b) => b.addEventListener('click', () => {
      const g = b.dataset.group; const v = b.dataset.value;
      if (g === 'features') {
        state.features = state.features.includes(v) ? state.features.filter((x) => x !== v) : state.features.concat(v);
      } else {
        state[g] = v;
      }
      render();
    }));

    const form = summary.querySelector('form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const name = form.elements.name.value.trim();
      const email = form.elements.email.value.trim();
      const details = form.elements.details ? form.elements.details.value.trim() : '';
      const body = [
        'Name: ' + name,
        'Email: ' + email,
        'Project: ' + state.type,
        'Features: ' + (state.features.join(', ') || 'None selected'),
        'Launch: ' + state.time,
        details ? '\nDetails:\n' + details : ''
      ].join('\n');
      window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent('New project request — ' + state.type) + '&body=' + encodeURIComponent(body);
      summary.classList.add('sent');
    });
    summary.querySelector('[data-reset]').addEventListener('click', () => { form.reset(); summary.classList.remove('sent'); });
    render();
  }
});
