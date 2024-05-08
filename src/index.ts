/* eslint-disable import/no-unused-modules */
import { getMaxLevelFilter } from './filters';
import {
  getTextLengthFormatter,
  jsonFormatter,
  textFormatter,
  textWithoutDataFormatter,
} from './formatters';
import {
  getConsoleJsonHandler,
  getConsoleRawDataHandler,
  getConsoleTextHandler,
} from './handlers';
import { getLogger } from './logger';
import {
  consoleTransporter,
  consoleWithoutDataTransporter,
} from './transporters';
import { isLogLevelName } from './utils';

export default getLogger;
export type { JsonFormatterData } from './formatters';
export { logLevels } from './levels';
export type {
  Filter,
  Formatter,
  Handler,
  Handlers,
  LogLevelName,
  Logger,
  Message,
  MessageFormatted,
  Transporter,
} from './types';
export const filters = { getMaxLevelFilter } as const;
export const formatters = {
  textWithoutDataFormatter,
  textFormatter,
  jsonFormatter,
  getTextLengthFormatter,
} as const;
export const transporters = {
  consoleTransporter,
  consoleWithoutDataTransporter,
} as const;
export const handlers = {
  getConsoleTextHandler,
  getConsoleRawDataHandler,
  getConsoleJsonHandler,
} as const;
export const utils = {
  isLogLevelName,
};
