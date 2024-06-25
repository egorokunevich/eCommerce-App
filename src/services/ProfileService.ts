import type { ClientResponse, Customer } from '@commercetools/platform-sdk';

import clientService from './ClientService';

export class ProfileService {
  public async getUserData(): Promise<ClientResponse<Customer>> {
    const response = await clientService.apiRoot.me().get().execute();

    return response;
  }

  public async updateFirstName(firstName: string): Promise<ClientResponse<Customer>> {
    const meData = await clientService.apiRoot.me().get().execute();
    const { version } = meData.body;
    const response = await clientService.apiRoot
      .me()
      .post({
        body: {
          version,
          actions: [
            {
              action: 'setFirstName',
              firstName,
            },
          ],
        },
      })
      .execute();
    return response;
  }

  public async updateLastName(lastName: string): Promise<ClientResponse<Customer>> {
    const meData = await clientService.apiRoot.me().get().execute();
    const { version } = meData.body;
    const response = await clientService.apiRoot
      .me()
      .post({
        body: {
          version,
          actions: [
            {
              action: 'setLastName',
              lastName,
            },
          ],
        },
      })
      .execute();
    return response;
  }

  public async updateEmail(email: string): Promise<ClientResponse<Customer>> {
    const meData = await clientService.apiRoot.me().get().execute();
    const { version } = meData.body;
    const response = await clientService.apiRoot
      .me()
      .post({
        body: {
          version,
          actions: [
            {
              action: 'changeEmail',
              email,
            },
          ],
        },
      })
      .execute();
    return response;
  }

  public async updateDateOfBirth(dateOfBirth: string): Promise<ClientResponse<Customer>> {
    const meData = await clientService.apiRoot.me().get().execute();
    const { version } = meData.body;
    const response = await clientService.apiRoot
      .me()
      .post({
        body: {
          version,
          actions: [
            {
              action: 'setDateOfBirth',
              dateOfBirth,
            },
          ],
        },
      })
      .execute();
    return response;
  }
}

const profileService = new ProfileService();
export default profileService;
