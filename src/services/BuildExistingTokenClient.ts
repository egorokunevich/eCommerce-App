import type {
  Client,
  ExistingTokenMiddlewareOptions,
  HttpMiddlewareOptions,
  TokenInfo,
} from '@commercetools/sdk-client-v2';
import { ClientBuilder } from '@commercetools/sdk-client-v2';

import * as secretVariables from './LoginAPIVariables';

function getAuthorization(token: TokenInfo): string {
  return `${token.token_type} ${token.access_token}`;
}

export function getExistingTokenClient(token: TokenInfo): Client {
  const authorization = getAuthorization(token);
  const options: ExistingTokenMiddlewareOptions = {
    force: true,
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

  return new ClientBuilder()
    .withExistingTokenFlow(authorization, options)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();
}
