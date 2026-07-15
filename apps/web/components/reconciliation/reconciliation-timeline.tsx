'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Check, Circle, GitCompare } from 'lucide-react';
import {
  formatDateTime,
  RECONCILIATION_TIMELINE_STEPS,
} from '@/lib/reconciliation/utils';
import { cn } from '@/lib/utils';
import type { ReconciliationEstado } from '@/types/reconciliation';

interface ReconciliationTimelineProps {
  estado: ReconciliationEstado | string;
  iniciadoAt: string;
  completadoAt: string | null;
  className?: string;
}

type StepStatus = 'completed' | 'current' | 'upcoming';

function getProcessStepStatus(estado: string): StepStatus {
  if (estado === 'EN_PROCESO') return 'current';
  if (estado === 'COMPLETADA' || estado === 'CON_DIFERENCIAS' || estado === 'ERROR') {
    return 'completed';
  }
  return 'upcoming';
}

function getCompletedStepStatus(estado: string): StepStatus {
  if (estado === 'EN_PROCESO') return 'upcoming';
  if (estado === 'COMPLETADA' || estado === 'CON_DIFERENCIAS' || estado === 'ERROR') {
    return 'current';
  }
  return 'upcoming';
}

export function ReconciliationTimeline({
  estado,
  iniciadoAt,
  completadoAt,
  className,
}: ReconciliationTimelineProps) {
  const steps = [
    {
      key: RECONCILIATION_TIMELINE_STEPS[0].key,
      label: RECONCILIATION_TIMELINE_STEPS[0].label,
      description: RECONCILIATION_TIMELINE_STEPS[0].description,
      date: iniciadoAt,
      status: 'completed' as const,
      icon: Check,
    },
    {
      key: RECONCILIATION_TIMELINE_STEPS[1].key,
      label: RECONCILIATION_TIMELINE_STEPS[1].label,
      description: RECONCILIATION_TIMELINE_STEPS[1].description,
      date: estado !== 'EN_PROCESO' ? completadoAt ?? undefined : undefined,
      status: getProcessStepStatus(estado),
      icon: GitCompare,
    },
    {
      key: RECONCILIATION_TIMELINE_STEPS[2].key,
      label: RECONCILIATION_TIMELINE_STEPS[2].label,
      description:
        estado === 'CON_DIFERENCIAS'
          ? 'Conciliación finalizada con diferencias detectadas'
          : estado === 'ERROR'
            ? 'La conciliación finalizó con errores'
            : RECONCILIATION_TIMELINE_STEPS[2].description,
      date: completadoAt ?? undefined,
      status: getCompletedStepStatus(estado),
      icon: estado === 'ERROR' || estado === 'CON_DIFERENCIAS' ? AlertTriangle : Check,
    },
  ];

  return (
    <div className={cn('space-y-1', className)}>
      <h4 className="mb-4 text-sm font-semibold">Timeline de conciliación</h4>
      <div className="relative space-y-0">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
              className="relative flex gap-4 pb-6 last:pb-0"
            >
              {index < steps.length - 1 ? (
                <div
                  className={cn(
                    'absolute left-[15px] top-8 h-[calc(100%-8px)] w-px',
                    step.status === 'completed' ? 'bg-brand/40' : 'bg-border',
                  )}
                />
              ) : null}
              <div
                className={cn(
                  'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                  step.status === 'completed' && 'border-brand bg-brand text-brand-foreground',
                  step.status === 'current' && 'border-brand bg-brand/10 text-brand',
                  step.status === 'upcoming' && 'border-border bg-muted text-muted-foreground',
                )}
              >
                {step.status === 'completed' ? (
                  <Check className="h-4 w-4" />
                ) : step.status === 'current' ? (
                  <Icon className="h-3.5 w-3.5" />
                ) : (
                  <Circle className="h-3 w-3" />
                )}
              </div>
              <div className="min-w-0 flex-1 pt-0.5">
                <p
                  className={cn(
                    'text-sm font-medium',
                    step.status === 'upcoming' && 'text-muted-foreground',
                  )}
                >
                  {step.label}
                </p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
                {step.date ? (
                  <p className="mt-1 text-[11px] text-muted-foreground/70">
                    {formatDateTime(step.date)}
                  </p>
                ) : null}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
