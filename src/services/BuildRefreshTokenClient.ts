import type { Client, HttpMiddlewareOptions, RefreshAuthMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { ClientBuilder } from '@commercetools/sdk-client-v2';

import * as secretVariables from './LoginAPIVariables';

function getOptions(refreshToken: string): RefreshAuthMiddlewareOptions {
  return {
    host: secretVariables.CTP_AUTH_URL,
    projectKey: secretVariables.CTP_PROJECT_KEY,
    credentials: {
      clientId: secretVariables.CTP_CLIENT_ID,
      clientSecret: secretVariables.CTP_CLIENT_SECRET,
    },
    refreshToken,
    // tokenCache: TokenCache,
    fetch,
  };
}

export function getRefreshTokenClient(refreshToken: string): Client {
  const options = getOptions(refreshToken);

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

  return new ClientBuilder()
    .withRefreshTokenFlow(options)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();
}
