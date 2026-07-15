'use client';

import { Badge } from '@/components/ui/badge';
import { userRolLabel, userRolVariant } from '@/lib/users/schemas';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types/auth';

interface UserRolBadgeProps {
  rol: UserRole | string;
  className?: string;
}

export function UserRolBadge({ rol, className }: UserRolBadgeProps) {
  return (
    <Badge variant={userRolVariant(rol)} className={cn('font-medium', className)}>
      {userRolLabel(rol)}
    </Badge>
  );
}
