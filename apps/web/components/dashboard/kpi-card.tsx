'use client';

import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Bell,
  Boxes,
  CheckCircle2,
  FileText,
  Minus,
  Package,
  Percent,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { TrendDirection } from '@/types/dashboard';

export interface KpiCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    direction: TrendDirection;
    label: string;
    positive?: boolean;
  };
  colorClass?: string;
  iconBgClass?: string;
  tooltip?: string;
  index?: number;
}

function TrendIcon({ direction, positive }: { direction: TrendDirection; positive?: boolean }) {
  const isGood = positive
    ? direction === 'up'
    : direction === 'down';
  const isBad = positive
    ? direction === 'down'
    : direction === 'up';

  if (direction === 'neutral') {
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  }
  if (isGood) {
    return <TrendingUp className="h-3 w-3 text-emerald-500" />;
  }
  if (isBad) {
    return <TrendingDown className="h-3 w-3 text-red-500" />;
  }
  return <Minus className="h-3 w-3 text-muted-foreground" />;
}

export function KpiCard({
  title,
  value,
  icon: Icon,
  trend,
  colorClass = 'text-brand',
  iconBgClass = 'bg-brand/10',
  tooltip,
  index = 0,
}: KpiCardProps) {
  const card = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-xl border border-border/60 bg-card/80 p-5 shadow-sm backdrop-blur-sm transition-shadow hover:border-border hover:shadow-md"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-muted/30 opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative flex items-start justify-between gap-2">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', iconBgClass)}>
          <Icon className={cn('h-5 w-5', colorClass)} />
        </div>
        {trend ? (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <TrendIcon direction={trend.direction} positive={trend.positive} />
          </div>
        ) : null}
      </div>
      <div className="relative mt-4">
        <p className="text-2xl font-bold tracking-tight">{value}</p>
        <p className="mt-1 text-sm font-medium text-muted-foreground">{title}</p>
        {trend ? (
          <p className="mt-1 text-xs text-muted-foreground/80">{trend.label}</p>
        ) : null}
      </div>
    </motion.div>
  );

  if (tooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{card}</TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return card;
}

export const KPI_ICONS = {
  totalGre: FileText,
  greConciliadas: CheckCircle2,
  greConDiferencias: AlertTriangle,
  totalProductos: Package,
  stockTotalDisponible: Boxes,
  productosStockBajo: AlertTriangle,
  alertasActivas: Bell,
  incidenciasPendientes: AlertTriangle,
  nivelConciliacion: Percent,
  riesgoTributario: ShieldAlert,
} as const;
