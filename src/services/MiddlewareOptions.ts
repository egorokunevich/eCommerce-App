import type { AuthMiddlewareOptions, HttpMiddlewareOptions } from '@commercetools/sdk-client-v2';

import tokenCache from './TokenCache';

// Import secret variables from .env
const {
  VITE_CTP_PROJECT_KEY: projectKeyEnv,
  VITE_CTP_CLIENT_SECRET: clientSecretEnv,
  VITE_CTP_CLIENT_ID: clientIdEnv,
  VITE_CTP_AUTH_URL: authUrlEnv,
  VITE_CTP_API_URL: apiUrlEnv,
  VITE_CTP_SCOPES: scopesEnv,
} = import.meta.env;

// Mock data for Vitest tests.
let scopes = ['data for Vitest testing'];
let projectKey = 'data for Vitest testing';
let clientSecret = 'data for Vitest testing';
let clientId = 'data for Vitest testing';
let authUrl = 'data for Vitest testing';
let apiUrl = 'data for Vitest testing';

// Take .env parameters if it's not a testing
if (scopesEnv) {
  // Scopes in .env is a single string. We need to split it in order to get an array.
  scopes = scopesEnv.split(' ');
  projectKey = projectKeyEnv;
  clientSecret = clientSecretEnv;
  clientId = clientIdEnv;
  authUrl = authUrlEnv;
  apiUrl = apiUrlEnv;
}

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
