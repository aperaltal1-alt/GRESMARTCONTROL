'use client';

import { motion } from 'framer-motion';
import { Activity, Bell, FileText, RefreshCw } from 'lucide-react';
import { AccessibleTabPanel, AccessibleTabs } from '@/components/shared/accessible-tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  useDashboardRecentAlerts,
  useDashboardRecentGre,
  useDashboardRecentIncidents,
} from '@/hooks/dashboard';
import { RecentAlertsList } from './recent-alerts-list';
import { RecentGreList } from './recent-gre-list';
import { RecentIncidentsList } from './recent-incidents-list';

type PanelTab = 'gre' | 'incidents' | 'alerts';

interface RightPanelProps {
  activeTab: PanelTab;
  onTabChange: (tab: PanelTab) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

const tabs = [
  { id: 'gre' as const, label: 'GRE', icon: FileText },
  { id: 'incidents' as const, label: 'Incidencias', icon: Activity },
  { id: 'alerts' as const, label: 'Alertas', icon: Bell },
];

const PANEL_ID = 'dashboard-activity';

export function RightPanel({
  activeTab,
  onTabChange,
  onRefresh,
  isRefreshing,
}: RightPanelProps) {
  const greQuery = useDashboardRecentGre(6, activeTab === 'gre');
  const incidentsQuery = useDashboardRecentIncidents(6, activeTab === 'incidents');
  const alertsQuery = useDashboardRecentAlerts(6, activeTab === 'alerts');

  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex h-full flex-col rounded-xl border border-border/60 bg-card/80 shadow-sm backdrop-blur-sm"
    >
      <div className="flex items-center justify-between border-b border-border/40 px-4 py-3">
        <h3 className="text-sm font-semibold">Actividad reciente</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onRefresh}
          disabled={isRefreshing}
          aria-label="Actualizar actividad reciente"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <AccessibleTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
        panelId={PANEL_ID}
        compact
        className="flex gap-1 border-b border-border/40 px-3 py-2"
      />

      <ScrollArea className="flex-1 px-3 py-3" style={{ maxHeight: 520 }}>
        <AccessibleTabPanel
          id={`${PANEL_ID}-panel-gre`}
          tabId={`${PANEL_ID}-tab-gre`}
          active={activeTab === 'gre'}
        >
          <RecentGreList
            items={greQuery.data}
            isLoading={greQuery.isLoading}
            isError={greQuery.isError}
            onRetry={() => greQuery.refetch()}
          />
        </AccessibleTabPanel>
        <AccessibleTabPanel
          id={`${PANEL_ID}-panel-incidents`}
          tabId={`${PANEL_ID}-tab-incidents`}
          active={activeTab === 'incidents'}
        >
          <RecentIncidentsList
            items={incidentsQuery.data}
            isLoading={incidentsQuery.isLoading}
            isError={incidentsQuery.isError}
            onRetry={() => incidentsQuery.refetch()}
          />
        </AccessibleTabPanel>
        <AccessibleTabPanel
          id={`${PANEL_ID}-panel-alerts`}
          tabId={`${PANEL_ID}-tab-alerts`}
          active={activeTab === 'alerts'}
        >
          <RecentAlertsList
            items={alertsQuery.data}
            isLoading={alertsQuery.isLoading}
            isError={alertsQuery.isError}
            onRetry={() => alertsQuery.refetch()}
          />
        </AccessibleTabPanel>
      </ScrollArea>
    </motion.div>
  );
}
