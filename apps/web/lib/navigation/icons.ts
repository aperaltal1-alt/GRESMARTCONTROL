'use client';

import {
  AlertTriangle,
  ArrowLeftRight,
  BarChart3,
  Bell,
  Building2,
  FileSpreadsheet,
  FileText,
  FileType,
  Hash,
  LayoutDashboard,
  List,
  Package,
  Route,
  Scale,
  Settings,
  SlidersHorizontal,
  ToggleLeft,
  Users,
  Warehouse,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  BarChart3,
  LayoutDashboard,
  FileText,
  Package,
  Warehouse,
  ArrowLeftRight,
  Scale,
  Route,
  Bell,
  AlertTriangle,
  FileSpreadsheet,
  Settings,
  Users,
  Building2,
  SlidersHorizontal,
  List,
  FileType,
  Hash,
  ToggleLeft,
};

export function getNavIcon(name: string): LucideIcon {
  return iconMap[name] ?? Package;
}
