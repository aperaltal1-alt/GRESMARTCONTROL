'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const themeOptions = [
  {
    value: 'light',
    label: 'Claro',
    description: 'Interfaz con fondo claro',
    icon: Sun,
  },
  {
    value: 'dark',
    label: 'Oscuro',
    description: 'Interfaz con fondo oscuro',
    icon: Moon,
  },
  {
    value: 'system',
    label: 'Sistema',
    description: 'Sigue la preferencia del dispositivo',
    icon: Monitor,
  },
] as const;

type ThemeOption = (typeof themeOptions)[number]['value'];

export function SettingsPreferencesCard() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = (mounted ? theme : 'system') as ThemeOption | undefined;

  return (
    <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-base">Preferencias</CardTitle>
        <CardDescription>Personaliza la apariencia de la interfaz.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-3">
          {themeOptions.map((option) => {
            const isActive = activeTheme === option.value;
            const Icon = option.icon;

            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={isActive}
                onClick={() => setTheme(option.value)}
                disabled={!mounted}
                className={cn(
                  'flex flex-col items-start gap-3 rounded-xl border p-4 text-left transition-colors',
                  isActive
                    ? 'border-brand bg-brand/5 ring-1 ring-brand/30'
                    : 'border-border/40 bg-muted/10 hover:bg-muted/30',
                )}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg',
                    isActive ? 'bg-brand/10 text-brand' : 'bg-muted text-muted-foreground',
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{option.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{option.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
