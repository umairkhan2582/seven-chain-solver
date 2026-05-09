import winston from 'winston';
import { config } from './config.js';

const { combine, timestamp, printf, colorize, json } = winston.format;

const prettyFormat = combine(
  colorize(),
  timestamp({ format: 'HH:mm:ss' }),
  printf(({ level, message, timestamp: ts, ...meta }) => {
    const extra = Object.keys(meta).length ? ' ' + JSON.stringify(meta) : '';
    return `${ts} [${level}] ${message}${extra}`;
  })
);

const jsonFormat = combine(
  timestamp(),
  json()
);

export const logger = winston.createLogger({
  level: config.logLevel ?? 'info',
  format: config.logFormat === 'json' ? jsonFormat : prettyFormat,
  transports: [new winston.transports.Console()],
});
