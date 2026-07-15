'use client';

import { cn } from '@/lib/utils';

export interface AccessibleTab<T extends string> {
  id: T;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface AccessibleTabsProps<T extends string> {
  tabs: AccessibleTab<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  panelId: string;
  className?: string;
  tabClassName?: string;
  compact?: boolean;
}

export function AccessibleTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  panelId,
  className,
  tabClassName,
  compact = false,
}: AccessibleTabsProps<T>) {
  return (
    <div role="tablist" aria-label="Secciones" className={className}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${panelId}-tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`${panelId}-panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              compact
                ? 'flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors'
                : 'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-brand/10 text-brand'
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
              tabClassName,
            )}
          >
            {Icon ? <Icon className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} /> : null}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

interface AccessibleTabPanelProps {
  id: string;
  tabId: string;
  active: boolean;
  children: React.ReactNode;
  className?: string;
}

export function AccessibleTabPanel({
  id,
  tabId,
  active,
  children,
  className,
}: AccessibleTabPanelProps) {
  if (!active) return null;

  return (
    <div
      role="tabpanel"
      id={id}
      aria-labelledby={tabId}
      tabIndex={0}
      className={className}
    >
      {children}
    </div>
  );
}
