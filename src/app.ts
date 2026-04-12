import { AppDataSource } from '@infrastructure/database/connection';
import { AppRoutes } from '@presentation/routes';
import { Server } from '@presentation/server';
import { envs } from '@infrastructure/config/env';
import { logger } from '@infrastructure/logging/logger.config';

(async (): Promise<void> => {
  try {
    await main();
  } catch (error) {
    logger.error('Error starting the server:', error);
    process.exit(1);
  }
})();

async function main(): Promise<void> {
  try {
    await AppDataSource.initialize();
  } catch (error) {
    logger.error('Error connecting to the database:', error);
    process.exit(1);
  }
  logger.info('Database connection established successfully');
  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes(),
  });

  await server.start();

  // --- Graceful Shutdown Logic ---
  const gracefulShutdown = async (signal: NodeJS.Signals): Promise<void> => {
    logger.info(`\n[${signal}] Signal received. Starting graceful shutdown...`);

    // Failsafe: Prevenir que el proceso se congele indefinidamente si algo bloquea el cierre
    setTimeout(() => {
      logger.error('Shutdown timed out, forcing exit.');
      process.exit(1);
    }, 10000).unref();

    try {
      logger.info('1. Closing HTTP server (stopping new connections)...');
      await server.stop();

      logger.info('2. Closing Database connection...');
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
      }

      logger.info('✅ Graceful shutdown completed successfully. Exiting process.');
      process.exit(0);
    } catch (error) {
      logger.error('❌ Error during graceful shutdown:', error);
      process.exit(1);
    }
  };

  // Escuchar a señales de terminación generadas por Railway, Docker o Ctrl+C
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}
