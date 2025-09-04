/// <reference types="vite/client" />
export {};

declare global {
  interface Window {
    electronAPI: {
      request: (config: any) => Promise<any>;
    };
  }
}
