/* eslint-disable import/no-unused-modules */
import { getMaxLevelFilter } from './filters';
import {
  getJsonLengthFormatter,
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

export default getLogger;
export { logLevels } from './levels';
export type {
  Filter,
  Formatter,
  Handler,
  Handlers,
  Transporter,
} from './types';
export const filters = { getMaxLevelFilter } as const;
export const formatters = {
  textWithoutDataFormatter,
  textFormatter,
  jsonFormatter,
  getTextLengthFormatter,
  getJsonLengthFormatter,
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
