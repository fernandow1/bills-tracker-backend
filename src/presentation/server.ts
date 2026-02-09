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
import { generalRateLimiter } from '@infrastructure/security/rate-limit.config';

interface Options {
  port: number;
  routes: Router;
}

export class Server {
  readonly app = express();
  readonly port: number;
  readonly routes: Router;

  constructor(options: Options) {
    this.port = options.port;
    this.routes = options.routes;
  }

  async start(): Promise<void> {
    // Configurar trust proxy para Railway
    // Railway usa un reverse proxy, necesitamos confiar en él para obtener la IP real del cliente
    this.app.set('trust proxy', 1);

    // Aplicar configuración de seguridad con Helmet
    // La configuración se ajusta automáticamente según el entorno (dev/prod)
    this.app.use(helmet(getHelmetConfig(getCurrentEnvironment())));

    // Aplicar configuración de CORS
    // Los orígenes permitidos están centralizados en el módulo de seguridad
    this.app.use(cors(getCorsConfig(getCurrentEnvironment())));

    // Aplicar rate limiting general a toda la API
    // Límites específicos por endpoint se aplican en las rutas
    this.app.use(generalRateLimiter);

    this.app.use(express.json()); // For parsing application/json
    this.app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
    this.app.use(compression()); // Enable compression for responses
    this.app.use(this.routes);

    /* Middleware for errors */
    this.app.use(errorHandler);

    // Start the server
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}
