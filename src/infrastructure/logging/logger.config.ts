import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Formato para desarrollo: legible con colores
const developmentFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += `\n${JSON.stringify(metadata, null, 2)}`;
    }
    return msg;
  }),
);

// Formato para producción: JSON estructurado
const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

// Transportes
const transports: winston.transport[] = [];

if (isDevelopment) {
  // Desarrollo: Console con colores
  transports.push(
    new winston.transports.Console({
      format: developmentFormat,
    }),
  );
} else {
  // Producción: Archivos con rotación
  transports.push(
    // Errores en archivo separado
    new DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxSize: '20m',
      maxFiles: '14d',
      format: productionFormat,
    }),
    // Todos los logs
    new DailyRotateFile({
      filename: 'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      format: productionFormat,
    }),
  );
}

// Crear logger
export const logger = winston.createLogger({
  level: isDevelopment ? 'debug' : 'info',
  transports,
  // No salir en caso de error
  exitOnError: false,
});

// Log de inicio
logger.info('Logger initialized', {
  environment: process.env.NODE_ENV || 'development',
  level: logger.level,
});
