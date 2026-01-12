export const BASE_URL = {
  auth: {
    dev: "http://localhost:3001",
    test: "https://api-test.miniwallet.io",
    staging: "https://api-staging.miniwallet.io",
    prod: "https://api.miniwallet.io",
  },
  dashboard: {
    dev: 'https://inhousedashboard-test-app.azurewebsites.net',
    test: 'https://inhousedashboard-test-app.azurewebsites.net',
    staging: 'https://inhousedashboard-staging-app.azurewebsites.net',
    prod: 'https://inhousedashboard-prod-app.azurewebsites.net',
  },
  creditcoin: {
    dev: 'https://api-dev.creditcoin.org',
    test: 'https://api-test.creditcoin.org',
    staging: 'https://api-staging.creditcoin.org',
    prod: 'https://api.creditcoin.org',
  }
};

export type Host = keyof typeof BASE_URL;
export type Env = keyof typeof BASE_URL[Host];