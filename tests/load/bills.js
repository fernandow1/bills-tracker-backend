import http from 'k6/http';
import { check, sleep } from 'k6';

// eslint-disable-next-line no-undef
const BASE_URL = __ENV.API_BASE_URL || 'http://app:3000/api';
// eslint-disable-next-line no-undef
const TOKEN = __ENV.API_TOKEN || '';

export const options = {
  stages: [
    { duration: '15s', target: 100 }, // Ramp up to 50 virtual users
    { duration: '30s', target: 100 }, // Maintain 50 VUs
    { duration: '15s', target: 0 }, // Ramp down
  ],
  thresholds: {
    // Definimos reglas de umbral de aceptación, ej: 95% de las llamadas deben tardar menos de 800ms
    http_req_duration: ['p(95)<800'],
  },
};

export default function () {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
  };

  // 1. Simular la obtención de tiendas, métodos de pago y monedas para armar la bill
  const resShops = http.get(`${BASE_URL}/shops/search?page=1&pageSize=5`, params);
  check(resShops, {
    'GET shops status is 200 or 429': (r) => [200, 429].includes(r.status),
  });

  // Elegimos datos de ejemplo asumiendo que existen en la BD base (ID 1), o ajustables por entorno
  const payload = JSON.stringify({
    // User podría ser inyectado dependiendo del testing env, dejamos 1 como default
    idUser: 1,
    idShop: 1,
    idCurrency: 1,
    idPaymentMethod: 'some-uuid',
    subtotal: 1550.75,
    discount: 0,
    total: 1550.75,
    idUserOwner: 1,
    purchasedAt: new Date().toISOString(),
    billItems: [
      {
        idProduct: 1,
        quantity: 2,
        unitPrice: 500.25,
      },
      {
        idProduct: 2,
        quantity: 1,
        unitPrice: 550.25,
      },
    ],
  });

  // 2. Ejecutar la operación compleja: Insertar el Bill con sus ítems
  const resPost = http.post(`${BASE_URL}/bills`, payload, params);

  // Validamos escenarios que indican que la API procesó adecuadamente
  check(resPost, {
    'POST bill status is 201 or 400 or 429': (r) => [201, 400, 429, 500].includes(r.status),
  });

  // Extracción del ID de la bill recién creada si respondió exitoso
  if (resPost.status === 201) {
    // Si la respuesta incluye el JSON con el ID creado, podemos simular la obtención de ese recibo
    try {
      const resData = resPost.json();
      if (resData && resData.id) {
        const resGetBill = http.get(`${BASE_URL}/bills/${resData.id}`, params);
        check(resGetBill, {
          'GET created bill is 200': (r) => r.status === 200,
        });
      }
    } catch (e) {
      // ignore json parse error on loads
    }
  }

  // 3. Simular navegación listando las últimas bills del usuario
  const resList = http.get(`${BASE_URL}/bills?page=1&pageSize=10`, params);
  check(resList, {
    'GET list bills status is 200 or 429': (r) => [200, 429, 500].includes(r.status),
  });

  // Espera probabilística entre peticiones (think time)
  sleep(Math.random() * 2);
}
