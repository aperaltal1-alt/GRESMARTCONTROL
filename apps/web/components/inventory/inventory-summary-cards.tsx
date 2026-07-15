'use client';

import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, Boxes, Package, PackageX } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatStock } from '@/lib/inventory/utils';
import { cn } from '@/lib/utils';
import type { InventorySummary } from '@/types/inventory';

interface InventorySummaryCardsProps {
  summary?: InventorySummary;
  isLoading: boolean;
}

interface CardConfig {
  key: keyof InventorySummary;
  title: string;
  icon: LucideIcon;
  colorClass: string;
  iconBgClass: string;
  format?: (v: number) => string;
}

const cards: CardConfig[] = [
  { key: 'totalProductos', title: 'Productos', icon: Package, colorClass: 'text-blue-500', iconBgClass: 'bg-blue-500/10' },
  { key: 'stockTotal', title: 'Stock total', icon: Boxes, colorClass: 'text-cyan-500', iconBgClass: 'bg-cyan-500/10', format: formatStock },
  { key: 'productosBajoStock', title: 'Stock bajo', icon: AlertTriangle, colorClass: 'text-amber-500', iconBgClass: 'bg-amber-500/10' },
  { key: 'productosSinStock', title: 'Sin stock', icon: PackageX, colorClass: 'text-red-500', iconBgClass: 'bg-red-500/10' },
];

export function InventorySummaryCards({ summary, isLoading }: InventorySummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const value = summary?.[card.key] ?? 0;
        const Icon = card.icon;
        return (
          <motion.div
            key={card.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            whileHover={{ y: -2 }}
            className="group rounded-xl border border-border/60 bg-card/80 p-5 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', card.iconBgClass)}>
                <Icon className={cn('h-5 w-5', card.colorClass)} />
              </div>
            </div>
            <p className="mt-4 text-2xl font-bold tracking-tight">
              {card.format ? card.format(value) : value}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{card.title}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
