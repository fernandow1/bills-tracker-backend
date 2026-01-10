import { Router } from 'express';
import { HealthController } from './controller';

export function healthRouter(): Router {
  const router = Router();
  const controller = new HealthController();

  router.get('/', controller.checkHealth);

  return router;
}
