import type { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import type { Client } from '@commercetools/sdk-client-v2';
import { Router } from 'vanilla-routing';

import { ToastColors, showToastMessage } from '@components/Toast';

import { getAnonymousClient } from './BuildAnonymousFlowClient';
import { getExistingTokenClient } from './BuildExistingTokenClient';
import { getPasswordClient } from './BuildPasswordFlowClient';
import { getRefreshTokenClient } from './BuildRefreshTokenClient';
import tokenCache from './TokenCache';

const { VITE_CTP_PROJECT_KEY: projectKey } = import.meta.env;

interface FetchError extends Error {
  statusCode?: number;
}

export class ClientService {
  private apiRoot!: ByProjectKeyRequestBuilder;

  constructor() {
    this.handleToken();
  }

  public async updateClient(client: Client, isLoggedIn: boolean): Promise<void> {
    this.apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({
      projectKey,
    });
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
  }

  public async login(email: string, password: string): Promise<void> {
    const isFetchError = (error: unknown): error is FetchError => {
      return typeof error === 'object' && error !== null && 'statusCode' in error;
    };
    const handleAuthError = (error: unknown): void => {
      if (isFetchError(error)) {
        showToastMessage(error.message);
      }
    };

    try {
      const response = await this.apiRoot
        .me()
        .login()
        .post({
          body: {
            email,
            password,
          },
        })
        .execute();

      if (response.statusCode === 200) {
        // console.log('waiting...');
        await this.updateClient(getPasswordClient(email, password), true);

        Router.go('/', { addToHistory: true });
        // console.log('logged in.');
        this.apiRoot.get().execute();
        // this.apiRoot.me().get().execute();
        showToastMessage('Logged in successfully', ToastColors.Green);
      }
    } catch (e) {
      handleAuthError(e);
    }
  }

  private handleToken(): void {
    const existingToken = tokenCache.get();
    // console.log(existingToken);
    if (!existingToken.token) {
      // console.log('no token saved');
      this.apiRoot = createApiBuilderFromCtpClient(getAnonymousClient()).withProjectKey({
        projectKey,
      });
      this.apiRoot.get().execute(); // Initial request to get token
    } else {
      // console.log('token exist');
      const expirationDate = new Date(existingToken.expirationTime);
      const diff = expirationDate.getTime() - new Date().getTime();
      if (diff > 60000) {
        this.apiRoot = createApiBuilderFromCtpClient(getExistingTokenClient()).withProjectKey({
          projectKey,
        });
      } else {
        this.apiRoot = createApiBuilderFromCtpClient(getRefreshTokenClient()).withProjectKey({
          projectKey,
        });
      }
      this.apiRoot.get().execute();
    }

    // localStorage.setItem('isLoggedIn', JSON.stringify(false));
  }

  public async logout(): Promise<void> {
    // const isLoggedIn = JSON.parse(localStorage.getItem('isLoggedIn') ?? 'null');
    // if (isLoggedIn === true) {
    // }
    tokenCache.delete();
    tokenCache.set({
      token: '',
      expirationTime: 0,
      refreshToken: undefined,
    });
    this.apiRoot = createApiBuilderFromCtpClient(getAnonymousClient()).withProjectKey({
      projectKey,
    });
    this.apiRoot.get().execute();
    localStorage.setItem('isLoggedIn', JSON.stringify(false));
    showToastMessage('Logged out', ToastColors.Blue);
  }

  //   public async getAllCustomers(
  //     limit?: number,
  //     offset?: number,
  //     sort?: string | string[],
  //   ): Promise<ClientResponse<CustomerPagedQueryResponse>> {
  //     return this.apiRoot.customers()
  //       .get({
  //         queryArgs: {
  //           limit,
  //           offset,
  //           sort, // e.g 'firstName asc', e.g 'email desc'
  //         },
  //       })
  //       .execute();
  //   }
}
