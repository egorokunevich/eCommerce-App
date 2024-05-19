import { ClientBuilder } from '@commercetools/sdk-client-v2';
import type { Client } from '@commercetools/sdk-client-v2';

import { httpMiddlewareOptions, middlewareOptions } from './MiddlewareOptions';

const { VITE_CTP_CLIENT_SECRET: clientSecret, VITE_CTP_CLIENT_ID: clientId } = import.meta.env;

export function getPasswordClient(username: string, password: string): Client {
  const credentials = {
    clientId,
    clientSecret,
    user: {
      username,
      password,
    },
  };

  return new ClientBuilder()
    .withPasswordFlow({ ...middlewareOptions, credentials })
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();
}
