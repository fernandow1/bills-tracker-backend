import { Request, Response } from 'express';

export class HealthController {
  public checkHealth = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({
      status: 'ok',
      message: 'Server is running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  };
}
