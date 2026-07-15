'use client';

import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartContainer } from '@/components/charts/chart-container';
import { formatShortDate } from '@/lib/dashboard/utils';
import type { ChartPoint, LowStockChartItem } from '@/types/dashboard';

interface ChartTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border/60 bg-card/95 px-3 py-2 shadow-lg backdrop-blur-sm">
      <p className="mb-1 text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{payload[0].value}</p>
    </div>
  );
}

interface AreaChartCardProps {
  title: string;
  description?: string;
  data: ChartPoint[];
  color: string;
  gradientId: string;
  index?: number;
}

export function DashboardAreaChart({
  title,
  description,
  data,
  color,
  gradientId,
  index = 0,
}: AreaChartCardProps) {
  const chartData = data.map((p) => ({
    ...p,
    label: formatShortDate(p.fecha),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
      className="rounded-xl border border-border/60 bg-card/80 p-5 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold">{title}</h3>
        {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      </div>
      <ChartContainer height={260} className="border-0 bg-transparent p-0 shadow-none">
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            className="text-muted-foreground"
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            className="text-muted-foreground"
            allowDecimals={false}
          />
          <RechartsTooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="total"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            isAnimationActive
            animationDuration={900}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ChartContainer>
    </motion.div>
  );
}

interface BarChartCardProps {
  title: string;
  description?: string;
  data: LowStockChartItem[];
  index?: number;
}

export function DashboardBarChart({ title, description, data, index = 0 }: BarChartCardProps) {
  const chartData = data.map((p) => ({
    name: p.codigo,
    stock: p.stockActual,
    minimo: p.stockMinimo,
    fullName: p.nombre,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
      className="rounded-xl border border-border/60 bg-card/80 p-5 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md"
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold">{title}</h3>
        {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      </div>
      <ChartContainer height={260} className="border-0 bg-transparent p-0 shadow-none">
        <BarChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            className="text-muted-foreground"
          />
          <YAxis
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            className="text-muted-foreground"
            allowDecimals={false}
          />
          <RechartsTooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const item = payload[0].payload as (typeof chartData)[0];
              return (
                <div className="rounded-lg border border-border/60 bg-card/95 px-3 py-2 shadow-lg backdrop-blur-sm">
                  <p className="text-xs font-medium">{item.fullName}</p>
                  <p className="text-sm">
                    Stock: <span className="font-semibold text-orange-500">{item.stock}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">Mínimo: {item.minimo}</p>
                </div>
              );
            }}
          />
          <Bar
            dataKey="stock"
            fill="hsl(var(--warning))"
            radius={[6, 6, 0, 0]}
            isAnimationActive
            animationDuration={900}
          />
          <Bar
            dataKey="minimo"
            fill="hsl(var(--muted-foreground))"
            fillOpacity={0.3}
            radius={[6, 6, 0, 0]}
            isAnimationActive
            animationDuration={900}
          />
        </BarChart>
      </ChartContainer>
    </motion.div>
  );
}
