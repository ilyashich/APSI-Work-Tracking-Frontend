export const environment = {
  production: false,
  assets_path: '../../assets',
  showBooking: false,
  showMessages: true,
  showSamsungHealth: true,
  showGoogleFit: true,
  allowSse: true,
  SENTRY_URL: '',
  BUILD_ENVIRONMENT: 'Development',
  // ----------
  INFERMEDICA_API_URL: 'https://api.infermedica.com/v2',
  INFERMEDICA_requiredHighProbability: 0.90,
  INFERMEDICA_requiredHighProbabilityConditions: 1,
  INFERMEDICA_probabilityHighMin: 0.70,
  INFERMEDICA_probabilityMediumMin: 0.40,
  // -----------
  HTTP_REQUEST_TIMEOUT: 60000,
  HTTP_UPLOAD_TIMEOUT: 60000,
  // -----------------
  name: 'dev',
  urlName: 'test',
  local: false,
  // -----------------
  STATIC_PATH: 'https://static.test.healthdom.com',
  //
  ACCOUNT_SERVICE_PATH: 'http://localhost:8091',
  SESSION_SERVICE_PATH: 'http://localhost:8092',
  EXTERNAL_SERVICE_PATH: 'http://localhost:8094',
  DEBUG_SERVICE_PATH: 'http://localhost:8099',
  DASHBOARD_SERVICE_PATH: 'http://localhost:8098',
  SSE_SERVICE_PATH: 'http://localhost:8093',

};
