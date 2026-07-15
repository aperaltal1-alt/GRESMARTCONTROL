export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  timestamp: string;
}

export interface ApiErrorResponse extends ApiResponse<null> {
  errors?: string[] | Record<string, string[]>;
  statusCode?: number;
  path?: string;
}
