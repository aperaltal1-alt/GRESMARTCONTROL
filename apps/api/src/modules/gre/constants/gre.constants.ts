export const GRE_CONSTANTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_NUMERO_LENGTH: 20,
  MAX_SERIE_LENGTH: 10,
  MAX_TRANSPORTISTA_LENGTH: 255,
  MAX_UBICACION_LENGTH: 500,
  TIPO_DOCUMENTO_CODIGO: 'GRE',
  ALLOWED_ESTADOS: ['PENDIENTE', 'CONCILIADA', 'CON_DIFERENCIA'] as const,
  ALLOWED_FILE_TYPES: ['XML', 'PDF'] as const,
  MIME_XML: ['application/xml', 'text/xml'] as string[],
  MIME_PDF: ['application/pdf'] as string[],
  EXT_XML: '.xml',
  EXT_PDF: '.pdf',
} as const;

export type GreEstadoMvp = (typeof GRE_CONSTANTS.ALLOWED_ESTADOS)[number];
export type GreFileTypeMvp = (typeof GRE_CONSTANTS.ALLOWED_FILE_TYPES)[number];
