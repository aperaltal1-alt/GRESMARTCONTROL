'use client';

import { motion } from 'framer-motion';
import { BarChart3, Package, Scale, ShieldCheck, Sparkles } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    icon: Scale,
    title: 'Conciliación triple',
    description: 'GRE, Kardex e Inventario en un solo flujo inteligente.',
  },
  {
    icon: BarChart3,
    title: 'Dashboards ejecutivos',
    description: 'KPIs en tiempo real para decisiones rápidas.',
  },
  {
    icon: Package,
    title: 'Trazabilidad total',
    description: 'Visibilidad completa de productos y movimientos.',
  },
];

export function LoginShowcase() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative hidden h-full flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-brand/90 via-blue-600 to-indigo-700 p-10 text-white shadow-2xl lg:flex"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_40%)]" />
      <div className="pointer-events-none absolute -right-16 top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 left-10 h-48 w-48 rounded-full bg-cyan-300/20 blur-3xl" />

      <div className="relative space-y-8">
        <Logo variant="light" />
        <div className="space-y-4">
          <Badge className="border-white/20 bg-white/10 text-white hover:bg-white/10">
            <Sparkles className="mr-1 h-3.5 w-3.5" />
            Plataforma MVP — Concurso de Innovación
          </Badge>
          <h1 className="max-w-md text-4xl font-semibold tracking-tight">
            Control inteligente de inventario y guías de remisión
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-white/80">
            Diseño inspirado en productos SaaS premium. Conciliación automatizada con una experiencia
            visual de nivel comercial.
          </p>
        </div>
      </div>

      <div className="relative space-y-4">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + index * 0.1, duration: 0.45 }}
            className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15">
              <feature.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">{feature.title}</p>
              <p className="text-sm text-white/75">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative flex items-center gap-2 text-sm text-white/70">
        <ShieldCheck className="h-4 w-4" />
        Autenticación segura con JWT y refresh token
      </div>
    </motion.div>
  );
}
