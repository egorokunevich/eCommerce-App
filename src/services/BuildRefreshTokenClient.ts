import type { Client } from '@commercetools/sdk-client-v2';
import { ClientBuilder } from '@commercetools/sdk-client-v2';

import { getAnonymousClient } from './BuildAnonymousFlowClient';
import { httpMiddlewareOptions, middlewareOptions } from './MiddlewareOptions';
import tokenCache from './TokenCache';

export function getRefreshTokenClient(): Client {
  const { refreshToken } = tokenCache.get();

  if (!refreshToken) {
    return getAnonymousClient();
  }

  return new ClientBuilder()
    .withRefreshTokenFlow({ ...middlewareOptions, refreshToken })
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();
}
