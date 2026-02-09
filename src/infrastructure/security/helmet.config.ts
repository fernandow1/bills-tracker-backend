import { HelmetOptions } from 'helmet';
import { CorsOptions } from 'cors';

/**
 * URLs permitidas según el entorno
 */
const ALLOWED_ORIGINS = {
  development: ['http://localhost:4200', 'http://127.0.0.1:4200'],
  production: [
    process.env.FRONTEND_URL_PROD || 'https://bills-tracker-frontend-delta.vercel.app',
  ].filter(Boolean) as string[],
};

/**
 * Configuración de Content Security Policy para desarrollo
 * Más permisiva para facilitar debugging y desarrollo local
 */
const getDevelopmentCSP = () => ({
  directives: {
    // Por defecto, solo permitimos recursos del mismo origen
    defaultSrc: ["'self'"],

    // Scripts: Permitimos scripts del mismo origen
    // En desarrollo podrías necesitar 'unsafe-eval' para HMR (Hot Module Replacement)
    scriptSrc: ["'self'"],

    // Estilos: Angular y otros frameworks usan estilos inline
    // 'unsafe-inline' es necesario en desarrollo
    styleSrc: ["'self'", "'unsafe-inline'"],

    // Conexiones: Permitimos API local y frontend de desarrollo
    connectSrc: [
      "'self'",
      ...ALLOWED_ORIGINS.development,
      'ws://localhost:4200', // WebSocket para HMR
      'ws://127.0.0.1:4200',
    ],

    // Imágenes: Permitimos data URIs para logos/iconos embebidos
    imgSrc: ["'self'", 'data:', 'blob:'],

    // Fuentes: Permitimos fuentes del mismo origen
    fontSrc: ["'self'", 'data:'],

    // Evitar que el sitio sea embebido en iframes (previene Clickjacking)
    frameAncestors: ["'none'"],

    // Bloquear objetos como Flash o plugins antiguos
    objectSrc: ["'none'"],

    // Base URI: Restringir URLs base
    baseUri: ["'self'"],

    // Form action: Solo permitir envío de formularios al mismo origen
    formAction: ["'self'"],
  },
});

/**
 * Configuración de Content Security Policy para producción
 * Políticas estrictas para máxima seguridad
 */
const getProductionCSP = () => ({
  directives: {
    // Por defecto, solo permitimos recursos del mismo origen
    defaultSrc: ["'self'"],

    // Scripts: Solo del mismo origen, sin eval ni inline
    scriptSrc: ["'self'"],

    // Estilos: Idealmente sin 'unsafe-inline', pero Angular lo requiere
    // En el futuro, considera usar nonces o hashes
    styleSrc: ["'self'", "'unsafe-inline'"],

    // Conexiones: Solo al mismo origen y frontend de producción
    connectSrc: ["'self'", ...ALLOWED_ORIGINS.production],

    // Imágenes: Permitimos data URIs
    imgSrc: ["'self'", 'data:', 'blob:'],

    // Fuentes: Solo del mismo origen
    fontSrc: ["'self'", 'data:'],

    // Evitar que el sitio sea embebido en iframes
    frameAncestors: ["'none'"],

    // Bloquear objetos antiguos
    objectSrc: ["'none'"],

    // Base URI: Restringir URLs base
    baseUri: ["'self'"],

    // Form action: Solo al mismo origen
    formAction: ["'self'"],

    // Forzar HTTPS en producción
    upgradeInsecureRequests: [],
  },
});

/**
 * Obtiene la configuración completa de Helmet según el entorno
 * @param environment - 'development' o 'production'
 * @returns Configuración de Helmet
 */
export const getHelmetConfig = (
  environment: 'development' | 'production' = 'development',
): HelmetOptions => {
  const isDevelopment = environment === 'development';

  return {
    // Content Security Policy
    contentSecurityPolicy: isDevelopment ? getDevelopmentCSP() : getProductionCSP(),

    // X-Content-Type-Options: nosniff
    // Evita que el navegador intente adivinar el tipo MIME de los archivos
    noSniff: true,

    // Oculta el header X-Powered-By para no revelar que usamos Express
    hidePoweredBy: true,

    // X-Frame-Options: DENY
    // Previene que el sitio sea embebido en iframes (ya cubierto por CSP frameAncestors)
    frameguard: {
      action: 'deny',
    },

    // Strict-Transport-Security (HSTS)
    // Solo en producción, fuerza HTTPS por 1 año
    hsts: isDevelopment
      ? false
      : {
          maxAge: 31536000, // 1 año en segundos
          includeSubDomains: true,
          preload: true,
        },

    // X-DNS-Prefetch-Control
    // Controla el prefetch de DNS del navegador
    dnsPrefetchControl: {
      allow: false,
    },

    // Referrer-Policy
    // Controla cuánta información del referrer se envía
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin',
    },
  };
};

/**
 * Obtiene la configuración de CORS según el entorno
 * @param environment - 'development' o 'production'
 * @returns Configuración de CORS
 */
export const getCorsConfig = (
  environment: 'development' | 'production' = 'development',
): CorsOptions => {
  return {
    // Orígenes permitidos según el entorno
    origin: ALLOWED_ORIGINS[environment],

    // Permitir credenciales (cookies, headers de autorización)
    credentials: true,

    // Métodos HTTP permitidos
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

    // Headers permitidos en las peticiones
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  };
};

/**
 * Helper para obtener el entorno actual
 */
export const getCurrentEnvironment = (): 'development' | 'production' => {
  return process.env.NODE_ENV === 'production' ? 'production' : 'development';
};
