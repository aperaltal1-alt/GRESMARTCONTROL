import { MvpUserRole } from '../constants';

export interface UserListItem {
  id: string;
  email: string;
  nombre: string;
  apellido: string | null;
  rol: MvpUserRole;
  rolNombre: string;
  activo: boolean;
  ultimoLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedUsers {
  items: UserListItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface RoleOption {
  codigo: MvpUserRole;
  nombre: string;
  descripcion: string | null;
}
