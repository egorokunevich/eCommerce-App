export interface IRegistrationObject {
  body: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dateOfBirth: string;
    addresses: [
      {
        streetName: string;
        streetNumber: string;
        postalCode: string;
        city: string;
        country: string;
      },
      {
        streetName: string;
        streetNumber: string;
        postalCode: string;
        city: string;
        country: string;
      },
    ];
    defaultBillingAddress: number;
    defaultShippingAddress: number;
  };
}
