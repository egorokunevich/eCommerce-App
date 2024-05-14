import type {
  ByProjectKeyCustomersRequestBuilder,
  ByProjectKeyMeRequestBuilder,
  ByProjectKeyRequestBuilder,
  ClientResponse,
  CustomerPagedQueryResponse,
  CustomerSignInResult,
  MyCustomerSignin,
  Project,
} from '@commercetools/platform-sdk';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import type { Client } from '@commercetools/sdk-client-v2';
import { v4 as uuidv4 } from 'uuid'; // Library to generate random ID

import { getPasswordClient } from './BuildPasswordFlowClient';
import * as secretVariables from './LoginAPIVariables';

type TokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
  error_description?: string;
};

type TokenData = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
  when_created: Date;
};

type LocalTokens = {
  anonymousToken: TokenData;
  credentialsToken: TokenData;
  passwordToken: TokenData;
};

export class ClientService {
  private apiRoot: ByProjectKeyRequestBuilder;
  private apiCustomers: ByProjectKeyCustomersRequestBuilder;
  private apiMe: ByProjectKeyMeRequestBuilder;
  private anonymousToken: TokenData | null;

  constructor(client: Client) {
    this.apiRoot = createApiBuilderFromCtpClient(client).withProjectKey({
      projectKey: secretVariables.CTP_PROJECT_KEY,
    });
    this.anonymousToken = null;
    this.apiCustomers = this.apiRoot.customers();
    this.apiMe = this.apiRoot.me();
  }

  private async generateAnonymousToken(): Promise<TokenData | null> {
    const anonymousId = uuidv4();
    try {
      const response = await fetch(
        `https://auth.europe-west1.gcp.commercetools.com/oauth/${secretVariables.CTP_PROJECT_KEY}/anonymous/token`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(`${secretVariables.CTP_CLIENT_ID}:${secretVariables.CTP_CLIENT_SECRET}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            grant_type: 'client_credentials',
            scope: `create_anonymous_token:${secretVariables.CTP_PROJECT_KEY}`,
            anonymous_id: anonymousId,
          }),
        },
      );

      const data: TokenResponse = await response.json();
      if (!response.ok) {
        throw new Error(data.error_description || 'Failed to obtain token');
      }

      const tokenData: TokenData = {
        access_token: data.access_token,
        expires_in: data.expires_in,
        refresh_token: data.refresh_token,
        token_type: data.token_type,
        when_created: new Date(Date.now()),
      };
      return tokenData;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  // public getTokens(): Promise<ClientResponse<Project>> {}

  // Only request a token with an anonymous session when the visitor creates a cart, shopping list or other visitor-specific resource to avoid creating unused anonymous sessions.
  public async getAnonymousToken(): Promise<TokenData | null> {
    return this.generateAnonymousToken().then((token: TokenData | null) => {
      if (token) {
        this.anonymousToken = token;
        localStorage.setItem('anonymousToken', JSON.stringify(this.anonymousToken));
        return token;
      }
      return null;
    });
  }

  public getPasswordClient(email: string, password: string): Client {
    return getPasswordClient(email, password);
  }

  public checkForTokens(): LocalTokens {
    return {
      anonymousToken: JSON.parse(localStorage.getItem('anonymousToken') ?? 'null'),
      credentialsToken: JSON.parse(localStorage.getItem('credentialsToken') ?? 'null'),
      passwordToken: JSON.parse(localStorage.getItem('passwordToken') ?? 'null'),
    };
  }

  public async logInCustomer(customer: MyCustomerSignin): Promise<ClientResponse<CustomerSignInResult>> {
    const root = this.apiMe.login();
    return root
      .post({
        body: customer,
      })
      .execute();
  }

  public async getAllCustomers(
    limit?: number,
    offset?: number,
    sort?: string | string[],
  ): Promise<ClientResponse<CustomerPagedQueryResponse>> {
    return this.apiCustomers
      .get({
        queryArgs: {
          limit,
          offset,
          sort, // e.g 'firstName asc', e.g 'email desc'
        },
      })
      .execute();
  }
}
