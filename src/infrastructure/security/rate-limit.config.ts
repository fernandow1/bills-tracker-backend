import rateLimit, { type Options as RateLimitOptions } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import RedisClient from '@infrastructure/database/redis.client';
import { envs } from '@infrastructure/config/env';

/**
 * Configuración de rate limiting para la aplicación
 * Usa Redis cuando está disponible, sino fallback a MemoryStore
 */

const isDevelopment = envs.NODE_ENV === 'development';
const isTest = envs.NODE_ENV === 'test';

/**
 * Obtiene el store de rate limiting según disponibilidad de Redis
 * Cada rate limiter debe tener su propia instancia con un prefix único
 */
const getRateLimitStore = (prefix: string): RedisStore | undefined => {
  // En desarrollo y test, no usar store (rate limiting desactivado)
  if (isDevelopment || isTest) {
    return undefined;
  }

  const redisClient = RedisClient.getInstance();

  if (!redisClient) {
    console.warn(
      '⚠️  Using memory store for rate limiting (not recommended for production with multiple instances)',
    );
    return undefined; // express-rate-limit usará MemoryStore por defecto
  }

  // ioredis.call() es compatible con SendCommandFn pero TypeScript no lo reconoce
  const sendCommand = (async (...args: [string, ...string[]]) =>
    await redisClient.call(args[0], ...args.slice(1))) as any;

  return new RedisStore({
    sendCommand,
    prefix, // Prefijo único para cada rate limiter
  });
};

/**
 * Configuración base de rate limiting
 */
const baseRateLimitConfig: Partial<RateLimitOptions> = {
  // Formato de respuesta cuando se excede el límite
  standardHeaders: true, // Retorna headers `RateLimit-*`
  legacyHeaders: false, // Deshabilita headers `X-RateLimit-*`

  // Mensaje de error personalizado
  message: {
    error: 'Too many requests',
    message: 'You have exceeded the rate limit. Please try again later.',
  },

  // Handler cuando se excede el límite
  handler: (req, res) => {
    console.warn(`⚠️  Rate limit exceeded for IP: ${req.ip} on ${req.method} ${req.path}`);
    res.status(429).json({
      error: 'Too many requests',
      message: 'You have exceeded the rate limit. Please try again later.',
      retryAfter: res.getHeader('Retry-After'),
    });
  },

  // Skip successful requests (false = contar todas las requests)
  skipSuccessfulRequests: false,

  // Skip failed requests (false = contar todas las requests)
  skipFailedRequests: false,

  // IMPORTANTE: Desactivar rate limiting en desarrollo y test
  skip: () => isDevelopment || isTest,
};

/**
 * Rate limiter general para toda la API
 * Límites generosos para uso personal
 */
export const generalRateLimiter = rateLimit({
  ...baseRateLimitConfig,
  store: getRateLimitStore('rl:general:'),
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200,
  message: {
    error: 'Too many requests',
    message: 'You have made too many requests. Please wait a few minutes and try again.',
  },
});

/**
 * Rate limiter estricto para endpoints de autenticación
 * Previene brute force attacks
 */
export const authRateLimiter = rateLimit({
  ...baseRateLimitConfig,
  store: getRateLimitStore('rl:auth:'),
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 intentos de login por ventana
  message: {
    error: 'Too many login attempts',
    message: 'Too many login attempts from this IP. Please try again after 15 minutes.',
  },
  skipSuccessfulRequests: true, // Solo contar intentos fallidos
});

/**
 * Rate limiter para registro de usuarios
 * Previene spam de cuentas
 */
export const registerRateLimiter = rateLimit({
  ...baseRateLimitConfig,
  store: getRateLimitStore('rl:register:'),
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // 5 registros por hora
  message: {
    error: 'Too many registration attempts',
    message: 'Too many accounts created from this IP. Please try again after an hour.',
  },
});

/**
 * Rate limiter muy estricto para endpoints sensibles
 * Ej: cambio de contraseña, eliminación de cuenta
 */
export const strictRateLimiter = rateLimit({
  ...baseRateLimitConfig,
  store: getRateLimitStore('rl:strict:'),
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // 3 requests por hora
  message: {
    error: 'Too many requests',
    message: 'This action is rate limited. Please try again after an hour.',
  },
});

/**
 * Configuración de rate limiting por entorno
 * Útil para tests o desarrollo
 */
export const getRateLimitConfig = (
  environment: 'development' | 'production' | 'test' = 'development',
): Partial<RateLimitOptions> => {
  if (environment === 'test') {
    // En tests, deshabilitamos rate limiting
    return {
      ...baseRateLimitConfig,
      max: 10000, // Límite muy alto
      windowMs: 1000, // Ventana muy corta
    };
  }

  if (environment === 'development') {
    // En desarrollo, límites más generosos
    return {
      ...baseRateLimitConfig,
      max: 500,
      windowMs: 15 * 60 * 1000,
    };
  }

  // Producción: usar configuración por defecto
  return baseRateLimitConfig;
};
