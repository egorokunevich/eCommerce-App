import type { Client, ExistingTokenMiddlewareOptions } from '@commercetools/sdk-client-v2';
import { ClientBuilder } from '@commercetools/sdk-client-v2';

import { httpMiddlewareOptions } from './MiddlewareOptions';
import tokenCache from './TokenCache';

export function getExistingTokenClient(): Client {
  const authorization = `Bearer ${tokenCache.get().token}`;
  const options: ExistingTokenMiddlewareOptions = {
    force: true,
  };

  return new ClientBuilder()
    .withExistingTokenFlow(authorization, options)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();
}
