import { ClientBuilder } from '@commercetools/sdk-client-v2';
import type { Client } from '@commercetools/sdk-client-v2';

import { httpMiddlewareOptions, middlewareOptions } from './MiddlewareOptions';

export function getAnonymousClient(): Client {
  return new ClientBuilder()
    .withAnonymousSessionFlow(middlewareOptions)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();
}
