const mockMode = import.meta.env.VITE_MOCK_MODE;

if (mockMode !== 'true' && mockMode !== 'false') {
  throw new Error('VITE_MOCK_MODE must be set to "true" or "false".');
}

export const appConfig = {
  mockMode: mockMode === 'true',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  socketBaseUrl: import.meta.env.VITE_SOCKET_BASE_URL || 'ws://localhost:8080',
} as const;
