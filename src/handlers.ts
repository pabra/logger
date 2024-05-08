import { getMaxLevelFilter } from './filters';
import type { JsonFormatterData } from './formatters';
import {
  getTextLengthFormatter,
  jsonFormatter,
  textWithoutDataFormatter,
} from './formatters';
import {
  consoleTransporter,
  consoleWithoutDataTransporter,
} from './transporters';
import type { Handler, LogLevelName, Transporter } from './types';

// will pass raw data to console.log without converting to JSON or text
export const getConsoleRawDataHandler = (
  level?: LogLevelName,
): Handler<string> => {
  const formatter = textWithoutDataFormatter;
  const transporter = consoleTransporter as Transporter<string>;

  return level === undefined
    ? { formatter, transporter }
    : { filter: getMaxLevelFilter(level), formatter, transporter };
};

export const getConsoleTextHandler = (
  level?: LogLevelName,
): Handler<string> => {
  const formatter = getTextLengthFormatter();
  const transporter = consoleWithoutDataTransporter as Transporter<string>;

  return level === undefined
    ? { formatter, transporter }
    : { filter: getMaxLevelFilter(level), formatter, transporter };
};

export const getConsoleJsonHandler = (
  level?: LogLevelName,
): Handler<JsonFormatterData> => {
  const formatter = jsonFormatter;
  const transporter =
    consoleWithoutDataTransporter as unknown as Transporter<JsonFormatterData>;

  return level === undefined
    ? { formatter, transporter }
    : { filter: getMaxLevelFilter(level), formatter, transporter };
};
