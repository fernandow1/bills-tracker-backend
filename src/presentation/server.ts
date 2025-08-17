import express, { Router } from 'express';
import compression from 'compression';
import { errorHandler } from '@infrastructure/http/middlewares/errorHandler.middleware';

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
    this.app.use(express.json()); // For parsing application/json
    this.app.use(this.routes);
    this.app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
    this.app.use(compression()); // Enable compression for responses

    /* Middleware for errors */
    this.app.use(errorHandler);

    // Start the server
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}
