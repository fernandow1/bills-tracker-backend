/* eslint-disable @typescript-eslint/no-extraneous-class */
import Redis from 'ioredis';
import { envs } from '@infrastructure/config/env';

/**
 * Cliente Redis para rate limiting
 * Configurado para funcionar tanto en desarrollo (Docker) como en producción (Railway)
 */
class RedisClient {
  private static instance: Redis | null = null;
  private static connectionAttempted = false;

  // Private constructor to prevent instantiation
  private constructor() {}

  /**
   * Obtiene la instancia del cliente Redis
   * Retorna null si Redis no está disponible (graceful degradation)
   */
  static getInstance(): Redis | null {
    // Solo intentar conectar una vez
    if (this.connectionAttempted) {
      return this.instance;
    }

    this.connectionAttempted = true;

    // Si no hay REDIS_URL configurado, no intentar conectar
    if (!envs.REDIS_URL) {
      console.warn('⚠️  REDIS_URL not configured. Rate limiting will use memory store.');
      return null;
    }

    try {
      this.instance = new Redis(envs.REDIS_URL, {
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        retryStrategy: (times): number => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
      });

      this.instance.on('connect', () => {
        console.log('✅ Redis connected successfully');
      });

      this.instance.on('error', (err) => {
        console.error('❌ Redis connection error:', err.message);
      });

      this.instance.on('ready', () => {
        console.log('🚀 Redis ready for rate limiting');
      });

      return this.instance;
    } catch (error) {
      console.error('❌ Failed to create Redis client:', error);
      this.instance = null;
      return null;
    }
  }

  /**
   * Cierra la conexión de Redis (útil para tests)
   */
  static async disconnect(): Promise<void> {
    if (this.instance) {
      await this.instance.quit();
      this.instance = null;
      this.connectionAttempted = false;
    }
  }

  /**
   * Verifica si Redis está conectado y listo
   */
  static isConnected(): boolean {
    return this.instance !== null && this.instance.status === 'ready';
  }
}

export default RedisClient;
