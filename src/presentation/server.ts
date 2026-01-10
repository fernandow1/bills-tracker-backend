import express, { Router } from 'express';
import compression from 'compression';
import { errorHandler } from '@infrastructure/http/middlewares/errorHandler.middleware';
import cors from 'cors';

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
    /* Middleware can be added here if needed */

    // Configuración más flexible para desarrollo
    this.app.use(
      cors({
        origin:
          process.env.NODE_ENV === 'production'
            ? ['https://bills-tracker-frontend-delta.vercel.app']
            : ['http://localhost:4200', 'http://127.0.0.1:4200'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      }),
    );

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
