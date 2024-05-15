import { ClientBuilder } from '@commercetools/sdk-client-v2';
import type {
  AnonymousAuthMiddlewareOptions,
  HttpMiddlewareOptions,
  TokenCache,
  TokenStore,
} from '@commercetools/sdk-client-v2';

import * as secretVariables from './LoginAPIVariables';

class MyTokenCache implements TokenCache {
  constructor() {
    const existingCache = JSON.parse(localStorage.getItem('passwordToken') ?? 'null');
    if (existingCache) {
      this.myCache = existingCache;
    }
  }

  private myCache: TokenStore = {
    token: 'null',
    expirationTime: 10,
    refreshToken: undefined,
  };

  public get(): TokenStore {
    return this.myCache;
  }

  // SDK sets new token cache automatically
  public set(newCache: TokenStore): void {
    localStorage.setItem('passwordToken', JSON.stringify(newCache));
    this.myCache = newCache;
  }
}

export const anonCacheClass = new MyTokenCache();

// Configure middleware options
const options: AnonymousAuthMiddlewareOptions = {
  host: secretVariables.CTP_AUTH_URL,
  projectKey: secretVariables.CTP_PROJECT_KEY,
  credentials: {
    clientId: secretVariables.CTP_CLIENT_ID,
    clientSecret: secretVariables.CTP_CLIENT_SECRET,
  },
  tokenCache: anonCacheClass,
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
export const anonymousClient = new ClientBuilder()
  .withProjectKey(secretVariables.CTP_PROJECT_KEY)
  .withAnonymousSessionFlow(options)
  .withHttpMiddleware(httpMiddlewareOptions)
  .withLoggerMiddleware()
  .build();
