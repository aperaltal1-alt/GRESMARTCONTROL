export type TraceabilitySearchMode = 'product' | 'gre';

export type TraceabilityEventType = 'KARDEX' | 'GRE' | 'RECONCILIATION' | 'INCIDENT';

export interface TraceabilityEvent {
  id: string;
  type: TraceabilityEventType;
  title: string;
  description: string;
  date: string;
  meta?: string;
  status?: string;
}

export interface TraceabilityProductContext {
  productoId: string;
  codigo: string;
  nombre: string;
  categoria: string;
  stockActual: number;
}

export interface TraceabilityGreContext {
  greId: string;
  serie: string;
  numero: string;
  estado: string;
  fecha: string;
}
