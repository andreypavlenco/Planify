import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

const Levels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
    http: 4,
    verbose: 5,
    input: 6,
    silly: 7,
    data: 8,
    help: 9,
    prompt: 10,
    emerg: 11,
    alert: 12,
    crit: 13,
    notice: 14,
  },
  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
    http: 'magenta',
    verbose: 'cyan',
    input: 'grey',
    silly: 'magenta',
    data: 'white',
    help: 'cyan',
    prompt: 'grey',
    emerg: 'red',
    alert: 'yellow',
    crit: 'red',
    notice: 'blue',
  },
};

@Injectable()
export class WinstonLoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    const logDir = path.join(process.cwd(), 'logs');

    this.logger = winston.createLogger({
      levels: Levels.levels,
      format: winston.format.combine(
        winston.format.ms(),
        winston.format.timestamp(),
        winston.format.colorize({ all: true, colors: Levels.colors }),
        winston.format.printf(({ timestamp, level, message, ms, ...meta }) => {
          const metaString = Object.keys(meta).length
            ? ` ${JSON.stringify(meta)}`
            : '';
          return `${timestamp} [${level}]: ${message} (${ms})${metaString}`;
        }),
      ),
      transports: [
        new winston.transports.DailyRotateFile({
          level: 'info',
          filename: 'rotate-%DATE%.log',
          dirname: logDir,
          datePattern: 'YYYY-MM-DD',
          format: winston.format.uncolorize(),
          zippedArchive: true,
          maxFiles: '20d',
          maxSize: '30m',
        }),
      ],
    });
  }

  error(message: string, meta?: Record<string, any>, trace?: string) {
    const logMessage = trace ? `${message} - ${trace}` : message;
    if (meta) {
      this.logger.error(logMessage, { ...meta });
    } else {
      this.logger.error(logMessage);
    }
  }

  warn(message: string, meta?: Record<string, any>) {
    this.logger.warn(message, meta);
  }

  help(message: string) {
    this.logger.help(message);
  }

  data(message: string) {
    this.logger.data(message);
  }

  info(message: string, meta?: Record<string, any>) {
    if (meta) {
      this.logger.info(message, { meta });
    } else {
      this.logger.info(message);
    }
  }

  debug(message: string, meta?: Record<string, any>) {
    this.logger.debug(message, meta || {});
  }
}
