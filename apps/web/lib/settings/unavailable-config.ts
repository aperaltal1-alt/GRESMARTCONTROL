export const CONFIG_UNAVAILABLE = {
  parametros: {
    title: 'Parámetros no disponibles',
    description:
      'La configuración de parámetros globales requiere un módulo de API que aún no está implementado.',
  },
  catalogos: {
    title: 'Catálogos no disponibles',
    description: 'La gestión de catálogos maestros no está expuesta en la API del MVP.',
  },
  tiposDocumento: {
    title: 'Tipos de documento no disponibles',
    description:
      'Los tipos de documento se crean automáticamente al registrar GRE. No hay CRUD expuesto.',
  },
  series: {
    title: 'Series no disponibles',
    description:
      'Las series documentales se gestionan internamente al crear GRE. No hay API de administración.',
  },
  estados: {
    title: 'Estados no disponibles',
    description: 'Los estados operativos se definen en el backend. No hay endpoint de configuración.',
  },
} as const;
