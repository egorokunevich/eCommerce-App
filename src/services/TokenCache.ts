import type { TokenCache, TokenStore } from '@commercetools/sdk-client-v2';

class MyTokenCache implements TokenCache {
  public myCache: TokenStore = {
    token: '',
    expirationTime: 0,
    refreshToken: undefined,
  };

  public get(): TokenStore {
    const existingCache = localStorage.getItem('token');
    return existingCache ? JSON.parse(existingCache) : null;
  }

  // SDK sets new token cache automatically
  public set(newCache: TokenStore): void {
    this.myCache = newCache;
    localStorage.setItem('token', JSON.stringify(newCache));
    // this.myCache = newCache;
  }

  public delete(): void {
    localStorage.removeItem('token');
  }
}

const tokenCache = new MyTokenCache();
export default tokenCache;
