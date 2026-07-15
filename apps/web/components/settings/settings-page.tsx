'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Building2, Lock, Palette, User } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { AccessibleTabPanel, AccessibleTabs } from '@/components/shared/accessible-tabs';
import { SettingsCompanyCard } from './settings-company-card';
import { SettingsPasswordForm } from './settings-password-form';
import { SettingsPreferencesCard } from './settings-preferences-card';
import { SettingsProfileCard } from './settings-profile-card';

type SettingsTab = 'perfil' | 'empresa' | 'password' | 'preferencias';

const tabs = [
  { id: 'perfil' as const, label: 'Perfil', icon: User },
  { id: 'empresa' as const, label: 'Empresa', icon: Building2 },
  { id: 'password' as const, label: 'Contraseña', icon: Lock },
  { id: 'preferencias' as const, label: 'Preferencias', icon: Palette },
];

const SETTINGS_PANEL_ID = 'settings';

interface SettingsPageContentProps {
  embedded?: boolean;
}

export function SettingsPageContent({ embedded = false }: SettingsPageContentProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('perfil');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {!embedded ? (
        <PageHeader
          title="Mi cuenta"
          description="Gestiona tu perfil, empresa, contraseña y preferencias de la aplicación."
        />
      ) : null}

      <div className="rounded-xl border border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
        <AccessibleTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          panelId={SETTINGS_PANEL_ID}
          className="flex flex-wrap gap-1 border-b border-border/40 p-3"
        />

        <div className="p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <AccessibleTabPanel
                id={`${SETTINGS_PANEL_ID}-panel-${activeTab}`}
                tabId={`${SETTINGS_PANEL_ID}-tab-${activeTab}`}
                active
              >
                {activeTab === 'perfil' ? <SettingsProfileCard /> : null}
                {activeTab === 'empresa' ? <SettingsCompanyCard /> : null}
                {activeTab === 'password' ? <SettingsPasswordForm /> : null}
                {activeTab === 'preferencias' ? <SettingsPreferencesCard /> : null}
              </AccessibleTabPanel>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
