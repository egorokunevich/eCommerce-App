import { ctpClient } from './BuildClient';
import { ApiRoot, createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';

// Create apiRoot from the imported ClientBuilder and include your Project key
const apiRoot = createApiBuilderFromCtpClient(ctpClient).withProjectKey({
  projectKey: 'coffee-loop-shop',
});

// Example call to return Project information
// This code has the same effect as sending a GET request to the commercetools Composable Commerce API without any endpoints.
const getProject = () => {
  return apiRoot.get().execute();
};

// Retrieve Project information and output the result to the log
getProject().then().catch(console.error);
// console.log(apiRoot.customers().get().execute());

const createCustomer = () => {
  return apiRoot
    .customers()
    .post({
      // The CustomerDraft is the object within the body
      body: {
        email: 'sdk@example123.com',
        password: 'examplePassword',
      },
    })
    .execute();
};
// let idCustomer: string;
// Create the customer and output the Customer ID
const idCustomer = await createCustomer()
  .then(({ body }) => {
    console.log(body.customer.id);
    return body.customer.id;
  })
  .catch(console.error);

const updateCustomerName = (customerID: string) => {
  return apiRoot
    .customers()
    .withId({ ID: customerID })
    .post({
      // The CustomerUpdate is the object within the body
      body: {
        // The version of a new Customer is 1. This value is incremented every time an update action is applied to the Customer. If the specified version does not match the current version, the request returns an error.
        version: 1,
        actions: [
          {
            action: 'setFirstName',
            firstName: 'John',
          },
          {
            action: 'setLastName',
            lastName: 'Smith',
          },
        ],
      },
    })
    .execute();
};

// Update the customer and output the updated Customer's full name
updateCustomerName(idCustomer)
  .then(({ body }) => {
    console.log(body.firstName + ' ' + body.lastName);
  })
  .catch(console.error);
console.log(123);
