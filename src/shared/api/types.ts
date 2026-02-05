export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface RequestConfig<TData = unknown, TParams = Record<string, unknown>> {
  method: HttpMethod;
  url: string;
  params?: TParams;
  data?: TData;
  headers?: Record<string, string>;
  [key: string]: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  result: T;
  message?: string;
}

export interface ApiEnvelope<T> {
  data: ApiResponse<T>;
}
