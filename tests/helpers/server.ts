import express from 'express';
import compression from 'compression';
import { envs } from '../../src/infrastructure/config/env';
import { AppRoutes } from '../../src/presentation/routes';
import { errorHandler } from '../../src/infrastructure/http/middlewares/errorHandler.middleware';

// Crear app de Express configurada para tests
const CREATE_TEST_APP = (): express.Application => {
  const app = express();

  // Configurar middlewares exactamente igual que en Server.start()
  app.use(express.json()); // For parsing application/json
  app.use(AppRoutes.routes()); // Registrar las rutas
  app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
  app.use(compression()); // Enable compression for responses
  app.use(errorHandler); // Middleware for errors

  return app;
};

export const CREATE_TEST_SERVER = {
  app: CREATE_TEST_APP(),
  port: envs.PORT_TEST,
};
