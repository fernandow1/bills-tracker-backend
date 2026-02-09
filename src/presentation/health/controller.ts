import { Request, Response } from 'express';
import RedisClient from '@infrastructure/database/redis.client';
import { AppDataSource } from '@infrastructure/database/connection';

export class HealthController {
  public checkHealth = async (req: Request, res: Response): Promise<void> => {
    // Check Redis connection
    const redisStatus = RedisClient.isConnected()
      ? 'connected'
      : RedisClient.getInstance()
        ? 'disconnected'
        : 'not_configured';

    // Check database connection
    const dbStatus = AppDataSource.isInitialized ? 'connected' : 'disconnected';

    // Overall health status
    const isHealthy = dbStatus === 'connected';

    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'ok' : 'degraded',
      message: isHealthy ? 'Server is running' : 'Server is running with issues',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      services: {
        database: {
          status: dbStatus,
          type: 'mysql',
        },
        redis: {
          status: redisStatus,
          type: 'redis',
          note:
            redisStatus === 'not_configured' ? 'Using memory store for rate limiting' : undefined,
        },
      },
    });
  };
}
