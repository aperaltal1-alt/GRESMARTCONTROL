'use client';

import { motion } from 'framer-motion';
import { Check, Circle, FileText } from 'lucide-react';
import { GRE_TIMELINE_STEPS, formatDateTime } from '@/lib/gre/utils';
import { cn } from '@/lib/utils';
import type { Gre } from '@/types/gre';

interface GreTimelineProps {
  gre: Gre;
  className?: string;
}

function getStepStatus(
  stepEstado: string,
  currentEstado: string,
): 'completed' | 'current' | 'upcoming' {
  const order = ['PENDIENTE', 'CONCILIADA', 'CON_DIFERENCIA'];
  const currentIdx = order.indexOf(currentEstado);
  const stepIdx = order.indexOf(stepEstado);

  if (currentEstado === 'CON_DIFERENCIA' && stepEstado === 'CONCILIADA') {
    return 'upcoming';
  }
  if (stepIdx < currentIdx) return 'completed';
  if (stepEstado === currentEstado) return 'current';
  return 'upcoming';
}

export function GreTimeline({ gre, className }: GreTimelineProps) {
  const steps = [
    {
      key: 'created',
      label: 'Documento registrado',
      description: `GRE ${gre.serie}-${gre.numero} creada en el sistema`,
      date: gre.createdAt,
      status: 'completed' as const,
    },
    ...GRE_TIMELINE_STEPS.map((step) => ({
      key: step.estado,
      label: step.label,
      description: step.description,
      date: gre.estado === step.estado ? gre.updatedAt : undefined,
      status: getStepStatus(step.estado, gre.estado),
    })),
  ];

  return (
    <div className={cn('space-y-1', className)}>
      <h4 className="mb-4 text-sm font-semibold">Timeline del documento</h4>
      <div className="relative space-y-0">
        {steps.map((step, index) => (
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
                <FileText className="h-3.5 w-3.5" />
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
        ))}
      </div>
    </div>
  );
}
