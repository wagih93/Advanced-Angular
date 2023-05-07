export const environment = {
  production: true,
  baseUrl: 'https://teamplanningbackend.azurewebsites.net',
  authConfig: {
    domain: 'teamplanning.us.auth0.com',
    authority: 'https://teamplanning.us.auth0.com',
    clientId: '6953cACSa9jDXW9KCwUzjDMMncdnP7ph',
    scope: 'openid profile offline_access',
    audience: 'https://teamplanning.us.auth0.com/api/v2/',
    secureRoutes: ['https://teamplanningbackend.azurewebsites.net/api/']
  }
};
