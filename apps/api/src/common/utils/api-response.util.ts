import { ApiResponse } from '../interfaces';

export function buildSuccessResponse<T>(
  data: T,
  message = 'Operación exitosa',
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
}

export function buildErrorResponse(
  message: string,
  errors?: string[] | Record<string, string[]>,
): ApiResponse<null> & { errors?: string[] | Record<string, string[]> } {
  return {
    success: false,
    message,
    data: null,
    timestamp: new Date().toISOString(),
    ...(errors ? { errors } : {}),
  };
}
