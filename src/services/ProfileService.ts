import type { ClientResponse, Customer } from '@commercetools/platform-sdk';

import clientService from './ClientService';

export class ProfileService {
  public async getUserData(): Promise<ClientResponse<Customer>> {
    const response = await clientService.apiRoot.me().get().execute();

    return response;
  }
}

const profileService = new ProfileService();
export default profileService;
