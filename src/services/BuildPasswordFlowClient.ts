import { ClientBuilder } from '@commercetools/sdk-client-v2';
import type { Client } from '@commercetools/sdk-client-v2';

import { httpMiddlewareOptions, middlewareOptions } from './MiddlewareOptions';
import tokenCache from './TokenCache';

const { VITE_CTP_CLIENT_SECRET: clientSecretEnv, VITE_CTP_CLIENT_ID: clientIdEnv } = import.meta.env;

// Mock data for Vitest tests.
let clientSecret = 'data for Vitest testing';
let clientId = 'data for Vitest testing';

// Take .env parameters if it's not a testing
if (clientSecretEnv) {
  clientSecret = clientSecretEnv;
  clientId = clientIdEnv;
}

export function getPasswordClient(username: string, password: string): Client {
  tokenCache.delete();
  const credentials = {
    clientId,
    clientSecret,

    user: {
      username,
      password,
    },
    tokenCache,
  };

  return new ClientBuilder()
    .withPasswordFlow({ ...middlewareOptions, credentials })
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();
}
