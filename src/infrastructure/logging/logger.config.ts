import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import TransportStream from 'winston-transport';
import { envs } from '@infrastructure/config/env';

const isDevelopment = envs.NODE_ENV !== 'production';

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

/**
 * Custom transport for BetterStack (formerly Logtail)
 * Sends logs via HTTP to BetterStack ingestion endpoint
 */
class BetterStackTransport extends TransportStream {
  private sourceToken: string;
  private endpoint: string;

  constructor(opts: TransportStream.TransportStreamOptions & { sourceToken: string }) {
    super(opts);
    this.sourceToken = opts.sourceToken;
    this.endpoint = envs.BETTERSTACK_ENDPOINT;
  }

  log(info: any, callback: () => void) {
    setImmediate(() => {
      this.emit('logged', info);
    });

    // Prepare log payload for BetterStack
    const payload = {
      dt: info.timestamp || new Date().toISOString(),
      level: info.level,
      message: info.message,
      ...info,
    };

    // Remove Winston metadata
    delete payload.timestamp;

    // Send to BetterStack
    fetch(this.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.sourceToken}`,
      },
      body: JSON.stringify(payload),
    }).catch((error) => {
      // Log error but don't fail the application
      console.error('Failed to send log to BetterStack:', error.message);
    });

    callback();
  }
}

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

  // BetterStack: Solo si está configurado el token
  if (envs.BETTERSTACK_SOURCE_TOKEN) {
    transports.push(
      new BetterStackTransport({
        sourceToken: envs.BETTERSTACK_SOURCE_TOKEN,
        level: 'info', // Solo enviar info y superiores a BetterStack
        format: productionFormat,
      }),
    );
  }
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
  environment: envs.NODE_ENV,
  level: logger.level,
  betterStackEnabled: !!envs.BETTERSTACK_SOURCE_TOKEN,
});
