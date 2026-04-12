import { Request, Response } from 'express';
import { AppDataSource } from '@infrastructure/database/connection';
import { TestDataSource } from '@infrastructure/database/connection-test';

const activeDataSource = process.env.NODE_ENV === 'test' ? TestDataSource : AppDataSource;
export class HealthController {
  public checkHealth = async (req: Request, res: Response): Promise<void> => {
    // Check database connection
    const dbStatus = activeDataSource.isInitialized ? 'connected' : 'disconnected';

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
      },
    });
  };
}
