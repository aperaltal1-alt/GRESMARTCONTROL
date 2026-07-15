const NAVIGATION = [
  { group: 'Principal', items: [
    { label: 'Dashboard Ejecutivo', href: 'dashboard-ejecutivo.html', icon: 'bar-chart-3' },
    { label: 'Dashboard Operativo', href: 'dashboard-operativo.html', icon: 'layout-dashboard' },
  ]},
  { group: 'Operaciones', items: [
    { label: 'GRE', href: 'gre.html', icon: 'file-text' },
    { label: 'Productos', href: 'productos.html', icon: 'package' },
    { label: 'Inventario', href: 'inventario.html', icon: 'warehouse' },
    { label: 'Kardex', href: 'kardex.html', icon: 'arrow-left-right' },
    { label: 'Conciliación', href: 'conciliacion.html', icon: 'scale' },
    { label: 'Trazabilidad', href: 'trazabilidad.html', icon: 'route' },
  ]},
  { group: 'Control', items: [
    { label: 'Alertas', href: 'alertas.html', icon: 'bell', badge: '3' },
    { label: 'Incidencias', href: 'incidencias.html', icon: 'alert-triangle', badge: '8' },
    { label: 'Reportes', href: 'reportes.html', icon: 'file-spreadsheet' },
  ]},
  { group: 'Sistema', items: [
    { label: 'Configuración', href: 'configuracion.html', icon: 'settings' },
    { label: 'Usuarios', href: 'usuarios.html', icon: 'users' },
  ]},
];

function getCurrentPage() {
  return window.location.pathname.split('/').pop() || 'index.html';
}

function renderSidebar() {
  const current = getCurrentPage();
  let html = `
    <button class="sidebar-collapse-btn" id="sidebar-collapse" aria-label="Colapsar sidebar">
      <i data-lucide="chevrons-left" style="width:14px;height:14px"></i>
    </button>
    <div class="sidebar-logo">
      <div class="logo-icon">G</div>
      <div>
        <div class="logo-text">GRE Smart Control</div>
        <div class="logo-sub">Trazabilidad & Cumplimiento</div>
      </div>
    </div>
    <nav class="sidebar-nav" role="navigation" aria-label="Menú principal">`;

  NAVIGATION.forEach(group => {
    html += `<div class="nav-group"><div class="nav-group-title">${group.group}</div>`;
    group.items.forEach(item => {
      const active = current === item.href ? ' active' : '';
      const badge = item.badge ? `<span class="nav-badge">${item.badge}</span>` : '';
      html += `<a href="${item.href}" class="nav-item${active}" aria-current="${active ? 'page' : 'false'}">
        <i data-lucide="${item.icon}"></i>
        <span>${item.label}</span>${badge}
      </a>`;
    });
    html += '</div>';
  });

  html += `</nav>
    <div class="sidebar-user">
      <div class="avatar" aria-hidden="true">JP</div>
      <div>
        <div class="user-name">Juan Pérez</div>
        <div class="user-role">Administrador</div>
      </div>
    </div>`;
  return html;
}

function renderHeader(title, breadcrumb) {
  return `
    <button class="header-btn" id="menu-toggle" style="display:none" aria-label="Abrir menú">
      <i data-lucide="menu"></i>
    </button>
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <a href="dashboard-ejecutivo.html">Inicio</a>
      <span class="sep" aria-hidden="true">/</span>
      <span class="current">${breadcrumb || title}</span>
    </nav>
    <div class="header-spacer"></div>
    <div class="search-box" role="search" tabindex="0" aria-label="Búsqueda global">
      <i data-lucide="search" style="width:16px;height:16px"></i>
      <span>Buscar en el sistema...</span>
      <kbd>⌘K</kbd>
    </div>
    <button class="header-btn" title="Notificaciones" aria-label="3 notificaciones">
      <i data-lucide="bell"></i>
      <span class="notif-badge">3</span>
    </button>
    <button class="header-btn" id="theme-toggle" title="Cambiar tema" aria-label="Cambiar tema">
      <i data-lucide="sun" id="theme-icon"></i>
    </button>
    <button class="header-btn" title="Perfil" aria-label="Menú de usuario">
      <i data-lucide="user"></i>
    </button>`;
}

function initApp(title, breadcrumb) {
  const sidebar = document.getElementById('sidebar');
  const header = document.getElementById('header');
  if (sidebar) sidebar.innerHTML = renderSidebar();
  if (header) header.innerHTML = renderHeader(title, breadcrumb);

  const theme = localStorage.getItem('theme') || 'light';
  document.documentElement.classList.toggle('dark', theme === 'dark');

  document.body.classList.add('page-enter');

  if (window.lucide) lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
});
