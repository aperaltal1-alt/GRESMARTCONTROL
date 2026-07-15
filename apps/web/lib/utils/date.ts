function parseLocalDate(dateStr: string): Date {
  return new Date(dateStr.includes('T') ? dateStr : `${dateStr}T12:00:00`);
}

/** Fecha corta con día, mes y año (es-PE). */
export function formatShortDate(dateStr: string): string {
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parseLocalDate(dateStr));
}

/** Fecha corta sin año (es-PE). */
export function formatShortDateCompact(dateStr: string): string {
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
  }).format(parseLocalDate(dateStr));
}

export function formatDateTime(dateStr: string): string {
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}
