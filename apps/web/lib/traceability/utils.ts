import type { GreListItem } from '@/types/gre';
import type { Incident } from '@/types/incidents';
import type { KardexMovement } from '@/types/kardex';
import type { ReconciliationSummary } from '@/types/reconciliation';
import type { TraceabilityEvent } from '@/types/traceability';

export function buildProductTimeline(movements: KardexMovement[]): TraceabilityEvent[] {
  return movements.map((m) => ({
    id: m.id,
    type: 'KARDEX' as const,
    title: `Movimiento ${m.tipo}`,
    description: `${m.codigoProducto} — ${m.nombreProducto}`,
    date: m.fecha,
    meta: `Cantidad: ${m.cantidad} · Stock: ${m.saldoNuevo}`,
    status: m.tipo,
  }));
}

export function buildGreTimeline(
  gre: GreListItem,
  reconciliations: ReconciliationSummary[],
  incidents: Incident[],
): TraceabilityEvent[] {
  const events: TraceabilityEvent[] = [
    {
      id: `gre-${gre.id}`,
      type: 'GRE',
      title: `GRE ${gre.serie}-${gre.numero}`,
      description: `Documento registrado — ${gre.totalProductos ?? 0} productos`,
      date: gre.createdAt ?? gre.fecha,
      status: gre.estado,
    },
  ];

  reconciliations.forEach((r) => {
    events.push({
      id: r.id,
      type: 'RECONCILIATION',
      title: `Conciliación v${r.version}`,
      description: `${r.lineasOk}/${r.totalLineas} líneas OK · ${r.lineasConDiferencia} con diferencia`,
      date: r.completadoAt ?? r.iniciadoAt,
      status: r.estado,
      meta: r.resultadoGre,
    });
  });

  incidents.forEach((i) => {
    events.push({
      id: i.id,
      type: 'INCIDENT',
      title: `Incidencia ${i.tipo}`,
      description: `${i.codigoProducto} — Diferencia ${i.diferencia}`,
      date: i.createdAt,
      status: i.estado,
      meta: i.prioridad,
    });
  });

  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function formatTraceabilityDate(dateStr: string): string {
  const date = new Date(dateStr.includes('T') ? dateStr : `${dateStr}T12:00:00`);
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
