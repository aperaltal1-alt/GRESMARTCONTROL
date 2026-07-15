# Prototipo UI/UX — GRE SMART CONTROL

Prototipo navegable de alta fidelidad para validación de diseño (Fase 2).

## Inicio rápido

Abrir `login.html` en cualquier navegador moderno.

```
design/prototype/login.html
```

## Navegación

- **Sidebar:** Navega entre las 15 pantallas del MVP
- **Header:** Breadcrumb, búsqueda, notificaciones, tema, perfil
- **Tema:** Click en ☀/🌙 para alternar Light/Dark mode

## Estructura

```
prototype/
├── css/
│   ├── tokens.css       # Variables de diseño (colores, espaciado)
│   ├── layout.css       # Sidebar, header, footer
│   └── components.css   # Cards, badges, tablas, timeline, etc.
├── js/
│   └── app.js           # Navegación, tema, sidebar
├── login.html
├── dashboard-ejecutivo.html
├── dashboard-operativo.html
├── gre.html
├── productos.html
├── inventario.html
├── kardex.html
├── stock-fisico.html
├── conciliacion.html
├── trazabilidad.html
├── alertas.html
├── incidencias.html
├── reportes.html
├── configuracion.html
└── usuarios.html
```

## Tecnologías

- HTML5 + CSS3 (design tokens)
- Lucide Icons (CDN)
- Sin frameworks JS (prototipo estático)
- Responsive via CSS media queries

## Nota

Este prototipo es un **entregable de diseño**, no la aplicación final.
La implementación en React + Next.js se realiza en la Fase 5.
