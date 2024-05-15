import { ClientBuilder } from '@commercetools/sdk-client-v2';
import type { AuthMiddlewareOptions, HttpMiddlewareOptions } from '@commercetools/sdk-client-v2';

import * as secretVariables from './LoginAPIVariables';

// Configure middleware options
const options: AuthMiddlewareOptions = {
  host: secretVariables.CTP_AUTH_URL,
  projectKey: secretVariables.CTP_PROJECT_KEY,
  credentials: {
    clientId: secretVariables.CTP_CLIENT_ID,
    clientSecret: secretVariables.CTP_CLIENT_SECRET,
  },
  scopes: secretVariables.CTP_SCOPES,
  fetch,
};

// Configure middleware options
const httpMiddlewareOptions: HttpMiddlewareOptions = {
  host: secretVariables.CTP_API_URL,
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

// Export the ClientBuilder
export const ctpClient = new ClientBuilder()
  .withClientCredentialsFlow(options)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();
