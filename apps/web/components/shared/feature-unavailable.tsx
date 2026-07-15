'use client';

import Link from 'next/link';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/empty-state';

export { CONFIG_UNAVAILABLE } from '@/lib/settings/unavailable-config';

interface FeatureUnavailableProps {
  title: string;
  description: string;
  reason?: string;
  backHref?: string;
  backLabel?: string;
}

export function FeatureUnavailable({
  title,
  description,
  reason = 'Este módulo no está expuesto en la API del MVP. Los datos se gestionan internamente en el backend.',
  backHref = '/configuracion',
  backLabel = 'Volver a configuración',
}: FeatureUnavailableProps) {
  return (
    <EmptyState
      title={title}
      description={description}
      icon={Package}
      className="rounded-xl border border-dashed border-border/60 bg-muted/10 py-16"
    >
      <p className="mt-2 max-w-md text-center text-sm text-muted-foreground">{reason}</p>
      {backHref ? (
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link href={backHref}>{backLabel}</Link>
        </Button>
      ) : null}
    </EmptyState>
  );
}
