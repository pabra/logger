import { getMaxLevelFilter } from './filters';
import {
  getJsonLengthFormatter,
  getTextLengthFormatter,
  textWithoutDataFormatter,
} from './formatters';
import {
  consoleTransporter,
  consoleWithoutDataTransporter,
} from './transporters';
import { Handler, LogLevelName } from './types';

// will pass raw data to console.log without converting to JSON or text
export const getConsoleRawDataHandler = (level?: LogLevelName): Handler => ({
  filter: level === undefined ? level : getMaxLevelFilter(level),
  formatter: textWithoutDataFormatter,
  transporter: consoleTransporter,
});

export const getConsoleTextHandler = (level?: LogLevelName): Handler => ({
  filter: level === undefined ? level : getMaxLevelFilter(level),
  formatter: getTextLengthFormatter(),
  transporter: consoleWithoutDataTransporter,
});

export const getConsoleJsonHandler = (level?: LogLevelName): Handler => ({
  filter: level === undefined ? level : getMaxLevelFilter(level),
  formatter: getJsonLengthFormatter(),
  transporter: consoleWithoutDataTransporter,
});
