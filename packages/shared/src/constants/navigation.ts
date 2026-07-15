export interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles: ('ADMIN' | 'SUPERVISOR' | 'CONSULTA')[];
  badge?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navigation: NavGroup[] = [
  {
    title: 'Principal',
    items: [
      { label: 'Dashboard Ejecutivo', href: '/dashboard/ejecutivo', icon: 'BarChart3', roles: ['ADMIN', 'SUPERVISOR', 'CONSULTA'] },
      { label: 'Dashboard Operativo', href: '/dashboard/operativo', icon: 'LayoutDashboard', roles: ['ADMIN', 'SUPERVISOR', 'CONSULTA'] },
    ],
  },
  {
    title: 'Operaciones',
    items: [
      { label: 'GRE', href: '/gre', icon: 'FileText', roles: ['ADMIN', 'SUPERVISOR', 'CONSULTA'] },
      { label: 'Productos', href: '/products', icon: 'Package', roles: ['ADMIN', 'SUPERVISOR', 'CONSULTA'] },
      { label: 'Inventario', href: '/inventario', icon: 'Warehouse', roles: ['ADMIN', 'SUPERVISOR', 'CONSULTA'] },
      { label: 'Kardex', href: '/kardex', icon: 'ArrowLeftRight', roles: ['ADMIN', 'SUPERVISOR', 'CONSULTA'] },
      { label: 'Conciliación', href: '/conciliacion', icon: 'Scale', roles: ['ADMIN', 'SUPERVISOR', 'CONSULTA'] },
      { label: 'Trazabilidad', href: '/trazabilidad', icon: 'Route', roles: ['ADMIN', 'SUPERVISOR', 'CONSULTA'] },
    ],
  },
  {
    title: 'Control',
    items: [
      { label: 'Alertas', href: '/alertas', icon: 'Bell', roles: ['ADMIN', 'SUPERVISOR', 'CONSULTA'], badge: 'alertas' },
      { label: 'Incidencias', href: '/incidencias', icon: 'AlertTriangle', roles: ['ADMIN', 'SUPERVISOR', 'CONSULTA'], badge: 'incidencias' },
      { label: 'Reportes', href: '/reportes', icon: 'FileSpreadsheet', roles: ['ADMIN', 'SUPERVISOR', 'CONSULTA'] },
    ],
  },
  {
    title: 'Sistema',
    items: [
      { label: 'Configuración', href: '/configuracion', icon: 'Settings', roles: ['ADMIN'] },
      { label: 'Usuarios', href: '/usuarios', icon: 'Users', roles: ['ADMIN'] },
    ],
  },
];

export const configSubNav: NavItem[] = [
  { label: 'Empresas', href: '/configuracion/empresas', icon: 'Building2', roles: ['ADMIN'] },
  { label: 'Parámetros', href: '/configuracion/parametros', icon: 'SlidersHorizontal', roles: ['ADMIN'] },
  { label: 'Catálogos', href: '/configuracion/catalogos', icon: 'List', roles: ['ADMIN'] },
  { label: 'Tipos de Documento', href: '/configuracion/tipos-documento', icon: 'FileType', roles: ['ADMIN'] },
  { label: 'Series', href: '/configuracion/series', icon: 'Hash', roles: ['ADMIN'] },
  { label: 'Estados', href: '/configuracion/estados', icon: 'ToggleLeft', roles: ['ADMIN'] },
];

export const DESIGN_TOKENS = {
  brand: { primary: '#2563EB', secondary: '#60A5FA', dark: '#1D4ED8' },
  semantic: { success: '#22C55E', warning: '#F59E0B', error: '#EF4444', info: '#0EA5E9' },
  surface: { light: '#F8FAFC', dark: '#0F172A' },
  font: { sans: 'Inter', mono: 'JetBrains Mono' },
} as const;
