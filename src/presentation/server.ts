import express, { Router } from 'express';
import compression from 'compression';
import { errorHandler } from '@infrastructure/http/middlewares/errorHandler.middleware';
import cors from 'cors';
import helmet from 'helmet';
import {
  getHelmetConfig,
  getCorsConfig,
  getCurrentEnvironment,
} from '@infrastructure/security/helmet.config';
import { logger } from '@infrastructure/logging/logger.config';
import * as promClient from 'prom-client';

interface Options {
  port: number;
  routes: Router;
}

export class Server {
  readonly app = express();
  readonly port: number;
  readonly routes: Router;
  private listener?: ReturnType<typeof express.application.listen>;

  constructor(options: Options) {
    this.port = options.port;
    this.routes = options.routes;
  }

  async start(): Promise<void> {
    // Collect default metrics for Prometheus only in development
    if (getCurrentEnvironment() === 'development') {
      promClient.collectDefaultMetrics();
    }

    // Configurar trust proxy para Railway
    // Railway usa un reverse proxy, necesitamos confiar en él para obtener la IP real del cliente
    this.app.set('trust proxy', 1);

    // Aplicar configuración de seguridad con Helmet
    // La configuración se ajusta automáticamente según el entorno (dev/prod)
    this.app.use(helmet(getHelmetConfig(getCurrentEnvironment())));

    // Aplicar configuración de CORS
    // Los orígenes permitidos están centralizados en el módulo de seguridad
    this.app.use(cors(getCorsConfig(getCurrentEnvironment())));

    this.app.use(express.json()); // For parsing application/json
    this.app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
    this.app.use(compression()); // Enable compression for responses
    this.app.use(this.routes);

    // Prometheus metrics endpoint - Only available in development
    if (getCurrentEnvironment() === 'development') {
      this.app.get('/metrics', async (req, res) => {
        res.set('Content-Type', promClient.register.contentType);
        res.end(await promClient.register.metrics());
      });
    }

    /* Middleware for errors */
    this.app.use(errorHandler);

    // Start the server
    this.listener = this.app.listen(this.port, () => {
      logger.info(`Server is running on port ${this.port}`);
    });
  }

  async stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.listener) {
        this.listener.close((err) => {
          if (err) return reject(err);
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
}
