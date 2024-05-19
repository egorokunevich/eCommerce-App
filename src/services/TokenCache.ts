import type { TokenCache, TokenStore } from '@commercetools/sdk-client-v2';

class MyTokenCache implements TokenCache {
  constructor() {
    const existingCache = JSON.parse(localStorage.getItem('token') ?? 'null');
    if (existingCache) {
      this.myCache = existingCache;
    }
  }

  private myCache: TokenStore = {
    token: '',
    expirationTime: 0,
    refreshToken: undefined,
  };

  public get(): TokenStore {
    const existingToken = localStorage.getItem('token');
    if (existingToken) {
      return JSON.parse(existingToken);
    }
    return this.myCache;
  }

  // SDK sets new token cache automatically
  public set(newCache: TokenStore): void {
    localStorage.setItem('token', JSON.stringify(newCache));
    this.myCache = newCache;
  }

  public delete(): void {
    localStorage.removeItem('token');
    this.set(this.myCache);
  }
}

const tokenCache = new MyTokenCache();
export default tokenCache;
