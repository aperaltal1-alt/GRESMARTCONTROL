/* GRE Smart Control — Prototype interactions (Framer Motion patterns) */

function animateCountUp(el, target, duration = 1200) {
  if (!el) return;
  const start = 0;
  const isPercent = String(target).includes('%');
  const num = parseFloat(target);
  const startTime = performance.now();

  function update(now) {
    const p = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = Math.round(start + (num - start) * eased);
    el.textContent = isPercent ? val + '%' : val.toLocaleString('es-PE');
    if (p < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function initCountUpKpis() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = el.dataset.count;
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateCountUp(el, target);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(el);
  });
}

function initSidebarCollapse() {
  const sidebar = document.getElementById('sidebar');
  const btn = document.getElementById('sidebar-collapse');
  if (!sidebar || !btn) return;

  const collapsed = localStorage.getItem('sidebar-collapsed') === 'true';
  if (collapsed) {
    sidebar.classList.add('collapsed');
    document.body.classList.add('sidebar-collapsed');
  }

  btn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    document.body.classList.toggle('sidebar-collapsed');
    localStorage.setItem('sidebar-collapsed', sidebar.classList.contains('collapsed'));
    if (window.lucide) lucide.createIcons();
  });
}

function initThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    document.documentElement.classList.add('theme-transitioning');
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
    setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 350);
  });
}

function updateThemeIcon() {
  const icon = document.getElementById('theme-icon');
  if (!icon) return;
  const isDark = document.documentElement.classList.contains('dark');
  icon.setAttribute('data-lucide', isDark ? 'moon' : 'sun');
  if (window.lucide) lucide.createIcons();
}

function initMobileSidebar() {
  const toggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');

  if (window.innerWidth <= 1023 && toggle) toggle.style.display = 'flex';

  toggle?.addEventListener('click', () => {
    sidebar?.classList.toggle('open');
    overlay?.classList.toggle('active');
  });

  overlay?.addEventListener('click', () => {
    sidebar?.classList.remove('open');
    overlay?.classList.remove('active');
  });
}

function initTableSort() {
  document.querySelectorAll('.data-table th[data-sort]').forEach(th => {
    th.style.cursor = 'pointer';
    th.addEventListener('click', () => {
      const table = th.closest('table');
      const tbody = table.querySelector('tbody');
      const idx = Array.from(th.parentNode.children).indexOf(th);
      const rows = Array.from(tbody.querySelectorAll('tr'));
      const asc = th.dataset.sort !== 'asc';
      th.dataset.sort = asc ? 'asc' : 'desc';

      table.querySelectorAll('th[data-sort]').forEach(h => {
        h.classList.remove('sort-asc', 'sort-desc');
      });
      th.classList.add(asc ? 'sort-asc' : 'sort-desc');

      rows.sort((a, b) => {
        const aVal = a.children[idx]?.textContent.trim() || '';
        const bVal = b.children[idx]?.textContent.trim() || '';
        const aNum = parseFloat(aVal.replace(/[^0-9.-]/g, ''));
        const bNum = parseFloat(bVal.replace(/[^0-9.-]/g, ''));
        if (!isNaN(aNum) && !isNaN(bNum)) return asc ? aNum - bNum : bNum - aNum;
        return asc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      });

      rows.forEach(r => tbody.appendChild(r));
    });
  });
}

function initTableSearch() {
  document.querySelectorAll('[data-table-search]').forEach(input => {
    const tableId = input.dataset.tableSearch;
    const table = document.getElementById(tableId);
    if (!table) return;

    input.addEventListener('input', () => {
      const q = input.value.toLowerCase();
      table.querySelectorAll('tbody tr').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
      });
    });
  });
}

function initTableFilter() {
  document.querySelectorAll('[data-table-filter]').forEach(select => {
    const tableId = select.dataset.tableFilter;
    const col = parseInt(select.dataset.filterCol || '0', 10);
    const table = document.getElementById(tableId);
    if (!table) return;

    select.addEventListener('change', () => {
      const val = select.value.toLowerCase();
      table.querySelectorAll('tbody tr').forEach(row => {
        if (!val) { row.style.display = ''; return; }
        const cell = row.children[col]?.textContent.toLowerCase() || '';
        row.style.display = cell.includes(val) ? '' : 'none';
      });
    });
  });
}

function showTableSkeleton(tableId, duration = 800) {
  const table = document.getElementById(tableId);
  if (!table) return;
  const tbody = table.querySelector('tbody');
  const original = tbody.innerHTML;
  tbody.innerHTML = Array(4).fill(0).map(() =>
    `<tr>${Array(table.querySelectorAll('thead th').length).fill('<td><div class="skeleton skeleton-text"></div></td>').join('')}</tr>`
  ).join('');
  setTimeout(() => { tbody.innerHTML = original; if (window.lucide) lucide.createIcons(); }, duration);
}

function initPeriodSelector() {
  document.querySelectorAll('.period-selector').forEach(group => {
    group.querySelectorAll('.period-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });
}

function initTabs() {
  document.querySelectorAll('.tabs').forEach(tabGroup => {
    tabGroup.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        tabGroup.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
      });
    });
  });
}

function initPageTransition() {
  document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', e => {
      if (link.getAttribute('href')?.startsWith('#')) return;
      e.preventDefault();
      const href = link.getAttribute('href');
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.2s ease';
      setTimeout(() => { window.location.href = href; }, 200);
    });
  });
}

function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function initPrototype() {
  initCountUpKpis();
  initSidebarCollapse();
  initThemeToggle();
  initMobileSidebar();
  initTableSort();
  initTableSearch();
  initTableFilter();
  initPeriodSelector();
  initTabs();
  initReveal();
}

document.addEventListener('DOMContentLoaded', initPrototype);
