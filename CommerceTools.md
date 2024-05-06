use this link
https://www.youtube.com/watch?v=XteP7ArQmE0&t=52s

se these credentials to access the project via API:
coffee-loop-shop

project_key
coffee-loop-shop

client_id
WYRDm7E3NorAMYmCjHMrMTch

secret
MdR7cHbiDmiSW6u0jWs4y8TRIFGKAxgy

scope
manage_project:coffee-loop-shop

API URL
https://api.europe-west1.gcp.commercetools.com

Auth URL
https://auth.europe-west1.gcp.commercetools.com


Environment Variables (.env)

CTP_PROJECT_KEY=coffee-loop-shop
CTP_CLIENT_SECRET=MdR7cHbiDmiSW6u0jWs4y8TRIFGKAxgy
CTP_CLIENT_ID=WYRDm7E3NorAMYmCjHMrMTch
CTP_AUTH_URL=https://auth.europe-west1.gcp.commercetools.com
CTP_API_URL=https://api.europe-west1.gcp.commercetools.com
CTP_SCOPES=manage_project:coffee-loop-shop


ES-6

  import { createClient } from '@commercetools/sdk-client'
  import { createAuthMiddlewareForClientCredentialsFlow } from '@commercetools/sdk-middleware-auth'
  import { createHttpMiddleware } from '@commercetools/sdk-middleware-http'

  const projectKey = 'coffee-loop-shop'

  const authMiddleware = createAuthMiddlewareForClientCredentialsFlow({
    host: 'https://auth.europe-west1.gcp.commercetools.com',
    projectKey,
    credentials: {
      clientId: 'WYRDm7E3NorAMYmCjHMrMTch',
      clientSecret: 'MdR7cHbiDmiSW6u0jWs4y8TRIFGKAxgy',
    },
    scopes: ['manage_project:coffee-loop-shop'],
  })
  const httpMiddleware = createHttpMiddleware({
    host: 'https://api.europe-west1.gcp.commercetools.com',
  })
  const client = createClient({
    middlewares: [authMiddleware, httpMiddleware],
  })


_cURL
curl https://auth.europe-west1.gcp.commercetools.com/oauth/token \
     --basic --user "WYRDm7E3NorAMYmCjHMrMTch:MdR7cHbiDmiSW6u0jWs4y8TRIFGKAxgy" \
     -X POST \
     -d "grant_type=client_credentials&scope=manage_project:coffee-loop-shop"


postman_environment

{
  "id": "acab6d2c-5edd-4a03-b173-049e13c6cc33",
  "name": "coffee-loop-shop",
  "values": [
    {
      "key": "host",
      "value": "https://api.europe-west1.gcp.commercetools.com",
      "enabled": true,
      "type": "text"
    },
    {
      "key": "auth_url",
      "value": "https://auth.europe-west1.gcp.commercetools.com",
      "enabled": true,
      "type": "text"
    },
    {
      "key": "project-key",
      "value": "coffee-loop-shop",
      "enabled": true,
      "type": "text"
    },
    {
      "key": "client_id",
      "value": "WYRDm7E3NorAMYmCjHMrMTch",
      "enabled": true,
      "type": "text"
    },
    {
      "key": "client_secret",
      "value": "MdR7cHbiDmiSW6u0jWs4y8TRIFGKAxgy",
      "enabled": true,
      "type": "text"
    }
  ],
  "_postman_variable_scope": "environment",
  "_postman_exported_at": "2024-05-05T21:13:15.475Z",
  "_postman_exported_using": "Postman/6.0.10"
}

