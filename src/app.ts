import { AppDataSource } from './infrastructure/database/connection';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';
import { envs } from './infrastructure/config/env';

(async (): Promise<void> => {
  try {
    await main();
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1);
  }
})();

async function main(): Promise<void> {
  try {
    await AppDataSource.initialize();
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
  console.log('Database connection established successfully');
  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes(),
  });

  await server.start();
}
