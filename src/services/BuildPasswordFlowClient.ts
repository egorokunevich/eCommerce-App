import { ClientBuilder } from '@commercetools/sdk-client-v2';
import type {
  Client,
  HttpMiddlewareOptions,
  PasswordAuthMiddlewareOptions,
  TokenCache,
  TokenStore,
} from '@commercetools/sdk-client-v2';

import * as secretVariables from './LoginAPIVariables';

class MyTokenCache implements TokenCache {
  private myCache: TokenStore = {
    token: 'null',
    expirationTime: 10,
    refreshToken: undefined,
  };

  public get(): TokenStore {
    return this.myCache;
  }

  public set(newCache: TokenStore): void {
    this.myCache = newCache;
  }
}

export const CacheClass = new MyTokenCache();

function getOptions(username: string, password: string): PasswordAuthMiddlewareOptions {
  return {
    host: secretVariables.CTP_AUTH_URL,
    projectKey: secretVariables.CTP_PROJECT_KEY,
    credentials: {
      clientId: secretVariables.CTP_CLIENT_ID,
      clientSecret: secretVariables.CTP_CLIENT_SECRET,
      user: {
        username,
        password,
      },
    },

    tokenCache: CacheClass,
    scopes: secretVariables.CTP_SCOPES,
    fetch,
  };
}

export function createPasswordClient(username: string, password: string): Client {
  const options = getOptions(username, password);

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
    .withPasswordFlow(options)
    .withHttpMiddleware(httpMiddlewareOptions)
    .withLoggerMiddleware()
    .build();
}
