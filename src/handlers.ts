import { getMaxLevelFilter } from './filters';
import {
  getJsonFormatter,
  getTextFormatter,
  textWithoutDataFormatter,
} from './formatters';
import {
  consoleTransporter,
  consoleWithoutDataTransporter,
} from './transporters';
import { Handler } from './types';

// will pass raw data to console.log without convertinf to JSON or text
const consoleRawDataHandler: Handler = {
  filter: getMaxLevelFilter('warning'),
  formatter: textWithoutDataFormatter,
  transporter: consoleTransporter,
};

const consoleTextHandler: Handler = {
  filter: getMaxLevelFilter('warning'),
  formatter: getTextFormatter(),
  transporter: consoleWithoutDataTransporter,
};

const consoleJsonHandler: Handler = {
  filter: getMaxLevelFilter('warning'),
  formatter: getJsonFormatter(),
  transporter: consoleWithoutDataTransporter,
};

export { consoleJsonHandler, consoleRawDataHandler, consoleTextHandler };
