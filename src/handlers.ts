import { getMaxLevelFilter } from './filters';
import {
  getJsonFormatter,
  getTextFormatter,
  textWithoutDataFormatter,
} from './formatters';
import { consoleTransporter } from './transporters';
import { Handler } from './types';

const consoleTextWithoutDataHandler: Handler = {
  filter: getMaxLevelFilter('warning'),
  formatter: textWithoutDataFormatter,
  transporter: consoleTransporter,
};

const consoleTextHandler: Handler = {
  filter: getMaxLevelFilter('warning'),
  formatter: getTextFormatter(),
  transporter: consoleTransporter,
};

const consoleJsonHandler: Handler = {
  filter: getMaxLevelFilter('warning'),
  formatter: getJsonFormatter(),
  transporter: consoleTransporter,
};

export {
  consoleJsonHandler,
  consoleTextWithoutDataHandler,
  consoleTextHandler,
};
