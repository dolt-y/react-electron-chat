/// <reference types="vite/client" />
import type { ApiEnvelope, ApiResponse, RequestConfig } from "./shared/api/types";

export {};

declare global {
  interface Window {
    electronAPI: {
      request: <T>(config: RequestConfig) => Promise<ApiResponse<T> | ApiEnvelope<T>>;
    };
  }
}
