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
import type { Handler, LogLevelName } from './types';

// will pass raw data to console.log without converting to JSON or text
export const getConsoleRawDataHandler = (level?: LogLevelName): Handler => {
  const formatter = textWithoutDataFormatter;
  const transporter = consoleTransporter;

  return level === undefined
    ? { formatter, transporter }
    : { filter: getMaxLevelFilter(level), formatter, transporter };
};

export const getConsoleTextHandler = (level?: LogLevelName): Handler => {
  const formatter = getTextLengthFormatter();
  const transporter = consoleWithoutDataTransporter;

  return level === undefined
    ? { formatter, transporter }
    : { filter: getMaxLevelFilter(level), formatter, transporter };
};

export const getConsoleJsonHandler = (level?: LogLevelName): Handler => {
  const formatter = getJsonLengthFormatter();
  const transporter = consoleWithoutDataTransporter;

  return level === undefined
    ? { formatter, transporter }
    : { filter: getMaxLevelFilter(level), formatter, transporter };
};
