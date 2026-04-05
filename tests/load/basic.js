import http from 'k6/http';
import { check, sleep } from 'k6';

// The k6 container refers to the backend as `app` since they use the same docker network.
// eslint-disable-next-line no-undef
const BASE_URL = __ENV.API_BASE_URL || 'http://app:3000/api';
// Optionally get the token from environment flag (mapped from .env as TEST_API_TOKEN)
// eslint-disable-next-line no-undef
const TOKEN = __ENV.API_TOKEN || '';

export const options = {
  stages: [
    { duration: '5s', target: 5 }, // Ramp up to 5 virtual users over 5s
    { duration: '10s', target: 5 }, // Stay at 5 users for 10s
    { duration: '5s', target: 0 }, // Ramp down to 0 users over 5s
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
  },
};

export default function () {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      // Solo inyectar Authorization si existe un token provisto
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
  };

  // Test Payment Methods
  const resPaymentMethods = http.get(`${BASE_URL}/payment-methods`, params);
  check(resPaymentMethods, {
    'status is 200, 401 or 429': (r) => [200, 401, 429].includes(r.status),
  });

  // Test Shops
  const resShops = http.get(`${BASE_URL}/shops/search?page=1&pageSize=10`, params);
  check(resShops, {
    'status is 200, 401 or 429': (r) => [200, 401, 429].includes(r.status),
  });

  // Test Products
  const resProducts = http.get(`${BASE_URL}/products`, params);
  check(resProducts, {
    'status is 200, 401 or 429': (r) => [200, 401, 429].includes(r.status),
  });

  sleep(1);
}
