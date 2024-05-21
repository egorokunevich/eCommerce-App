import type { AuthMiddlewareOptions, HttpMiddlewareOptions } from '@commercetools/sdk-client-v2';

import tokenCache from './TokenCache';

// Import secret variables from .env
const {
  VITE_CTP_PROJECT_KEY: projectKey,
  VITE_CTP_CLIENT_SECRET: clientSecret,
  VITE_CTP_CLIENT_ID: clientId,
  VITE_CTP_AUTH_URL: authUrl,
  VITE_CTP_API_URL: apiUrl,
  VITE_CTP_SCOPES: scopesEnv,
} = import.meta.env;

const scopes = scopesEnv.split(' ');

// Configure middleware options for HTTP requests
export const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: apiUrl,
  maskSensitiveHeaderData: true,
  enableRetry: true,
  retryConfig: {
    maxRetries: 3,
    retryDelay: 200,
    backoff: false,
    retryCodes: [503],
  },
  fetch,
};

// Configure middleware options, common for most session flows
export const middlewareOptions: AuthMiddlewareOptions = {
  host: authUrl,
  projectKey,
  credentials: {
    clientId,
    clientSecret,
  },
  tokenCache,
  scopes,
  fetch,
};
