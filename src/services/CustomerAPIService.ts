import type {
  ByProjectKeyCustomersRequestBuilder,
  ByProjectKeyMeRequestBuilder,
  ByProjectKeyRequestBuilder,
  ClientResponse,
  CustomerPagedQueryResponse,
  CustomerSignInResult,
  MyCustomerSignin,
} from '@commercetools/platform-sdk';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

import { ctpClient } from './BuildCredentialsFlowClient';
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
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  tokenType: string;
};

type Address = {
  streetName: string;
  streetNumber: string;
  city: string;
  postalCode: string;
  country: Country;
};

type Country = 'DE' | 'US';

export type CustomerSignUp = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  addresses: Address[];
};

// Formats date of birth
export function concatDateOfBirth(year: number, month: number, day: number): string {
  return `${year.toString().padStart(4, '0')}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

export class CustomerService {
  private apiRoot: ByProjectKeyRequestBuilder;
  private apiCustomers: ByProjectKeyCustomersRequestBuilder;
  private apiMe: ByProjectKeyMeRequestBuilder;

  constructor() {
    this.apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
      projectKey: secretVariables.CTP_PROJECT_KEY,
    });
    this.apiCustomers = this.apiRoot.customers();
    this.apiMe = this.apiRoot.me();
  }

  public async getCustomerByEmail(email: string): Promise<ClientResponse<CustomerPagedQueryResponse>> {
    const customerToFind: ClientResponse<CustomerPagedQueryResponse> = await this.apiCustomers
      .get({
        queryArgs: {
          where: `email="${email}"`,
        },
      })
      .execute();

    return customerToFind;
  }

  public async doesCustomerWithEmailExists(email: string): Promise<boolean> {
    const result = Boolean((await this.getCustomerByEmail(email)).body.results.length);

    return result;
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

  public async deleteCustomerWithKey(key: string): Promise<void> {
    this.apiCustomers
      .withKey({
        key,
      })
      .get()
      .execute();
  }

  public async createCustomer(customer: CustomerSignUp): Promise<ClientResponse<CustomerSignInResult>> {
    const root = this.apiMe.signup();
    return root
      .post({
        body: customer,
      })
      .execute();
  }

  public async logInCustomer(customer: MyCustomerSignin): Promise<ClientResponse<CustomerSignInResult>> {
    const root = this.apiMe.login();
    return root
      .post({
        body: customer,
      })
      .execute();
  }

  public async getEmails(limit?: number, offset?: number, sort?: string | string[]): Promise<string[]> {
    const customers = await this.apiCustomers
      .get({
        queryArgs: {
          limit,
          offset,
          sort, // e.g 'email asc', e.g 'email desc'
        },
      })
      .execute();
    const emails = customers.body.results.map((customer) => {
      return customer.email;
    });
    return emails;
  }

  private async generateAnonymousToken(): Promise<TokenData | null> {
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
            scope: 'create_anonymous_token:coffee-loop-shop',
          }),
        },
      );

      const data: TokenResponse = await response.json();
      if (!response.ok) {
        throw new Error(data.error_description || 'Failed to obtain token');
      }

      const tokenData = {
        accessToken: data.access_token,
        expiresIn: data.expires_in,
        refreshToken: data.refresh_token,
        tokenType: data.token_type,
      };
      return tokenData;
    } catch (error) {
      console.error('Error:', error);
      return null;
    }
  }

  // Only request a token with an anonymous session when the visitor creates a cart, shopping list or other visitor-specific resource to avoid creating unused anonymous sessions.
  public async getAnonymousToken(): Promise<TokenData | null> {
    return this.generateAnonymousToken().then((token: TokenData | null) => {
      if (token) {
        // console.log('Anonymous Token:', token);
        return token;
        // Use the access token to make requests to API endpoints
      }
      // console.log('Failed to obtain anonymous token');
      return null;
    });
  }
}
