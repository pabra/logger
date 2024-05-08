import type { JsonValue, LogLevelName, Transporter } from './types';
import { assertNever } from './utils';

function getConsoleLoggerForLevel(
  level: LogLevelName,
): (...data: any[]) => void {
  switch (level) {
    case 'emerg':
    case 'alert':
    case 'crit':
    case 'err':
      return console.error;

    case 'warning':
      return console.warn;

    case 'notice':
    case 'info':
      return console.info;

    case 'debug':
      return console.debug;

    default:
      assertNever(level);
      return console.log;
  }
}

export const consoleTransporter: Transporter<JsonValue> = (
  _logger,
  { level, data },
  messageFormatted,
) => {
  const consoleLogger = getConsoleLoggerForLevel(level);

  consoleLogger(messageFormatted, ...data);
};

export const consoleWithoutDataTransporter: Transporter<JsonValue> = (
  _logger,
  { level },
  messageFormatted,
) => {
  const consoleLogger = getConsoleLoggerForLevel(level);

  consoleLogger(messageFormatted);
};
