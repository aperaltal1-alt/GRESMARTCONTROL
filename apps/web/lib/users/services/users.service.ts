import { apiClient } from '@/lib/api/client';
import type { ApiResponse, PaginatedResponse } from '@/types/api';
import type {
  CreateUserPayload,
  ListUsersParams,
  RoleOption,
  UpdateUserPayload,
  UpdateUserStatusPayload,
  User,
} from '@/types/users';

const BASE = '/users';

export async function fetchUsers(params: ListUsersParams = {}): Promise<PaginatedResponse<User>> {
  const { data } = await apiClient.get<ApiResponse<PaginatedResponse<User>>>(BASE, {
    params: {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      ...(params.search ? { search: params.search } : {}),
      ...(params.activo !== undefined ? { activo: params.activo } : {}),
    },
  });
  return data.data;
}

export async function fetchUserById(id: string): Promise<User> {
  const { data } = await apiClient.get<ApiResponse<User>>(`${BASE}/${id}`);
  return data.data;
}

export async function fetchUserRoles(): Promise<RoleOption[]> {
  const { data } = await apiClient.get<ApiResponse<RoleOption[]>>(`${BASE}/roles`);
  return data.data;
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
  const { data } = await apiClient.post<ApiResponse<User>>(BASE, payload);
  return data.data;
}

export async function updateUser(id: string, payload: UpdateUserPayload): Promise<User> {
  const { data } = await apiClient.patch<ApiResponse<User>>(`${BASE}/${id}`, payload);
  return data.data;
}

export async function updateUserStatus(
  id: string,
  payload: UpdateUserStatusPayload,
): Promise<User> {
  const { data } = await apiClient.patch<ApiResponse<User>>(`${BASE}/${id}/status`, payload);
  return data.data;
}
