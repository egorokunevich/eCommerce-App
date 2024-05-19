import type { TokenCache, TokenStore } from '@commercetools/sdk-client-v2';

class MyTokenCache implements TokenCache {
  // Initialize myCache. This mock data isn't supposed to be used.
  public myCache: TokenStore = {
    token: '',
    expirationTime: 0,
    refreshToken: undefined,
  };

  public get(): TokenStore {
    const existingCache = localStorage.getItem('token');
    return existingCache ? JSON.parse(existingCache) : null;
  }

  // SDK sets new token cache automatically, when the first request is sent from the Client.
  public set(newCache: TokenStore): void {
    this.myCache = newCache;
    localStorage.setItem('token', JSON.stringify(newCache));
  }

  public delete(): void {
    localStorage.removeItem('token');
  }
}

const tokenCache = new MyTokenCache();
export default tokenCache;
