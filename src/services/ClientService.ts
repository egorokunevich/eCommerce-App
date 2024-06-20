import type {
  ByProjectKeyRequestBuilder,
  ClientResponse,
  CustomerSignInResult,
  MyCustomerDraft,
} from '@commercetools/platform-sdk';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import type { Client } from '@commercetools/sdk-client-v2';
import { Router } from 'vanilla-routing';

import { ToastColors, showToastMessage } from '@components/Toast';

import { getAnonymousClient } from './BuildAnonymousFlowClient';
import { getExistingTokenClient } from './BuildExistingTokenClient';
import { getPasswordClient } from './BuildPasswordFlowClient';
// import { getRefreshTokenClient } from './BuildRefreshTokenClient';
import { getRefreshTokenClient } from './BuildRefreshTokenClient';
import tokenCache from './TokenCache';

const { VITE_CTP_PROJECT_KEY: projectKey } = import.meta.env;

export interface FetchError extends Error {
  statusCode?: number;
}

// Is used to handle unknown error as an object with statusCode property.
export function isFetchError(error: unknown): error is FetchError {
  return typeof error === 'object' && error !== null && 'statusCode' in error;
}

export class ClientService {
  private loggedStatusEvent = new CustomEvent('loggedStatusChange');
  public apiRoot!: ByProjectKeyRequestBuilder;

  // Change current flow/client
  public async updateClient(client: Client, isLoggedIn: boolean): Promise<void> {
    this.apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({
      projectKey,
    });
    localStorage.setItem('isLoggedIn', JSON.stringify(isLoggedIn));
  }

  // On failed login / signup show a notification with error message
  public handleAuthError(error: unknown): void {
    if (isFetchError(error)) {
      showToastMessage('Failed to authenticate. Please, try again.'); // Show notification
    }
  }

  public async login(email: string, password: string): Promise<void> {
    this.apiRoot = createApiBuilderFromCtpClient(getExistingTokenClient()).withProjectKey({
      projectKey,
    });
    const pendingStart = new CustomEvent('pendingStart');
    const pendingEnd = new CustomEvent('pendingEnd');
    try {
      document.dispatchEvent(pendingStart);
      const response = await this.apiRoot
        .me()
        .login()
        .post({
          body: {
            email,
            password,
            activeCartSignInMode: 'MergeWithExistingCustomerCart', // This will merge anonymous cart with user's cart
          },
        })
        .execute();

      if (response.statusCode === 200) {
        await this.updateClient(getPasswordClient(email, password), true);

        Router.go('/', { addToHistory: true });

        this.apiRoot.me().get().execute();

        document.dispatchEvent(pendingEnd);
        document.dispatchEvent(this.loggedStatusEvent);

        showToastMessage('Logged in successfully', ToastColors.Green); // Show notification
      }
    } catch (e) {
      this.handleAuthError(e);
      document.dispatchEvent(pendingEnd);
    }
  }

  public handleToken(): void {
    const existingToken = tokenCache.get();
    // If there is no token, create anonymous client
    if (!existingToken) {
      this.apiRoot = createApiBuilderFromCtpClient(getAnonymousClient()).withProjectKey({
        projectKey,
      });
    } else {
      // If there is a token
      const expirationDate = new Date(existingToken.expirationTime);
      const diff = expirationDate.getTime() - new Date().getTime();
      // If token is not about to expire, use existingTokenFlow
      if (diff > 60000) {
        this.apiRoot = createApiBuilderFromCtpClient(getExistingTokenClient()).withProjectKey({
          projectKey,
        });
        // If token is about to expire in one minute, use refreshTokenFlow
      } else {
        this.apiRoot = createApiBuilderFromCtpClient(getRefreshTokenClient()).withProjectKey({
          projectKey,
        });
      }
    }
    this.apiRoot.get().execute(); // Initial request to get the access token
  }

  public async registerUser(user: MyCustomerDraft): Promise<ClientResponse<CustomerSignInResult>> {
    try {
      const response = await this.apiRoot
        .customers()
        .post({
          body: user,
        })
        .execute();
      return response;
    } catch (error) {
      console.error('Error during user registration:', error);
      throw error;
    }
  }

  public async logout(): Promise<void> {
    tokenCache.delete();

    this.apiRoot = createApiBuilderFromCtpClient(getAnonymousClient()).withProjectKey({
      projectKey,
    });

    await this.apiRoot.get().execute(); // Initial request to get the access token

    localStorage.setItem('isLoggedIn', JSON.stringify(false));

    Router.go('/login', { addToHistory: true });

    document.dispatchEvent(this.loggedStatusEvent);

    showToastMessage('Logged out', ToastColors.Blue); // Show notification
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

const clientService = new ClientService();
clientService.handleToken();
export default clientService;
