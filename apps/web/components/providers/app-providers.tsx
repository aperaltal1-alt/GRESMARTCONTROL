'use client';

import { type ReactNode } from 'react';
import { AuthProvider } from '@/components/providers/auth-provider';
import { QueryProvider } from '@/components/providers/query-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { SidebarProvider } from '@/hooks/use-sidebar';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { siteConfig } from '@/config/site';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme={siteConfig.defaultTheme} enableSystem disableTransitionOnChange>
      <QueryProvider>
        <AuthProvider>
          <SidebarProvider>
            <TooltipProvider delayDuration={150}>
              {children}
              <Toaster position="top-right" richColors closeButton />
            </TooltipProvider>
          </SidebarProvider>
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
