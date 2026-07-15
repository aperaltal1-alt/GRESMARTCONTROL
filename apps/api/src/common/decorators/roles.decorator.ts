import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/** Restringe acceso por rol — se activará en Fase 6 (Auth). */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
